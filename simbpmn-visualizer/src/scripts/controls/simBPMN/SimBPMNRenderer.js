import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

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

import svgResource from "./source/resource.svg";
import svgToken from "./source/token.svg";
import svgQueue from "./source/queue.svg";
import svgServer from "./source/server.svg";
import svgServerSeize from "./source/server_seize.svg";
import svgServerDelay from "./source/server_delay.svg";
import svgServerRelease from "./source/server_release.svg";
import svgOutput from "./source/output.svg";

export default function SimBPMNRenderer(eventBus) {
  BaseRenderer.call(this, eventBus, 1500);

  this.canRender = function (element) {
    return is(element, 'simBPMN:Resource') || is(element, 'simBPMN:Token') || is(element, 'simBPMN:Queue') || is(element, 'simBPMN:Server') || is(element, 'simBPMN:ServerSeize') || is(element, 'simBPMN:ServerDelay') || is(element, 'simBPMN:ServerRelease') || is(element, 'simBPMN:Output');
  };
  this.drawShape = function (parent, shape) {
    // let url = '';
    // if (is(shape, "simBPMN:Resource")) {
    //   url = Resource.dataURL;
    // } else if (is(shape, "simBPMN:Token")) {
    //   url = Token.dataURL;
    // } else if (is(shape, "simBPMN:Queue")) {
    //   url = Queue.dataURL;
    // } else if (is(shape, "simBPMN:Server")) {
    //   url = Server.dataURL;
    // } else if (is(shape, "simBPMN:ServerSeize")) {
    //   url = ServerSeize.dataURL;
    // } else if (is(shape, "simBPMN:ServerDelay")) {
    //   url = ServerDelay.dataURL;
    // } else if (is(shape, "simBPMN:ServerRelease")) {
    //   url = ServerRelease.dataURL;
    // } else if (is(shape, "simBPMN:Output")) {
    //   url = Output.dataURL;
    // }

    // var width = shape.width,
    //   height = shape.height;

    // var svg = svgCreate('image', {
    //   x: 0,
    //   y: 0,
    //   width: width,
    //   height: height,
    //   href: url
    // });

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
  if (is(shape, "simBPMN:Resource")) {
    svgCode = '<defs/><g><ellipse cx="108" cy="65" rx="108" ry="65" fill="@@colorFill" stroke="@@colorStroke" stroke-width="6px" pointer-events="all"/><ellipse cx="108" cy="65" rx="40" ry="40" fill="@@colorStroke" stroke="@@colorStroke" pointer-events="all"/></g>'
    viewBox = "-3 -0.5 222 132";
  } else if (is(shape, "simBPMN:Token")) {
    svgCode = '<defs/><g><path d="M 0 0 L 46 25 L 0 50 Z" fill="@@colorFill" stroke="@@colorStroke" stroke-width="2px" stroke-miterlimit="10" pointer-events="all"/></g>'
    viewBox = "-0.5 -0.5 47 51";
  } else if (is(shape, "simBPMN:Queue")) {
    svgCode = '<defs/><g><path d="M 21.6 31.2 L 21.6 1.2" fill="none" stroke="@@colorStroke" stroke-width="3" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 27.6 31.2 L 27.6 1.2" fill="none" stroke="@@colorStroke" stroke-width="3" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 33.6 31.2 L 33.6 1.2" fill="none" stroke="@@colorStroke" stroke-width="3" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 15.6 31.2 L 15.6 1.2" fill="none" stroke="@@colorStroke" stroke-width="3" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 37.5 19.58 L 45.15 19.58 C 45.25 19.57 45.34 19.5 45.39 19.39 C 45.44 19.28 45.45 19.14 45.41 19.02 L 41.5 12.92 C 41.39 12.83 41.26 12.83 41.15 12.92 L 37.24 19.02 C 37.2 19.14 37.2 19.28 37.26 19.39 C 37.31 19.5 37.4 19.57 37.5 19.58 Z" fill="@@colorFill" stroke="@@colorStroke" stroke-width="0.6" stroke-miterlimit="10" transform="rotate(90,41.32,16.2)" pointer-events="all"/><path d="M 3.9 19.58 L 11.55 19.58 C 11.65 19.57 11.74 19.5 11.79 19.39 C 11.84 19.28 11.85 19.14 11.81 19.02 L 7.9 12.92 C 7.79 12.83 7.66 12.83 7.55 12.92 L 3.64 19.02 C 3.6 19.14 3.6 19.28 3.66 19.39 C 3.71 19.5 3.8 19.57 3.9 19.58 Z" fill="@@colorFill" stroke="@@colorStroke" stroke-width="0.6" stroke-miterlimit="10" transform="rotate(90,7.73,16.2)" pointer-events="all"/><path d="M 0.6 31.2 L 48.6 31.2" fill="none" stroke="@@colorStroke" stroke-width="1.2" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 0.6 1.2 L 48.6 1.2" fill="none" stroke="@@colorStroke" stroke-width="1.2" stroke-miterlimit="10" pointer-events="stroke"/><path d="M 48 1.2 L 48 31.2" fill="none" stroke="@@colorStroke" stroke-width="1.2" stroke-miterlimit="10" pointer-events="stroke"/></g>'
    viewBox = "-0.5 -0.5 51 34";
  } else if (is(shape, "simBPMN:Server")) {
    svgCode = '<defs/><g><rect x="11" y="11" width="650" height="480" rx="240" ry="240" fill="@@colorFill" stroke="@@colorStroke" stroke-width="23" pointer-events="all"/><rect x="41" y="221" width="260" height="60" fill="@@colorFill" stroke="@@colorStroke" stroke-width="5" transform="rotate(90,171,251)" pointer-events="all"/><rect x="371" y="221" width="260" height="60" fill="@@colorFill" stroke="@@colorStroke" stroke-width="5" transform="rotate(90,501,251)" pointer-events="all"/><rect x="206" y="221" width="260" height="60" fill="@@colorFill" stroke="@@colorStroke" stroke-width="5" transform="rotate(90,336,251)" pointer-events="all"/></g>'
    viewBox = "-0.5 -0.5 673 503";
  } else if (is(shape, "simBPMN:ServerSeize")) {
    svgCode = '<defs/><g><path d="M 11 11 L 31 11 Q 271 11 271 251 Q 271 491 31 491 L 11 491 Z" fill="@@colorFill" stroke="@@colorStroke" stroke-width="23" stroke-miterlimit="10" transform="rotate(-180,141,251)" pointer-events="all"/><rect x="42" y="221" width="260" height="60" fill="@@colorFill" stroke="@@colorStroke" stroke-width="5" transform="rotate(90,172,251)" pointer-events="all"/></g>'
    viewBox = "-0.5 -0.5 283 503";
  } else if (is(shape, "simBPMN:ServerDelay")) {
    svgCode = '<defs/><g><rect x="11" y="11" width="220" height="480" fill="@@colorFill" stroke="@@colorStroke" stroke-width="23" pointer-events="all"/><rect x="-9" y="221" width="260" height="60" fill="@@colorFill" stroke="@@colorStroke" stroke-width="5" transform="rotate(90,121,251)" pointer-events="all"/></g>'
    viewBox = "-0.5 -0.5 243 503";
  } else if (is(shape, "simBPMN:ServerRelease")) {
    svgCode = '<defs/><g><path d="M 11 11 L 31 11 Q 271 11 271 251 Q 271 491 31 491 L 11 491 Z" fill="@@colorFill" stroke="@@colorStroke" stroke-width="23" stroke-miterlimit="10" pointer-events="all"/><rect x="-29" y="221" width="260" height="60" fill="@@colorFill" stroke="@@colorStroke" stroke-width="5" transform="rotate(90,101,251)" pointer-events="all"/></g>'
    viewBox = "-0.5 -0.5 283 503";
  } else if (is(shape, "simBPMN:Output")) {
    svgCode = '<defs/><g><path d="M 26 21 L 86 21 L 86 0 L 126 35 L 86 70 L 86 49 L 26 49 L 26 35 Z" fill="@@colorFill" stroke="@@colorStroke" stroke-miterlimit="10" pointer-events="all"/><rect x="4" y="30" width="28" height="10" fill="@@colorFill" stroke="@@colorStroke" transform="rotate(-90,18,35)" pointer-events="all"/><rect x="-9" y="30" width="28" height="10" fill="@@colorFill" stroke="@@colorStroke" transform="rotate(-90,5,35)" pointer-events="all"/></g>'
    viewBox = "-0.5 -0.5 127 71";
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
  if (is(shape, "simBPMN:Resource")) {
    url = svgResource;
  } else if (is(shape, "simBPMN:Token")) {
    url = svgToken;
  } else if (is(shape, "simBPMN:Queue")) {
    url = svgQueue;
  } else if (is(shape, "simBPMN:Server")) {
    url = svgServer;
  } else if (is(shape, "simBPMN:ServerSeize")) {
    url = svgServerSeize;
  } else if (is(shape, "simBPMN:ServerDelay")) {
    url = svgServerDelay;
  } else if (is(shape, "simBPMN:ServerRelease")) {
    url = svgServerRelease;
  } else if (is(shape, "simBPMN:Output")) {
    url = svgOutput;
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

inherits(SimBPMNRenderer, BaseRenderer);
SimBPMNRenderer.$inject = ['eventBus'];
