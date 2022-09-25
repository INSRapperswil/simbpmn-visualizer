import { Group, ListGroup } from '@bpmn-io/properties-panel';

import { ExtensionPropertiesProps } from './properties/ExtensionPropertiesProps'
import { AttachmentPropertiesProps } from './properties/AttachmentPropertiesProps'
import { RequirementPropertiesProps } from './properties/RequirementPropertiesProbs'
import { ValidationPropertiesProps } from './properties/ValidationPropertiesProps';
import { NameProps } from './properties/NameProps'
import { DocumentationProps } from './properties/DocumentationProps'

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
 export default function SimBpmnPropertiesProvider(propertiesPanel, injector) {

  this._injector = injector;

    // API ////////

    /**
     * Return the groups provided for the given element.
     *
     * @param {DiagramElement} element
     *
     * @return {(Object[]) => (Object[])} groups middleware
     */
    this.getGroups = function(element) {

      /**
       * We return a middleware that modifies
       * the existing groups.
       *
       * @param {Object[]} groups
       *
       * @return {Object[]} modified groups
       */
      return function(groups) {
        groups.push(GeneralGroup(element, injector));
        groups.push(ExtensionPropertiesGroup(element, injector));
        groups.push(FilePropertiesGroup(element, injector));
        groups.push(RequirementPropertiesGroup(element, injector));
        groups.push(ValidationPropertiesGroup(element, injector));
        return groups;
      }
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

SimBpmnPropertiesProvider.$inject = [ 'propertiesPanel', 'injector' ];

function GeneralGroup(element, injector) {
  const entries = [
    ...NameProps({ element }),
    ...DocumentationProps( { element })
  ];
  const translate =  injector.get('translate');


  return {
    id: 'general',
    label: translate('General'),
    entries,
    component: Group
  };
}

function ExtensionPropertiesGroup(element, injector) {
  const translate =  injector.get('translate');
    const group = {
      label: translate('Properties'),
      id: 'ExtensionProperties',
      component: ListGroup,
      ...ExtensionPropertiesProps({ element, injector })
    };

    if (group.items) {
      return group;
    }

    return null;
}

function FilePropertiesGroup(element, injector) {
  const translate = injector.get('translate');
  const group = {
    label: translate('Attached Files'),
    id: 'FileProperties',
    component: ListGroup,
    ...AttachmentPropertiesProps({element, injector})
  };
  if(group.items){
    return group;
  }
  return null;
}

function RequirementPropertiesGroup(element, injector) {
  const translate =  injector.get('translate');
    const group = {
      label: translate('Requirements'),
      id: 'RequirementProperties',
      component: ListGroup,
      ...RequirementPropertiesProps({ element, injector })
    };

    if (group.items) {
      return group;
    }

    return null;
}

function ValidationPropertiesGroup(element, injector) {
  const translate =  injector.get('translate');
    const group = {
      label: translate('Validations'),
      id: 'ValidationProperties',
      component: ListGroup,
      ...ValidationPropertiesProps({ element, injector })
    };

    if (group.items) {
      return group;
    }

    return null;
}
