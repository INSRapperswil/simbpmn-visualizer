import $ from "jquery";
import BpmnModeler from "bpmn-js/lib/Modeler";
import BpmnColorPickerModule from "bpmn-js-color-picker";
import minimapModule from "diagram-js-minimap";
import ControlsModule from '../controls';
import SimBPMNControlsModule from '../controls/simBPMN';
import SimBPMNRulesModules from '../controls/simBPMN';
import ExtensionPropertiesProvider from '../provider';
import { BpmnPropertiesPanelModule } from 'bpmn-js-properties-panel';
import simBpmnModdleDescriptor from "../descriptors/simBPMN.json";
import SimBPMNLabelEditingProvider from '../controls/simBPMN';
//import CustomRules from '../controls/custom-rules/CustomRules';


import { debounce } from "min-dash";

import diagramXML from "../../resources/newDiagram.bpmn";

import bpmnTranslations from "../../translations/bpmn/translations";
import {
  is,
  getBusinessObject
} from "bpmn-js/lib/util/ModelUtil";
import { isExpanded } from "../utils/DiUtil";

var canvas = $("#js-simbpmncanvas");

var customTranslateModule = {
  translate: ["value", bpmnTranslations],
};

var bpmnModeler = new BpmnModeler({
  container: canvas,
  additionalModules: [
    minimapModule,
    BpmnPropertiesPanelModule,
    ControlsModule,
    SimBPMNControlsModule,
    BpmnColorPickerModule,
    ExtensionPropertiesProvider,
    customTranslateModule,
    SimBPMNRulesModules,
    SimBPMNLabelEditingProvider
  ],
  colorPicker: {
    colors: [ {
      label: 'Default',
      fill: undefined,
      stroke: undefined
    }, {
      label: 'Blue',
      fill: '#BBDEFB',
      stroke: '#1E88E5'
    }, {
      label: 'Orange',
      fill: '#FFE0B2',
      stroke: '#FB8C00'
    }, {
      label: 'Green',
      fill: '#C8E6C9',
      stroke: '#43A047'
    }, {
      label: 'Red',
      fill: '#FFCDD2',
      stroke: '#FB8C00'
    }, {
      label: 'Purple',
      fill: '#E1BEE7',
      stroke: '#8E24AA'
    }, {
      label: 'Brown',
      fill: '#D2691E',
      stroke: '#654321'
    }, {
      label: 'Violet',
      fill: '#6A5ACD',
      stroke: '#4B0082'
    }, {
      label: 'Olivegreen',
      fill: '#BDB76B',
      stroke: '#808000'
    } ]
  },
  moddleExtensions: {
    simbpmn: simBpmnModdleDescriptor,
  },
});

createNewDiagram();

function createNewDiagram() {
  opensimBPMNDiagram(diagramXML);
}

async function opensimBPMNDiagram(xml) {
  try {
    await bpmnModeler.importXML(xml);
  } catch (err) {
    console.error(err);
  }
}

//------------------------------------------------------------
// save simbpmn into bpmn property
//------------------------------------------------------------

var eventBus = bpmnModeler.get("eventBus");
var exportArtifacts = debounce(async function () {
  const xml = await bpmnModeler.saveXML({ format: true });

  // window.electronAPI.saveLogicRelay(JSON.stringify(xml));
  window.electronAPI.saveLogicRelay(xml.xml);
}, /*timeout*/ 500);

bpmnModeler.on("commandStack.changed", exportArtifacts);


window.electronAPI.openLogic((event, xml) => {
  console.log("opening logic");
  opensimBPMNDiagram(xml);
});

eventBus.on("commandStack.connection.create.postExecuted", function (event) {
  console.log("connection created");

  const context = event.context;
  const source = context.source;
  const target = context.target;

  //console.log("Source:", source);
  //console.log("Target:", target);

  if (is(source, "simBPMN:Resource")) {
    //console.log("Association to resource");
    adjustResources(target);
  }
});

eventBus.on("commandStack.connection.delete.preExecute", function (event) {
  const { context } = event;

  const { connection } = context;

  //console.log("Context:", context);
  //console.log("Connection:", connection)
  //console.log("Parent:", connection.parent);
  //console.log("Source:", connection.source);
  //console.log("Target:", connection.target);

  if (is(connection.source, "simBPMN:Resource")) {
    adjustResources(connection.target, connection.source);
  }
});

eventBus.on('selection.changed', function (context) {
  var oldSelection = context.oldSelection,
    newSelection = context.newSelection;

  if (newSelection.length > 0) {
    selectShape(newSelection[0]);
  }
});

function selectShape(shape) {
  console.log(shape.id + " was clicked");

  if (is(shape, "bpmn:SubProcess")) {
    adjustResources(shape);
  }
}

// eventBus.on('elements.changed', function (context) {

//   context.elements.forEach(element => {
//     if (is(element, "regularBPMN:Resource")) {
//       element.outgoing.forEach(connection => {
//         if (is(connection.target, 'bpmn:SubProcess')) {
//           adjustResourcesInSubprocess(connection.target);
//         }
//       });
//     }
//   });
// });

function adjustResources(shape, disconnectingResource) {
  if (is(shape, 'bpmn:SubProcess')) {
    adjustResourcesInSubprocess(shape, disconnectingResource);
  }
}

function adjustResourcesInSubprocess(shape, disconnectingResource) {
  console.log("logic: adjust resources in subprocess for", shape);

  const incoming = shape.incoming || [];
  const resources = incoming.reduce((resources, connection) => {
    if (is(connection.source, "simBPMN:Resource") && (!disconnectingResource || disconnectingResource != connection.source)) {
      var bo = getBusinessObject(connection.source);
      resources.push([connection.source, bo.name]);
    }
    return resources;
  }, []);


  let elementFactory = bpmnModeler.get('elementFactory');
  let elementRegistry = bpmnModeler.get('elementRegistry');
  let moddle = bpmnModeler.get('moddle');
  let modeling = bpmnModeler.get('modeling');
  //let root = bpmnModeler.get('canvas').getRootElement();

  let root = shape;
  if (!isExpanded(shape)) {
    // https://forum.bpmn.io/t/programmatically-populate-collapsed-subprocess/7504/3?u=symas
    root = elementRegistry.get(`${shape.id}_plane`);
  }

  const ids = [];
  let cnt = 0;
  resources.forEach(element => {
    var existingResource;
    var id;
    var name;
    if (typeof element[0] === 'string') {
      id = "Resource_" + element[0];
    } else {
      id = element[0].id;
    }
    id = `${shape.id}_${id}`;
    name = element[1];
    ids.push(id);
    existingResource = elementRegistry.get(id);

    if (!existingResource) {
      let resource = elementFactory.createShape({
        type: 'simBPMN:Resource'
      });

      resource.businessObject["id"] = id;
      resource.businessObject["name"] = name;
      resource.businessObject["isFromParent"] = true;
      resource.id = id;
      var x = 300 + (cnt * 50);
      var y = 100;
      if (isExpanded(shape)) {
        x += shape.x;
        y += shape.y;
      }
      console.log("create new resource")
      modeling.createShape(resource, { x: x, y: y }, root);
    } else {
      if (existingResource.businessObject["name"] != name) {
        console.log("update name for resource ", shape, "(" + name + ")")
        modeling.updateProperties(existingResource, {
          name: name
        });
      }
    }
    cnt++;
  });



  elementRegistry.getAll().forEach(shape => {
    if (is(shape, "simBPMN:Resource")) {
      let id = shape.businessObject["id"];
      if (shape.businessObject.isFromParent && shape.parent == root && !ids.some(x => x === id)) {
        console.log("remove resource ", shape)
        modeling.removeShape(shape);
      }
    }

  });


  // resources.forEach(element => {
  //   let resource = elementFactory.createShape({
  //     type: 'regularBPMN:Resource'
  //   });

  //   //resource.businessObject["id"] = id;
  //   resource.businessObject["name"] = "abc";
  //   modeling.createShape(resource, { x: 300 + (cnt * 50), y: 100 }, root);
  // });
}

window.electronAPI.adjustResourcesInLogic((event, resources) => {
  console.log("adjust resources in logic: ", resources);


  let elementFactory = bpmnModeler.get('elementFactory');
  let elementRegistry = bpmnModeler.get('elementRegistry');
  let moddle = bpmnModeler.get('moddle');
  let modeling = bpmnModeler.get('modeling');
  let root = bpmnModeler.get('canvas').getRootElement();

  const ids = [];
  let cnt = 0;
  resources.forEach(element => {
    var id;
    if (typeof element[0] === 'string') {
      id = "Resource_" + element[0];
    } else {
      id = element[0].id;
    }
    var name = element[1];
    var colorFill = element[2];
    var colorStroke = element[3];

    ids.push(id);
    var existingResource = elementRegistry.get(id);

    if (!existingResource) {
      let resource = elementFactory.createShape({
        type: 'simBPMN:Resource'
      });

      resource.businessObject["id"] = id;
      resource.businessObject["name"] = name;
      modeling.createShape(resource, { x: 300 + (cnt * 50), y: 100 }, root);
    } else {
      if (existingResource.businessObject["name"] != name) {
        modeling.updateProperties(existingResource, {
          name: name
        });
      }

      if (colorFill && colorStroke && (colorFill != existingResource.di.get('color:background-color') || colorStroke != existingResource.di.get('color:border-color'))) {
        modeling.setColor(existingResource, { fill: colorFill, stroke: colorStroke });
      }

    }
    cnt++;
  });

  elementRegistry.getAll().forEach(shape => {
    if (is(shape, "simBPMN:Resource") && !is(shape.parent, 'bpmn:SubProcess')) {
      let id = shape.businessObject["id"];
      if (!ids.some(x => x === id)) {
        modeling.removeShape(shape);
      }
    } else if (is(shape, "bpmn:SubProcess")) {
      adjustResourcesInSubprocess(shape)
    }

  })
});