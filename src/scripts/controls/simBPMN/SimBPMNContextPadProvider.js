export default class SimBPMNContextPadProvider {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        const {
            autoPlace,
            create,
            elementFactory,
            translate
        } = this;


        function createSimBPMNAction(type, group, title, classname) {

            function createDragListener(event) {
                var shape = elementFactory.createShape( { type: type });

                create.start(event, shape);
            }

            function createListener(event, element) {
                if(autoPlace) {
                    const shape = elementFactory.createShape({type: type});

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


        return {
            'append.simBPMN-Queue': createSimBPMNAction('simBPMN:Queue', 'simBPMN', translate('Append Queue'), 'simBPMN-queue-icon'),
            'append.simBPMN-Server': createSimBPMNAction('simBPMN:Server', 'simBPMN', translate('Append Server'), 'simBPMN-server-icon'),
            'append.simBPMN-Output': createSimBPMNAction('simBPMN:Output', 'simBPMN', translate('Append Output'), 'simBPMN-output-icon')
        };
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