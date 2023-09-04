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
import svgResourceBoM from "./source/resource_bom.svg";
import svgResourceWaste from "./source/resource_waste.svg";
import svgEntity from "./source/entity.svg";

const TASK_BORDER_RADIUS = 2;

export default class RegularBPMNRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, Priority.High);

    this.bpmnRenderer = bpmnRenderer;
  }

  //BaseRenderer.call(this, eventBus, 1500);

  canRender(element) {
    return is(element, 'regularBPMN:Entity') || is(element, 'regularBPMN:Resource') || is(element, 'regularBPMN:ResourceBoM') || is(element, 'regularBPMN:ResourceWaste') || is(element, 'bpmn:Task');
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
  } else if (is(shape, "regularBPMN:ResourceBoM")) {
    svgCode = '<defs/><g><ellipse cx="108" cy="65" rx="108" ry="65" fill="@@colorFill" stroke="@@colorStroke" stroke-width="6px" pointer-events="all"/><path stroke="@@colorStroke" d="M 127.248 69.249 C 126.212 69.249 125.365 70.097 125.365 71.131 L 125.365 93.374 C 125.365 93.919 125.12 94.445 124.688 94.878 C 124.123 95.425 123.314 95.781 122.449 95.706 C 120.811 95.668 119.72 94.371 119.72 93.204 L 119.72 89.948 C 119.72 88.913 118.874 88.067 117.839 88.067 L 83.967 88.067 L 83.967 46.669 L 104.666 46.706 C 105.701 46.706 106.549 45.86 106.549 44.825 L 106.549 44.787 C 106.549 43.752 105.701 42.905 104.666 42.905 L 83.967 42.905 C 81.897 42.905 80.203 44.599 80.203 46.669 L 80.203 88.067 L 76.441 88.067 C 75.406 88.067 74.558 88.913 74.558 89.948 L 74.558 92.752 C 74.201 95.857 76.76 98.661 80.58 99.338 C 80.693 99.357 80.863 99.357 80.976 99.357 L 121.601 99.357 C 121.714 99.357 121.809 99.357 121.922 99.338 C 122.072 99.338 122.204 99.357 122.355 99.357 L 122.543 99.357 C 124.33 99.357 126.062 98.661 127.322 97.457 C 128.49 96.309 129.129 94.822 129.129 93.261 L 129.129 71.131 C 129.129 70.097 128.282 69.249 127.248 69.249 Z M 81.089 95.594 C 79.583 95.293 78.134 94.296 78.303 93.148 C 78.322 93.054 78.322 92.959 78.322 92.865 L 78.322 91.83 L 115.956 91.83 L 115.956 93.091 C 115.956 93.975 116.164 94.822 116.521 95.594 L 81.089 95.594 Z" style=""/><path stroke="@@colorStroke" d="M 93.319 57.959 L 104.572 57.959 C 105.607 57.959 106.454 57.112 106.454 56.077 C 106.454 55.043 105.607 54.196 104.572 54.196 L 93.319 54.196 C 92.285 54.196 91.438 55.043 91.438 56.077 C 91.438 57.112 92.285 57.959 93.319 57.959 Z" style=""/><path stroke="@@colorStroke" d="M 93.319 80.54 L 115.9 80.54 C 116.936 80.54 117.782 79.693 117.782 78.658 C 117.782 77.623 116.936 76.776 115.9 76.776 L 93.319 76.776 C 92.285 76.776 91.438 77.623 91.438 78.658 C 91.438 79.693 92.285 80.54 93.319 80.54 Z" style=""/><path stroke="@@colorStroke" d="M 115.862 61.723 L 93.319 61.723 C 92.285 61.723 91.438 62.569 91.438 63.604 C 91.438 64.64 92.285 65.486 93.319 65.486 L 115.862 65.486 C 116.898 65.486 117.745 64.64 117.745 63.604 C 117.745 62.569 116.898 61.723 115.862 61.723 Z" style=""/><path stroke="@@colorStroke" d="M 93.319 73.013 L 115.862 73.013 C 116.898 73.013 117.745 72.166 117.745 71.131 C 117.745 70.097 116.898 69.249 115.862 69.249 L 93.319 69.249 C 92.285 69.249 91.438 70.097 91.438 71.131 C 91.438 72.166 92.285 73.013 93.319 73.013 Z" style=""/><path stroke="@@colorStroke" d="M 141.266 34.607 L 140.174 34.061 L 136.655 32.31 L 135.96 31.972 L 132.893 30.429 L 129.129 28.567 L 128.075 28.039 C 127.548 27.777 126.927 27.777 126.4 28.039 L 125.365 28.548 L 121.601 30.429 L 118.535 31.954 L 117.839 32.31 L 114.32 34.061 L 113.228 34.607 C 112.588 34.926 112.194 35.586 112.194 36.3 L 112.194 54.402 C 112.194 55.118 112.588 55.776 113.228 56.096 L 126.4 62.701 C 126.927 62.965 127.567 62.965 128.094 62.701 L 141.266 56.096 C 141.906 55.776 142.302 55.118 142.302 54.402 L 142.302 36.3 C 142.302 35.586 141.906 34.926 141.266 34.607 Z M 125.365 57.959 L 115.956 53.254 L 115.956 39.367 L 125.365 44.072 L 125.365 57.959 Z M 127.248 40.797 L 121.601 37.975 L 118.252 36.3 L 118.516 36.168 L 121.601 34.626 L 122.732 34.061 L 125.365 32.763 L 127.248 31.822 L 129.129 32.763 L 131.745 34.061 L 132.893 34.645 L 135.96 36.168 L 136.223 36.3 L 132.893 37.975 L 127.248 40.797 Z M 138.538 53.254 L 129.129 57.959 L 129.129 44.072 L 138.538 39.367 L 138.538 53.254 Z" style=""/></g>'
    viewBox = "-3 -0.5 222 132";
  } else if (is(shape, "regularBPMN:ResourceWaste")) {
    svgCode = '<defs/><g><ellipse cx="108" cy="65" rx="108" ry="65" fill="@@colorFill" stroke="@@colorStroke" stroke-width="6px" pointer-events="all"/><path stroke="@@colorStroke" d="M 94.627 52.185 C 96.064 52.185 97.224 53.348 97.224 54.779 L 97.224 85.935 C 97.224 87.934 95.063 89.179 93.329 88.182 C 92.529 87.716 92.032 86.858 92.032 85.935 L 92.032 54.779 C 92.032 53.348 93.195 52.185 94.627 52.185 Z M 107.608 52.185 C 109.045 52.185 110.204 53.348 110.204 54.779 L 110.204 85.935 C 110.204 87.934 108.044 89.179 106.311 88.182 C 105.509 87.716 105.01 86.858 105.01 85.935 L 105.01 54.779 C 105.01 53.348 106.175 52.185 107.608 52.185 Z M 123.185 54.779 C 123.185 52.782 121.024 51.531 119.291 52.534 C 118.49 52.994 117.993 53.852 117.993 54.779 L 117.993 85.935 C 117.993 87.934 120.157 89.179 121.887 88.182 C 122.691 87.716 123.185 86.858 123.185 85.935 L 123.185 54.779 Z" style=""/><path fill-rule="evenodd" stroke="@@colorStroke" d="M 141.359 39.204 C 141.359 42.072 139.036 44.396 136.166 44.396 L 133.57 44.396 L 133.57 91.128 C 133.57 96.859 128.923 101.512 123.185 101.512 L 92.032 101.512 C 86.299 101.512 81.647 96.859 81.647 91.128 L 81.647 44.396 L 79.05 44.396 C 76.182 44.396 73.858 42.072 73.858 39.204 L 73.858 34.009 C 73.858 31.14 76.182 28.819 79.05 28.819 L 97.224 28.819 C 97.224 25.948 99.551 23.627 102.416 23.627 L 112.801 23.627 C 115.671 23.627 117.993 25.948 117.993 28.819 L 136.166 28.819 C 139.036 28.819 141.359 31.14 141.359 34.009 L 141.359 39.204 Z M 87.453 44.396 L 86.839 44.701 L 86.839 91.128 C 86.839 93.993 89.165 96.318 92.032 96.318 L 123.185 96.318 C 126.057 96.318 128.377 93.993 128.377 91.128 L 128.377 44.701 L 127.764 44.396 L 87.453 44.396 Z M 79.05 39.204 L 79.05 34.009 L 136.166 34.009 L 136.166 39.204 L 79.05 39.204 Z" style=""/></g>'
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
  } else if (is(shape, "regularBPMN:ResourceBoM")) {
    url = svgResourceBoM;
  } else if (is(shape, "regularBPMN:ResourceWaste")) {
    url = svgResourceWaste;
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