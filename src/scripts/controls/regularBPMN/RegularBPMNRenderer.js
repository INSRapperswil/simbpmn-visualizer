import inherits from 'inherits';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
    is
} from 'bpmn-js/lib/util/ModelUtil';
import Resource from './source/resource';
import Entity from './source/entity';
import {
    append as svgAppend,
    create as svgCreate
} from 'tiny-svg';

export default function RegularBPMNRenderer(eventBus) {
    BaseRenderer.call(this, eventBus, 1500);

    this.canRender = function(element) {
        return is(element, 'regularBPMN:Entity') || is(element, 'regularBPMN:Resource');
    };
    this.drawShape = function(parent, shape) {
        let url = '';
        if(is(shape, "regularBPMN:Resource")){
            url = Resource.dataURL;
        } else if(is(shape, "regularBPMN:Entity")){
            url = Entity.dataURL;
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
inherits(RegularBPMNRenderer, BaseRenderer);
RegularBPMNRenderer.$inject = [ 'eventBus' ];

RegularBPMNRenderer.prototype.canRender = function(element) {
    return /^regularBPMN:/.test(element.type);
  };