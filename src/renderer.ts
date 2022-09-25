/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './css/index.css';
import "./css/vendor/bpmn-js/assets/diagram-js.css";
import "./css/vendor/bpmn-js/assets/bpmn-js.css";
import "./css/vendor/bpmn-js/assets/bpmn-font/css/bpmn-embedded.css";
import "./css/vendor/bpmn-js-properties-panel/assets/properties-panel.css";
import "./css/vendor/bpmn-js-color-picker/colors/color-picker.css";
import "./css/vendor/diagram-js-minimap/assets/diagram-js-minimap.css";

import "./css/app.css";
import "./css/simBPMN.css"
import "./css/sidebar.css";
import "./css/tabs.css";
import "./css/splitview.css";
import "@fortawesome/fontawesome-free/js/all";

import "./scripts/descriptors/simBPMN.json";
import "./scripts/bpmn/regularBPMN.js";
import "./scripts/bpmn/simBPMN.js";
import "./scripts/sidebar/splitview.js";
import "./scripts/tabs/tabs.js";
import "./scripts/tabs/settings.js";

// ----------------------------------------------------------------------------

import { Sidebar } from "./scripts/sidebar/sidebar";
const sidebar = new Sidebar();

(window as any).electronAPI.getWorkspacePath()
    .then((path: string) => sidebar.loadFilesFromPath(path));


(window as any).electronAPI.loadFolder((event: any, value: string) => {
    sidebar.loadFilesFromPath(value);
});

(window as any).electronAPI.callExportBPMN((event: any) => {
    (window as any).electronAPI.exportBPMN();
});

(window as any).electronAPI.callImportBPMN((event: any) => {
    (window as any).electronAPI.importBPMN();
});
