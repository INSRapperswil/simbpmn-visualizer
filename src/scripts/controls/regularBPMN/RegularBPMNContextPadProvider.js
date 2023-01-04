export default class RegularBPMNContextPadProvider {
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


        function createRegularBPMNAction(type, group, title, classname) {

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


        //return {
        //    'append.regularBPMN-Resource': createRegularBPMNAction('regularBPMN:Resource', 'regularBPMN', translate('Append Resource'), 'regularBPMN-resource-icon'),
        //    'append.regularBPMN-Entity': createRegularBPMNAction('regularBPMN:Entity', 'regularBPMN', translate('Append Entity'), 'regularBPMN-entity-icon')
        //};
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