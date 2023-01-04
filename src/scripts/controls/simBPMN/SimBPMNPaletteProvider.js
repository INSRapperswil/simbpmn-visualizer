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

        function createSimBPMNAction(type, group, title, classname) {

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
            //'create-resource': createSimBPMNAction(
            //    'simBPMN:Resource', 'simBPMN', translate('Create Resource'), 'simBPMN-resource-icon simBPMN-palette-icon'
            //),
            'create-token': createSimBPMNAction(
                'simBPMN:Token', 'simBPMN', translate('Create Token'), 'simBPMN-token-icon simBPMN-palette-icon'
            ),
            'create-queue': createSimBPMNAction(
                'simBPMN:Queue', 'simBPMN', translate('Create Queue'), 'simBPMN-queue-icon simBPMN-palette-icon'
            ),
            'create-server': createSimBPMNAction(
                'simBPMN:Server', 'simBPMN', translate('Create Server'), 'simBPMN-server-icon simBPMN-palette-icon'
            ),
            'create-output': createSimBPMNAction(
                'simBPMN:Output', 'simBPMN', translate('Create Output'), 'simBPMN-output-icon simBPMN-palette-icon'
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
