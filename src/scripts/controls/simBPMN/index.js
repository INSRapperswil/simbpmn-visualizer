
import SimBPMNRenderer from './SimBPMNRenderer'
import SimBPMNPaletteProvider from './SimBPMNPaletteProvider'
import SimBPMNContextPadProvider from "./SimBPMNContextPadProvider";
import SimBPMNRules from './SimBPMNRules';
import SimBPMNElementFactory from "./SimBPMNElementFactory";

export default {
    __init__: [ 'simBPMNPaletteProvider','renderer', 'simBPMNRules', 'simBPMNContextPadProvider' ],
    simBPMNContextPadProvider: [ 'type' , SimBPMNContextPadProvider],
    elementFactory: [ 'type', SimBPMNElementFactory ],
    simBPMNPaletteProvider: [ 'type', SimBPMNPaletteProvider ],
    renderer: [ 'type', SimBPMNRenderer ],
    simBPMNRules: [ 'type', SimBPMNRules ],
};