import ContextPadProvider from './ContextPadProvider';
import PaletteProvider from './PaletteProvider';
import ReplaceMenuProvider from './ReplaceMenuProvider';
import CustomRules from './custom-rules/CustomRules';

export default {
    __init__: [ 'contextPadProvider', 'paletteProvider', 'replaceMenuProvider', 'customRules' ],
    contextPadProvider: [ 'type', ContextPadProvider ],
    paletteProvider: [ 'type', PaletteProvider ],
    replaceMenuProvider: [ 'type', ReplaceMenuProvider ],
    customRules: [ 'type', CustomRules ]
};