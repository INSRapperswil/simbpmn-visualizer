
import RegularBPMNRenderer from './RegularBPMNRenderer'
import RegularBPMNElementFactory from './RegularBPMNElementFactory';
import RegularBPMNPaletteProvider from './RegularBPMNPaletteProvider'
import RegularBPMNContextPadProvider from "./RegularBPMNContextPadProvider";

export default {
    __init__: [ 'regularBPMNPaletteProvider','renderer', 'regularBPMNContextPadProvider' ],
    elementFactory: [ 'type', RegularBPMNElementFactory ],
    regularBPMNPaletteProvider: [ 'type', RegularBPMNPaletteProvider ],
    renderer: [ 'type', RegularBPMNRenderer ],
    regularBPMNContextPadProvider: [ 'type' , RegularBPMNContextPadProvider]
};