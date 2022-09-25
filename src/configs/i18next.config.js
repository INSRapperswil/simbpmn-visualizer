const i18n = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const config = require('../configs/app.config');

const i18nextOptions = {
    backend: {
        // path where resources get loaded from
        //loadPath: './locales/{{lng}}/{{ns}}.json',
        //production:
        loadPath: './resources/electron/{{lng}}.json',

        // path to post missing resources
        //addPath: './locales/{{lng}}/{{ns}}.missing.json',
        //production:
        addPath: './resources/electron/{{lng}}/{{ns}}.missing.json',

        // jsonIndent to use when storing json files
        jsonIndent: 2,
    },
    interpolation: {
        escapeValue: false
    },
    saveMissing: true,
    fallbackLng: config.fallbackLng,
    whitelist: config.languages,
    react: {
        wait: false
    }
};

i18n
    .use(i18nextBackend);

// initialize if not already initialized
if (!i18n.isInitialized) {
    i18n
        .init(i18nextOptions);
}

module.exports = i18n;


//https://phrase.com/blog/posts/building-an-electron-app-with-internationalization-i18n/
//https://github.com/PhraseApp-Blog/electron-i18n/tree/master/src