import {
    is
} from '../../utils/ModelUtil';

import {
    Priority
} from '../../utils/ModelUtil';

export default class RegularBPMNContextPadProvider {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        // Insert with LOW_PRIORITY so that e.g. set-color can be removed from the ColorContextPadProvider
        contextPad.registerProvider(Priority.Low, this);
    }

    getContextPadEntries(element) {
        return function (entries) {
            if (is(element, "regularBPMN:Entity") || is(element, "regularBPMN:Resource") || is(element, "regularBPMN:ResourceBoM") || is(element, "regularBPMN:ResourceWaste")) {
                Object.keys(entries).forEach(function (k) {
                    if (k.startsWith('append.')) {
                        delete entries[k];
                    }
                });
            }
            if (is(element, "regularBPMN:Entity") ) {
                delete entries["replace"];
            }
            if ((is(element, 'regularBPMN:Resource') || is(element, 'regularBPMN:ResourceBoM') || is(element, 'regularBPMN:ResourceWaste')) && element.businessObject.isFromParent) {
                delete entries["set-color"];
            }
            return entries;
        };
    }
}

RegularBPMNContextPadProvider.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate'
];