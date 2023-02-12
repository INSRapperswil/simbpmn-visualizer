
import SimBPMNRenderer from './SimBPMNRenderer'
import SimBPMNPaletteProvider from './SimBPMNPaletteProvider'
import SimBPMNContextPadProvider from "./SimBPMNContextPadProvider";
import SimBPMNRules from './SimBPMNRules';
import SimBPMNElementFactory from "./SimBPMNElementFactory";
import SimBPMNLabelEditingProvider from "./SimBPMNLabelEditingProvider";
import ReplaceConnectionBehavior from "./behaviour/ReplaceConnectionBehavior";

export default {
    __init__: [ 'simBPMNPaletteProvider','renderer', 'simBPMNRules', 'simBPMNContextPadProvider', 'labelEditingProvider', 'replaceConnectionBehavior' ],
    simBPMNContextPadProvider: [ 'type' , SimBPMNContextPadProvider],
    elementFactory: [ 'type', SimBPMNElementFactory ],
    simBPMNPaletteProvider: [ 'type', SimBPMNPaletteProvider ],
    renderer: [ 'type', SimBPMNRenderer ],
      // Here we overwrite the bpmnjs provider by giving ours the same name
      labelEditingProvider: [ 'type', SimBPMNLabelEditingProvider ], 
      replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior],
      simBPMNRules: [ 'type', SimBPMNRules ],
};