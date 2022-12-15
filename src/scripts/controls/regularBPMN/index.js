
import RegularBPMNRenderer from './RegularBPMNRenderer'
import RegularBPMNPaletteProvider from './RegularBPMNPaletteProvider'
import RegularBPMNContextPadProvider from "./RegularBPMNContextPadProvider";

export default {
    __init__: [ 'regularBPMNPaletteProvider','renderer', 'regularBPMNContextPadProvider' ],
    regularBPMNPaletteProvider: [ 'type', RegularBPMNPaletteProvider ],
    renderer: [ 'type', RegularBPMNRenderer ],
    regularBPMNContextPadProvider: [ 'type' , RegularBPMNContextPadProvider]
};