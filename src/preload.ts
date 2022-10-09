import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  addAttachment: () => ipcRenderer.invoke('addAttachment'),
  openFileDialog: () => ipcRenderer.invoke('dialog:openFileDialog'),
  openFile: (filePath: string, isFullPath: boolean) => ipcRenderer.invoke('openFile', filePath, isFullPath),
  scanDirectory: (filePath: string) => ipcRenderer.invoke("scanDirectory", filePath),
  isDirectory: (filePath: string) => ipcRenderer.invoke("isDirectory", filePath),
  getWorkspacePath: () => ipcRenderer.invoke("settings:getWorkspacePath"),
  createNewFile: (filename: string, xml: string) => ipcRenderer.invoke("createNewFile", filename, xml),
  deleteFile: (path: string) => ipcRenderer.invoke("deleteFile", path),
  saveLogicRelay: (xml: string) => ipcRenderer.invoke("saveLogicRelay", xml),
  openLogicRelay: (xml: string) => ipcRenderer.invoke("openLogicRelay", xml),
  exportBPMN: () => ipcRenderer.invoke("exportBPMN"),
  importBPMN: () => ipcRenderer.invoke("importBPMN"),
  changeWorkspaceLocation: () => ipcRenderer.invoke("changeWorkspaceLocation"),
  changeApplicationLanguage: (languageCode: string) => ipcRenderer.invoke("changeApplicationLanguage", languageCode),
  getApplicationLanguage: () => ipcRenderer.invoke("getApplicationLanguage"),
  getTranslation: (key: string) => ipcRenderer.invoke("getTranslation", key),

  loadFolder: (callback: any) => ipcRenderer.on("loadFolder", callback),
  callExportBPMN: (callback: any) => ipcRenderer.on("callExportBPMN", callback),
  callImportBPMN: (callback: any) => ipcRenderer.on("callImportBPMN", callback),
  onCreateXmlFile: (callback: any) => ipcRenderer.on("createXmlFile", callback),
  returnToMainPage: (callback: any) => ipcRenderer.on("returnToMainPage", callback),
  onOpenXmlFile: (callback: any) => ipcRenderer.on("openXmlFile", callback),
  saveLogic: (callback: any) => ipcRenderer.on("saveLogic", callback),
  openLogic: (callback: any) => ipcRenderer.on("openLogic", callback),
});