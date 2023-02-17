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
import SimBPMNLabelEditingProvider  from '../controls/simBPMN';
//import CustomRules from '../controls/custom-rules/CustomRules';

import { debounce } from "min-dash";

import diagramXML from "../../resources/newDiagram.bpmn";

import bpmnTranslations from "../../translations/bpmn/translations";
import { is,
  getBusinessObject
 } from "bpmn-js/lib/util/ModelUtil";

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
    var shape;
    var id;
    var name;
    if (typeof element[0] === 'string') {
      id = "Resource_" + element[0];
    } else {
      id = element[0].id;
    }
    name = element[1];
    ids.push(id);
    shape = elementRegistry.get(id);

    if (!shape) {
      let resource = elementFactory.createShape({
        type: 'simBPMN:Resource'
      });

      resource.businessObject["id"] = id;
      resource.businessObject["name"] = name;
      modeling.createShape(resource, { x: 300 + (cnt*50), y: 100 }, root);    
    }
    cnt++;
  });

  elementRegistry.getAll().forEach(shape => {
    if(is(shape, "simBPMN:Resource")) {
      let id = shape.businessObject["id"];
      if(!ids.some(x => x === id)) {
        modeling.removeShape(shape);
      }
    }

  })
});