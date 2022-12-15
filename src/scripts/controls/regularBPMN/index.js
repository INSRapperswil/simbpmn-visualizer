
import RegularBPMNRenderer from './RegularBPMNRenderer'
import RegularBPMNPaletteProvider from './RegularBPMNPaletteProvider'
import RegularBPMNContextPadProvider from "./RegularBPMNContextPadProvider";
import CustomElementFactory from "./CustomElementFactory";
import CustomRules from './CustomRules';

export default {
    __init__: [ 'regularBPMNContextPadProvider','renderer', 'customRules', 'regularBPMNPaletteProvider'  ],
    regularBPMNContextPadProvider: [ 'type' , RegularBPMNContextPadProvider],
    renderer: [ 'type', RegularBPMNRenderer ],
    //customRules: [ 'type', CustomRules ],
    //elementFactory: [ 'type', CustomElementFactory ],
    regularBPMNPaletteProvider: [ 'type', RegularBPMNPaletteProvider ]
};