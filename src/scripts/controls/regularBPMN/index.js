
import RegularBPMNRenderer from './RegularBPMNRenderer'
import RegularBPMNPaletteProvider from './RegularBPMNPaletteProvider'
import RegularBPMNContextPadProvider from "./RegularBPMNContextPadProvider";
import RegularBPMNElementFactory from "./RegularBPMNElementFactory";
import RegularBPMNRules from './RegularBPMNRules';
import RegularBPMNLabelEditingProvider from "./RegularBPMNLabelEditingProvider";
import ReplaceConnectionBehavior from "./behaviour/ReplaceConnectionBehavior";

export default {
    __init__: [ 'regularBPMNContextPadProvider','renderer', 'regularBPMNRules', 'regularBPMNPaletteProvider', 'labelEditingProvider', 'replaceConnectionBehavior'  ],
    regularBPMNContextPadProvider: [ 'type' , RegularBPMNContextPadProvider],
    renderer: [ 'type', RegularBPMNRenderer ],
    regularBPMNRules: [ 'type', RegularBPMNRules ],
    elementFactory: [ 'type', RegularBPMNElementFactory ],
    regularBPMNPaletteProvider: [ 'type', RegularBPMNPaletteProvider ],
    // Here we overwrite the bpmnjs provider by giving ours the same name
    labelEditingProvider: [ 'type', RegularBPMNLabelEditingProvider ], 
    replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior],
};