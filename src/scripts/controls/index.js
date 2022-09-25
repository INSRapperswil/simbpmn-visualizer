import ContextPadProvider from './ContextPadProvider';
import PaletteProvider from './PaletteProvider';
import ReplaceMenuProvider from './ReplaceMenuProvider';

export default {
    __init__: [ 'contextPadProvider', 'paletteProvider', 'replaceMenuProvider' ],
    contextPadProvider: [ 'type', ContextPadProvider ],
    paletteProvider: [ 'type', PaletteProvider ],
    replaceMenuProvider: [ 'type', ReplaceMenuProvider ]
};