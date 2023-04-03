import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';
import Resource from './source/resource';
import Entity from './source/entity';
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove,
  classes as svgClasses,
  innerSVG
} from 'tiny-svg';
import {
  Priority
} from '../../utils/ModelUtil';

import svgResource from "./source/resource.svg";
import svgEntity from "./source/entity.svg";

const TASK_BORDER_RADIUS = 2;

export default class RegularBPMNRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, Priority.High);

    this.bpmnRenderer = bpmnRenderer;
  }

  //BaseRenderer.call(this, eventBus, 1500);

  canRender(element) {
    return is(element, 'regularBPMN:Entity') || is(element, 'regularBPMN:Resource') || is(element, 'bpmn:Task');
  };

  drawShape(parent, shape) {
    if (is(shape, 'bpmn:Task')) {
      const task = this.bpmnRenderer.drawShape(parent, shape);

      var svg = svgCreate('image', {
        x: shape.width - 5 - (shape.width / 4),
        y: 0,
        width: shape.width / 4,
        height: shape.height / 4,
        href: svgResource
      });

      //const rect = drawRect(parent, 100, 80, TASK_BORDER_RADIUS, '#52B415');

      //prependTo(rect, parent);
      //prependTo(svg, parent)
      svgAppend(parent, svg)

      //svgRemove(task);

      return task;
    }

    console.log('render');

    var svg;
    var color = shape.di.get('color:background-color')
    if (color) {
      svg = loadColorized(shape);
    } else {
      svg = loadFromUrl(shape);
    }

    svgAppend(parent, svg);
    var bo = getBusinessObject(shape);

    if (bo.name) {
      var width = shape.width;
      var height = shape.height;
      var lines = bo.name.trim().split('\n');
      var textArea = svgCreate('text');
      var text = '';
      var fontsize = 12;
      for (var i = 0; i < lines.length; ++i) {
        text += '<tspan x="' + width / 2 + '" y="+' + (height + 16) + '">' + lines[i] + '</tspan>';
      }
      innerSVG(textArea, text);
      svgAttr(textArea, {
        fontFamily: 'Arial, sans-serif',
        fontSize: fontsize,
        textAnchor: 'middle',
        width: width,
        x: width,
        y: 0
      });
      svgAppend(parent, textArea);
    }
    return svg;
  };
}

function loadColorized(shape) {
  var svgCode = '';
  var viewBox = '';
  if (is(shape, "regularBPMN:Resource")) {
    svgCode = '<defs/><g><ellipse cx="108" cy="65" rx="108" ry="65" fill="@@colorFill" stroke="@@colorStroke" stroke-width="6px" pointer-events="all"/><ellipse cx="108" cy="65" rx="40" ry="40" fill="@@colorStroke" stroke="@@colorStroke" pointer-events="all"/></g>'
    viewBox = "-3 -0.5 222 132";
  } else if (is(shape, "regularBPMN:Entity")) {
    svgCode = '<defs/><g><path d="M 0 0 L 46 25 L 0 50 Z" fill="@@colorFill" stroke="@@colorStroke" stroke-width="2px" stroke-miterlimit="10" pointer-events="all"/></g>'
    viewBox = "-0.5 -0.5 47 51";
  }

  var colorFill = "transparent";
  var colorStroke = "rgb(0, 0, 0)";

  colorFill = shape.di.get('color:background-color');
  colorStroke = shape.di.get('color:border-color')
  svgCode = svgCode.replaceAll("@@colorFill", colorFill);
  svgCode = svgCode.replaceAll("@@colorStroke", colorStroke);

  var width = shape.width;
  var height = shape.height;

  var svgInline = svgCreate('svg', {
    x: 0,
    y: 0,
    width: width,
    height: height,
    viewBox: viewBox
  })

  innerSVG(svgInline, svgCode);

  return svgInline;
}

function loadFromUrl(shape) {
  var url = '';
  if (is(shape, "regularBPMN:Resource")) {
    url = svgResource;
  } else if (is(shape, "regularBPMN:Entity")) {
    url = svgEntity;
  }

  var width = shape.width,
    height = shape.height;

  var svg = svgCreate('image', {
    x: 0,
    y: 0,
    width: width,
    height: height,
    href: url
  });

  return svg;
}

function drawCircle(parentGfx, width, height, offset, attrs) {


  // var cx = width / 2,
  //   cy = height / 2;

  var circle = svgCreate('circle');
  svgAttr(circle, {
    //cx: cx,
    //cy: cy,
    r: Math.round((width + height) / 4)
  });

  //svgAttr(circle, attrs);
  svgAppend(parentGfx, circle);
  return circle;
}
//inherits(RegularBPMNRenderer, BaseRenderer);
RegularBPMNRenderer.$inject = ['eventBus', 'bpmnRenderer'];

//RegularBPMNRenderer.prototype.canRender = function (element) {
//    return /^regularBPMN:/.test(element.type);
//};

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, strokeColor) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#000',
    strokeWidth: 2,
    fill: '#fff'
  });

  svgAppend(parentNode, rect);

  return rect;
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo(newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}