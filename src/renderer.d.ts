export interface IElectronAPI {
    addAttachment: () => Promise<string[]>
    openFile: (filePath: string, isFullPath: boolean) => Promise<void>
    scanDirectory: (filePath: string) => Promise<string[]>
    isDirectory: (filePath: string) => Promise<boolean>
    getWorkspacePath: () => Promise<string>
    registerNewFile: (filename: string) => Promise<void>
	saveLogic: (xml:string) => Promise<void>
    openLogic: (xml:string) => Promise<void>
    getTranslation: (translation: string) => Promise<string>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}