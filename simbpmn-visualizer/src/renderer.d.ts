export interface IElectronAPI {
    addAttachment: () => Promise<string[]>
    openFile: (filePath: string, isFullPath: boolean) => Promise<void>
    scanDirectory: (filePath: string) => Promise<string[]>
    isDirectory: (filePath: string) => Promise<boolean>
    getWorkspacePath: () => Promise<string>
    registerNewFile: (filename: string) => Promise<void>
	saveLogic: (xml:string) => Promise<void>
    openLogic: (xml:string) => Promise<void>
    adjustResourcesInLogic: (resources: []) => Promise<void>
    getTranslation: (translation: string) => Promise<string>
    saveForQuit: (xml:string) => Promise<void>
    closeApp: () => Promise<void>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}