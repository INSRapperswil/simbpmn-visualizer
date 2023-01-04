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
//import CustomRules from '../controls/custom-rules/CustomRules';

import { debounce } from "min-dash";

import diagramXML from "../../resources/newDiagram.bpmn";

import bpmnTranslations from "../../translations/bpmn/translations";

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
    SimBPMNRulesModules
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
