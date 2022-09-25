import { TextFieldEntry, TextAreaEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel'

export default function RequirementProperty(props) {

  const {
    idPrefix,
    property
  } = props;

  const entries = [ {
    id: idPrefix + '-name',
    component: NameProperty,
    idPrefix,
    property
  },{
    id: idPrefix + '-value',
    component: DescriptionProperty,
    idPrefix,
    property
  } ];

  return entries;
}

function NameProperty(props) {
  const {
    idPrefix,
    element,
    property
  } = props;

  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const setValue = (value) => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: property,
      properties: {
        name: value
      }
    });
  };

  const getValue = () => {
    return property.name;
  };

  return TextFieldEntry({
    element: property,
    id: idPrefix + '-name',
    label: translate('Name'),
    getValue,
    setValue,
    debounce
  });
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