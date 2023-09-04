import {
    assign
} from 'min-dash';

import {
    is, Priority
} from '../../utils/ModelUtil';

export default class SimBPMNContextPadProvider {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        // Insert with Priority.Low so that e.g. set-color can be removed from the ColorContextPadProvider
        contextPad.registerProvider(Priority.Low, this);
    }

    getContextPadEntries(element) {
        const {
            autoPlace,
            create,
            elementFactory,
            translate
        } = this;

        return function (entries) {
            if (is(element, "simBPMN:Token") || is(element, "simBPMN:Resource") || is(element, "simBPMN:ResourceBoM") || is(element, "simBPMN:ResourceWaste")) {
                Object.keys(entries).forEach(function (k) {
                    if (k.startsWith('append.')) {
                        delete entries[k];
                    }
                });
                delete entries["replace"];
                if (is(element, "simBPMN:Resource") || is(element, "simBPMN:ResourceBoM") || is(element, "simBPMN:ResourceWaste")) {
                    delete entries["set-color"];
                }
            } else {
                assign(entries, { 'append.simBPMN-Queue': createSimBPMNAction('simBPMN:Queue', 'simBPMN', translate('Append Queue'), 'simBPMN-queue-icon') })
                assign(entries, { 'append.simBPMN-Server': createSimBPMNAction('simBPMN:Server', 'simBPMN', translate('Append Server'), 'simBPMN-server-icon') })
                assign(entries, { 'append.simBPMN-Output': createSimBPMNAction('simBPMN:Output', 'simBPMN', translate('Append Output'), 'simBPMN-output-icon') })
            }
            return entries;
        };

        function createSimBPMNAction(type, group, title, classname) {

            function createDragListener(event) {
                var shape = elementFactory.createShape({ type: type });

                create.start(event, shape);
            }

            function createListener(event, element) {
                if (autoPlace) {
                    const shape = elementFactory.createShape({ type: type });

                    autoPlace.append(element, shape);
                } else {
                    createDragListener(event);
                }
            }

            return {
                group: group,
                className: classname,
                title: title,
                action: {
                    dragstart: createListener,
                    click: createListener
                }
            };
        }
    }
}

SimBPMNContextPadProvider.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate'
];