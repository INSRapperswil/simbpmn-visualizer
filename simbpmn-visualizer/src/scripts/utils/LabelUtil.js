import {
  assign
} from 'min-dash';

import { is } from './ModelUtil';


export var DEFAULT_LABEL_SIZE = {
  width: 90,
  height: 20
};

export var FLOW_LABEL_INDENT = 15;


/**
 * Returns true if the given semantic has an external label
 *
 * @param {BpmnElement} semantic
 * @return {boolean} true if has label
 */
export function isLabelExternal(semantic) {
  return is(semantic, 'bpmn:Event') ||
         is(semantic, 'bpmn:Gateway') ||
         is(semantic, 'bpmn:DataStoreReference') ||
         is(semantic, 'bpmn:DataObjectReference') ||
         is(semantic, 'bpmn:DataInput') ||
         is(semantic, 'bpmn:DataOutput') ||
         is(semantic, 'bpmn:SequenceFlow') ||
         is(semantic, 'bpmn:MessageFlow') ||
         is(semantic, 'bpmn:Group') ||
         is(semantic, 'regularBPMN:Resource') ||
         is(semantic, 'regularBPMN:ResourceBoM') ||
         is(semantic, 'regularBPMN:ResourceWaste') ||
         is(semantic, 'regularBPMN:Entity') ||
         is(semantic, 'simBPMN:Resource') ||
         is(semantic, 'simBPMN:ResourceBoM') ||
         is(semantic, 'simBPMN:ResourceWaste') ||
         is(semantic, 'simBPMN:Queue') ||
         is(semantic, 'simBPMN:Server') ||
         is(semantic, 'simBPMN:ServerSeize') ||
         is(semantic, 'simBPMN:ServerDelay') ||
         is(semantic, 'simBPMN:ServerRelease') ||
         is(semantic, 'simBPMN:Output');
}

/**
 * Returns true if the given element has an external label
 *
 * @param {djs.model.shape} element
 * @return {boolean} true if has label
 */
export function hasExternalLabel(element) {
  return isLabel(element.label);
}

/**
 * Get the position for sequence flow labels
 *
 * @param  {Array<Point>} waypoints
 * @return {Point} the label position
 */
export function getFlowLabelPosition(waypoints) {

  // get the waypoints mid
  var mid = waypoints.length / 2 - 1;

  var first = waypoints[Math.floor(mid)];
  var second = waypoints[Math.ceil(mid + 0.01)];

  // get position
  var position = getWaypointsMid(waypoints);

  // calculate angle
  var angle = Math.atan((second.y - first.y) / (second.x - first.x));

  var x = position.x,
      y = position.y;

  if (Math.abs(angle) < Math.PI / 2) {
    y -= FLOW_LABEL_INDENT;
  } else {
    x += FLOW_LABEL_INDENT;
  }

  return { x: x, y: y };
}


/**
 * Get the middle of a number of waypoints
 *
 * @param  {Array<Point>} waypoints
 * @return {Point} the mid point
 */
export function getWaypointsMid(waypoints) {

  var mid = waypoints.length / 2 - 1;

  var first = waypoints[Math.floor(mid)];
  var second = waypoints[Math.ceil(mid + 0.01)];

  return {
    x: first.x + (second.x - first.x) / 2,
    y: first.y + (second.y - first.y) / 2
  };
}


export function getExternalLabelMid(element) {

  if (element.waypoints) {
    return getFlowLabelPosition(element.waypoints);
  } else if (is(element, 'bpmn:Group')) {
    return {
      x: element.x + element.width / 2,
      y: element.y + DEFAULT_LABEL_SIZE.height / 2
    };
  } else {
    return {
      x: element.x + element.width / 2,
      y: element.y + element.height + DEFAULT_LABEL_SIZE.height / 2
    };
  }
}


/**
 * Returns the bounds of an elements label, parsed from the elements DI or
 * generated from its bounds.
 *
 * @param {BpmndDi} di
 * @param {djs.model.Base} element
 */
export function getExternalLabelBounds(di, element) {

  var mid,
      size,
      bounds,
      label = di.label;

  if (label && label.bounds) {
    bounds = label.bounds;

    size = {
      width: Math.max(DEFAULT_LABEL_SIZE.width, bounds.width),
      height: bounds.height
    };

    mid = {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2
    };
  } else {

    mid = getExternalLabelMid(element);

    size = DEFAULT_LABEL_SIZE;
  }

  return assign({
    x: mid.x - size.width / 2,
    y: mid.y - size.height / 2
  }, size);
}

export function isLabel(element) {
  return element && !!element.labelTarget;
}
