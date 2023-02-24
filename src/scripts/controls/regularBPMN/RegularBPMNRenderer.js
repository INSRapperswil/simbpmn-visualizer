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
  innerSVG
} from 'tiny-svg';
import {
  Priority
} from '../../utils/ModelUtil';

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
        href: Resource.dataURL
      });

      //const rect = drawRect(parent, 100, 80, TASK_BORDER_RADIUS, '#52B415');

      //prependTo(rect, parent);
      //prependTo(svg, parent)
      svgAppend(parent, svg)

      //svgRemove(task);

      return task;
    }
    let url = '';
    if (is(shape, "regularBPMN:Resource")) {
      url = Resource.dataURL;
    } else if (is(shape, "regularBPMN:Entity")) {
      url = Entity.dataURL;
    }
    /*
            var svg = svgCreate('circle');
            svgAttr(svg, {
              //cx: cx,
              //cy: cy,
              strokeWidth: 1,
            fill: 'red',
            stroke: 'red',
              r: Math.round((shape.width + shape.height) / 4)
            });
    */



    var width = shape.width,
      height = shape.height;

    var svg = svgCreate('image', {
      x: 0,
      y: 0,
      width: width,
      height: height,
      href: url
    });


    svgAppend(parent, svg);
    var bo, color;
    bo = getBusinessObject(shape);
    //color = bo.get('tp:color');
    //color = bo.get('color:background-color');

    //if (color) {
    //  svgAttr(svg, 'fill', color);
    //}

    if (bo.name) {
      var lines = bo.name.trim().split('\n');
      var textArea = svgCreate('text');
      var text = '';
      var fontsize = 11;
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