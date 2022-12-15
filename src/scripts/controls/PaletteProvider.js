import {
    assign
} from 'min-dash';

import { getDi } from '../utils/ModelUtil';

export default class PaletteProvider {
    constructor(palette, create, elementFactory,
                spaceTool, lassoTool,
                globalConnect, translate) {
        this.palette = palette;
        this.create = create;
        this.elementFactory = elementFactory;
        this.spaceTool = spaceTool;
        this.lassoTool = lassoTool;
        this.globalConnect = globalConnect;
        this.translate = translate;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        const {
            create, elementFactory,
            spaceTool, lassoTool,
            globalConnect, translate
        } = this;

        function createAction(type, group, className, title, options) {

            function createListener(event) {
                var shape = elementFactory.createShape(assign({ type: type }, options));

                if (options) {
                    var di = getDi(shape);
                    di.isExpanded = options.isExpanded;
                }

                create.start(event, shape);
            }

            var shortType = type.replace(/^bpmn:/, '');

            return {
                group: group,
                className: className,
                title: title || translate('Create {type}', { type: shortType }),
                action: {
                    dragstart: createListener,
                    click: createListener
                }
            };
        }

        function createSubprocess(event) {
            var subProcess = elementFactory.createShape({
                type: 'bpmn:SubProcess',
                x: 0,
                y: 0,
                isExpanded: true
            });

            var startEvent = elementFactory.createShape({
                type: 'bpmn:StartEvent',
                x: 40,
                y: 82,
                parent: subProcess
            });

            create.start(event, [ subProcess, startEvent ], {
                hints: {
                    autoSelect: [ subProcess ]
                }
            });
        }

        function createParticipant(event) {
            create.start(event, elementFactory.createParticipantShape());
        }

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
            'lasso-tool': {
                group: 'tools',
                className: 'bpmn-icon-lasso-tool',
                title: translate('Activate the lasso tool'),
                action: {
                    click: function(event) {
                        lassoTool.activateSelection(event);
                    }
                }
            },
            'space-tool': {
                group: 'tools',
                className: 'bpmn-icon-space-tool',
                title: translate('Activate the create/remove space tool'),
                action: {
                    click: function(event) {
                        spaceTool.activateSelection(event);
                    }
                }
            },
            'global-connect-tool': {
                group: 'tools',
                className: 'bpmn-icon-connection-multi',
                title: translate('Activate the global connect tool'),
                action: {
                    click: function(event) {
                        globalConnect.start(event);
                    }
                }
            },
            'tool-separator': {
                group: 'tools',
                separator: true
            },
            'create.start-event': createAction(
                'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
                translate('Create StartEvent')
            ),
            'create.intermediate-event': createAction(
                'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
                translate('Create Intermediate Event')
            ),
            'create.end-event': createAction(
                'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
                translate('Create EndEvent')
            ),
            'create.exclusive-gateway': createAction(
                'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
                translate('Create Gateway')
            ),
            'create.task': createAction(
                'bpmn:Task', 'activity', 'bpmn-icon-task',
                translate('Create Task')
            ),
            'create.data-object': createAction(
                'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
                translate('Create Resource')
            ),
            'create.subprocess-expanded': {
                group: 'activity',
                className: 'bpmn-icon-subprocess-expanded',
                title: translate('Create expanded SubProcess'),
                action: {
                    dragstart: createSubprocess,
                    click: createSubprocess
                }
            },
            'create.participant-expanded': {
                group: 'collaboration',
                className: 'bpmn-icon-participant',
                title: translate('Create Pool/Participant'),
                action: {
                    dragstart: createParticipant,
                    click: createParticipant
                }
            },
            'create.group': createAction(
                'bpmn:Group', 'artifact', 'bpmn-icon-group',
                translate('Create Group')
            ),
            //'create-resource': createAction(
            //    'regularBPMN:Resource', 'regularBPMN', 'regularBPMN-resource-icon', translate('Create Resource')
            //),
            //'create-entity': createAction(
            //    'regularBPMN:Entity', 'regularBPMN', 'regularBPMN-entity-icon', translate('Create Entity')
            //),
        }
    }
}

PaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'globalConnect',
    'translate'
];
