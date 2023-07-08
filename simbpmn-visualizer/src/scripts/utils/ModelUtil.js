import {
    some
} from 'min-dash';

export const Priority = {
    Low: 500,
    Default: 1000,
    High: 1500
}

/**
 * Is an element of the given BPMN type?
 *
 * @param  {djs.model.Base|ModdleElement} element
 * @param  {string} type
 *
 * @return {boolean}
 */
export function is(element, type) {
    var bo = getBusinessObject(element);

    return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}


/**
 * Return true if element has any of the given types.
 *
 * @param {djs.model.Base} element
 * @param {Array<string>} types
 *
 * @return {boolean}
 */
export function isAny(element, types) {
    return some(types, function(t) {
        return is(element, t);
    });
}

/**
 * Return the business object for a given element.
 *
 * @param  {djs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}
 */
export function getBusinessObject(element) {
    return (element && element.businessObject) || element;
}

/**
 * Return the di object for a given element.
 *
 * @param  {djs.model.Base} element
 *
 * @return {ModdleElement}
 */
export function getDi(element) {
    return element && element.di;
}

/**
 * Return the parent of the element with any of the given types.
 *
 * @param {djs.model.Base} element
 * @param {string|Array<string>} anyType
 *
 * @return {djs.model.Base}
 */
export function getParent(element, anyType) {

    if (typeof anyType === 'string') {
      anyType = [ anyType ];
    }
  
    while ((element = element.$parent || element.parent)) {
      if (anyType) {
        if (isAny(element, anyType)) {
          return element;
        }
      }
      else {
        return element;
      }
    }
  
    return null;
  }

/**
 * Return the parents of the element with any of the given types.
 *
 * @param {ModdleElement} element
 * @param {String|Array<String>} anyType
 *
 * @return {Array<ModdleElement>}
 */
export function getParents(element, anyType) {

    var parents = [];
  
    if (typeof anyType === 'string') {
      anyType = [ anyType ];
    }
  
    while (element) {
      element = element.$parent || element.parent;
  
      if (element) {
  
        if (anyType) {
          if (isAny(element, anyType)) {
            parents.push(element);
          }
        }
        else {
          parents.push(element);
        }
  
      }
  
    }
  
    return parents;
  }

export function isLabel(element) {
    return element && !!element.labelTarget;
}