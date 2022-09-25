
import SimBPMNRenderer from './SimBPMNRenderer'
import SimBPMNPaletteProvider from './SimBPMNPaletteProvider'
import SimBPMNContextPadProvider from "./SimBPMNContextPadProvider";

export default {
    __init__: [ 'simBPMNPaletteProvider','renderer', 'simBPMNContextPadProvider' ],

    simBPMNPaletteProvider: [ 'type', SimBPMNPaletteProvider ],
    renderer: [ 'type', SimBPMNRenderer ],
    simBPMNContextPadProvider: [ 'type' , SimBPMNContextPadProvider]
};