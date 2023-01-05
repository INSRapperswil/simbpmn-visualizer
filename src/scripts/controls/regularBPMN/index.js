
import RegularBPMNRenderer from './RegularBPMNRenderer'
import RegularBPMNPaletteProvider from './RegularBPMNPaletteProvider'
import RegularBPMNContextPadProvider from "./RegularBPMNContextPadProvider";
import RegularBPMNElementFactory from "./RegularBPMNElementFactory";
import RegularBPMNRules from './RegularBPMNRules';
import ReplaceConnectionBehavior from "./behaviour/ReplaceConnectionBehavior";

export default {
    __init__: [ 'regularBPMNContextPadProvider','renderer', 'regularBPMNRules', 'regularBPMNPaletteProvider', 'replaceConnectionBehavior'  ],
    regularBPMNContextPadProvider: [ 'type' , RegularBPMNContextPadProvider],
    renderer: [ 'type', RegularBPMNRenderer ],
    regularBPMNRules: [ 'type', RegularBPMNRules ],
    elementFactory: [ 'type', RegularBPMNElementFactory ],
    regularBPMNPaletteProvider: [ 'type', RegularBPMNPaletteProvider ],
    replaceConnectionBehavior: [ 'type', ReplaceConnectionBehavior],
};