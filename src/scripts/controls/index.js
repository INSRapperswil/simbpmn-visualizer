import ElementFactory from './ElementFactory';
import Renderer from './Renderer'
import ContextPadProvider from './ContextPadProvider';
import PaletteProvider from './PaletteProvider';
import ReplaceMenuProvider from './ReplaceMenuProvider';
import CustomRules from './custom-rules/CustomRules';

export default {
    __init__: [ 'contextPadProvider', 'renderer', 'paletteProvider', 'replaceMenuProvider' ],
    //elementFactory: [ 'type', ElementFactory ],
    renderer: [ 'type', Renderer ],
    contextPadProvider: [ 'type', ContextPadProvider ],
    paletteProvider: [ 'type', PaletteProvider ],
    replaceMenuProvider: [ 'type', ReplaceMenuProvider ],
    //customRules: [ 'type', CustomRules ]
};