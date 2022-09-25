import i18n from "../configs/i18next.config";
import { Menu } from "electron";

const isMac = process.platform === 'darwin'

export function buildMenu(app, mainWindow) {
    const template = [
        ...(isMac ? [{
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        }] : []),
        {
            label: i18n.t('File'),
            submenu: [
                {
                    label: i18n.t('CreateNewFile'),
                    accelerator: 'CommandOrControl+N',
                    click: function () {
                        mainWindow.webContents.send("returnToMainPage");
                    }
                },
                {
                    label: i18n.t('SaveFile'),
                    accelerator: 'CommandOrControl+S',
                    click: async function () {
                        mainWindow.webContents.send("createXmlFile");
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: i18n.t('ImportFile'),
                    click: async function () {
                        mainWindow.webContents.send("callImportBPMN");
                    }
                },
                {
                    label: i18n.t('ExportFile'),
                    click: async function () {
                        mainWindow.webContents.send("callExportBPMN");
                    }
                },
                {
                    type: 'separator'
                },
                isMac ? { role: 'close' } : { role: 'quit' }
            ]
        },
        {
            label: i18n.t('View'),
            submenu: [
                {
                    label: i18n.t('Reload'),
                    role: 'reload'
                },
                {
                    label: i18n.t('Full Screen'),
                    role: 'togglefullscreen'
                },
                {
                    label: i18n.t('Minimize'),
                    role: 'minimize'
                },
                {
                    type: 'separator'
                },
                {
                    label: i18n.t('Toggle Developer Tools'),
                    role: 'toggleDevTools'
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

