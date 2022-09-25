import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
    is
} from 'bpmn-js/lib/util/ModelUtil';
import Queue from './source/queue';
import Server from './source/server';
import Output from './source/output';
import {
    append as svgAppend,
    create as svgCreate
} from 'tiny-svg';

export default function SimBPMNRenderer(eventBus) {
    BaseRenderer.call(this, eventBus, 1500);

    this.canRender = function(element) {
        return is(element, 'simBPMN:Queue') || is(element, 'simBPMN:Server') || is(element, 'simBPMN:Output');
    };
    this.drawShape = function(parent, shape) {
        let url = '';
        if(is(shape, "simBPMN:Queue")){
            url = Queue.dataURL;
        }
        if(is(shape, "simBPMN:Server")){
            url = Server.dataURL;
        }

        if(is(shape, "simBPMN:Output")){
            url = Output.dataURL;
        }
        var entityGfx = svgCreate('image', {
            x: 0,
                y: 0,
                width: shape.width,
                height: shape.height,
                href: url
        });
        svgAppend(parent, entityGfx);
        return entityGfx;
    };
}
inherits(SimBPMNRenderer, BaseRenderer);
SimBPMNRenderer.$inject = [ 'eventBus' ];
