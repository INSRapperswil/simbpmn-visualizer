import {
  reduce
} from 'min-dash';

import inherits from 'inherits';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  Priority
} from '../../utils/ModelUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import {
  getParents,
} from '../../utils/ModelUtil';

import {
  isCustom
} from '../../utils/ElementUtil';

function isParent(possibleParent, element) {
  var allParents = getParents(element);
  return allParents.indexOf(possibleParent) !== -1;
}

function isConnection(element) {
  return element.waypoints;
}
/**
 * Specific rules for custom elements
 */
export default function RegularBPMNRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(RegularBPMNRules, RuleProvider);

RegularBPMNRules.$inject = ['eventBus'];


RegularBPMNRules.prototype.init = function () {

  /**
   * Can shape be created on target container?
   */
  function canCreate(shape, target) {

    // only judge about custom elements
    if (!isCustom(shape)) {
      return;
    }


    // allow creation on processes
    return is(target, 'bpmn:Process') || is(target, 'bpmn:Participant') || is(target, 'bpmn:Collaboration') || is(target, 'bpmn:SubProcess');
  }

  /**
   * Can source and target be connected?
   */
  function canConnect(source, target) {

    // only judge about custom elements
    if (!isCustom(source) && !isCustom(target)) {
      return;
    }

    // allow connection between custom shape and task
    if (isCustom(source)) {
      if (is(target, "bpmn:Process")) {
        return false;
      }
      if (is(source, 'regularBPMN:Entity') && !isCustom(target)) {
        return { type: 'bpmn:Association' };
      } else if (is(source, 'regularBPMN:Resource') && !isCustom(target)) {
        return { type: 'bpmn:Association' };
      } else {
        return false;
      }
    } else if (isCustom(target)) {
      if (is(source, 'regularBPMN:Entity') && !isCustom(source)) {
        return { type: 'bpmn:Association' };
      } else if (is(source, 'regularBPMN:Resource') && !isCustom(source)) {
        return { type: 'bpmn:Association' };
      } else {
        return false;
      }
    }
    console.log(10);
  }

  this.addRule('elements.move', Priority.High, function (context) {

    var target = context.target,
      shapes = context.shapes;

    var type;

    // do not allow mixed movements of custom / BPMN shapes
    // if any shape cannot be moved, the group cannot be moved, too
    var allowed = reduce(shapes, function (result, s) {
      //if (type === undefined) {
      //  type = isCustom(s);
      //}

      //if (type !== isCustom(s) || result === false) {
      //  return false;
      //}

            if (result === false) {
        return false;
      }
      return canCreate(s, target);
    }, undefined);

    // reject, if we have at least one
    // custom element that cannot be moved
    return allowed;
  });

  this.addRule('shape.create', Priority.High, function (context) {
    var target = context.target,
      shape = context.shape;

    return canCreate(shape, target);
  });

  this.addRule('shape.resize', Priority.High, function (context) {
    var shape = context.shape;

    if (isCustom(shape)) {
      // cannot resize custom elements
      return false;
    }
  });

  this.addRule('connection.create', Priority.High, function (context) {
    var source = context.source,
      target = context.target;

    return canConnect(source, target);
  });

  this.addRule('connection.reconnectStart', Priority.High, function (context) {
    var connection = context.connection,
      source = context.hover || context.source,
      target = connection.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.reconnectEnd', Priority.High, function (context) {
    var connection = context.connection,
      source = connection.source,
      target = context.hover || context.target;

    return canConnect(source, target, connection);
  });



  RegularBPMNRules.prototype.canConnectAssociation = function (source, target) {

    // do not connect connections
    if (isConnection(source) || isConnection(target)) {
      return false;
    }

    // connect if different parent
    return !isParent(target, source) &&
      !isParent(source, target);

  };

  this.addRule('elements.delete', function (context) {
    // allow only some
    return context.elements.filter(function (e) {
      if(e.businessObject.$instanceOf('regularBPMN:Resource')) {
        return !e.businessObject.isFromParent;
      }
      return true;
    });
  });

};