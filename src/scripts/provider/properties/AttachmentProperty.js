import { TextAreaEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'
import ButtonEntry from "../components/entries/Button";

export default function AttachmentProperty(props) {

    const {
        idPrefix,
        property
    } = props;

    const entries = [{
        id: idPrefix + '-description',
        component: DescriptionProperty,
        idPrefix,
        property
    }, {
        id: idPrefix + '-value',
        component: ButtonProperty,
        idPrefix,
        property
    }];
    return entries;
}

function DescriptionProperty(props) {
    const {
        idPrefix,
        element,
        property
    } = props;

    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const setValue = (description) => {
        commandStack.execute('element.updateModdleProperties', {
            element,
            moddleElement: property,
            properties: {
                description
            }
        });
    };

    const getValue = () => {
        return property.description;
    };

    return TextAreaEntry({
        element: property,
        id: idPrefix + '-description',
        label: translate('Description'),
        getValue,
        setValue,
        debounce
    });
}

function ButtonProperty(props) {
    const {
        idPrefix,
        property
    } = props;

    const translate = useService('translate');

    return ButtonEntry({
        id: idPrefix + '-filePath',
        label: translate('Open'),
        onClick: () => {
            window.electronAPI.openFile(property.attachmentPath);
        }
    });
}
