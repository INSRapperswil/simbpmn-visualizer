
import RegularBPMNRenderer from './RegularBPMNRenderer'
import RegularBPMNPaletteProvider from './RegularBPMNPaletteProvider'
import RegularBPMNContextPadProvider from "./RegularBPMNContextPadProvider";
import RegularBPMNElementFactory from "./RegularBPMNElementFactory";
import RegularBPMNRules from './RegularBPMNRules';

export default {
    __init__: [ 'regularBPMNContextPadProvider','renderer', 'regularBPMNRules', 'regularBPMNPaletteProvider'  ],
    regularBPMNContextPadProvider: [ 'type' , RegularBPMNContextPadProvider],
    renderer: [ 'type', RegularBPMNRenderer ],
    regularBPMNRules: [ 'type', RegularBPMNRules ],
    elementFactory: [ 'type', RegularBPMNElementFactory ],
    regularBPMNPaletteProvider: [ 'type', RegularBPMNPaletteProvider ]
};