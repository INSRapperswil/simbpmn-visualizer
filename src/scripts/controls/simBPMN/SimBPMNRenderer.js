import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';
import Resource from './source/resource';
import Token from './source/token';
import Queue from './source/queue';
import Server from './source/server';
import ServerSeize from './source/server_seize';
import ServerDelay from './source/server_delay';
import ServerRelease from './source/server_release';
import Output from './source/output';
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



export default function SimBPMNRenderer(eventBus) {
    BaseRenderer.call(this, eventBus, 1500);

    this.canRender = function(element) {
        return is(element, 'simBPMN:Resource') || is(element, 'simBPMN:Token') || is(element, 'simBPMN:Queue') || is(element, 'simBPMN:Server') || is(element, 'simBPMN:ServerSeize') || is(element, 'simBPMN:ServerDelay') || is(element, 'simBPMN:ServerRelease') || is(element, 'simBPMN:Output');
    };
    this.drawShape = function(parent, shape) {
        let url = '';
        if(is(shape, "simBPMN:Resource")){
            url = Resource.dataURL;
        } else if(is(shape, "simBPMN:Token")){
            url = Token.dataURL;
        } else if(is(shape, "simBPMN:Queue")){
            url = Queue.dataURL;
        } else if(is(shape, "simBPMN:Server")){
            url = Server.dataURL;
          } else if(is(shape, "simBPMN:ServerSeize")){
            url = ServerSeize.dataURL;
          } else if(is(shape, "simBPMN:ServerDelay")){
            url = ServerDelay.dataURL;
          } else if(is(shape, "simBPMN:ServerRelease")){
            url = ServerRelease.dataURL;
        } else if(is(shape, "simBPMN:Output")){
            url = Output.dataURL;
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
        svgAppend(parent, svg);

        var bo = getBusinessObject(shape);
   
        if (bo.name) {
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
inherits(SimBPMNRenderer, BaseRenderer);
SimBPMNRenderer.$inject = [ 'eventBus' ];
