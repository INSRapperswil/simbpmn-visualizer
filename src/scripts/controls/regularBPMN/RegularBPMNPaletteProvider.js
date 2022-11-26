export default class PaletteProvider {
    constructor(palette, create, elementFactory,
                translate) {
        this.palette = palette;
        this.create = create;
        this.elementFactory = elementFactory;

        this.translate = translate;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        const {
            create, elementFactory, translate
        } = this;

        function createRegularBPMNAction(type, group, title, classname) {

            function createListener(event) {
                var shape = elementFactory.createShape( { type: type });

                create.start(event, shape);
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
            'create-resource': createRegularBPMNAction(
                'regularBPMN:Resource', 'regularBPMN', translate('Create Resource'), 'regularBPMN-resource-icon'
            ),
            'create-entity': createRegularBPMNAction(
                'regularBPMN:Entity', 'regularBPMN', translate('Create Entity'), 'regularBPMN-entity-icon'
            )
        }
    }
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'translate'
];
