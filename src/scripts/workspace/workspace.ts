import { dialog, shell } from "electron";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";

export class Workspace {
    activeBpmnFile: string;
    workspacePath: string
    mainWindow: any;

    constructor(mainWindow: any, workspacePath: string) {
        this.mainWindow = mainWindow;
        this.workspacePath = workspacePath;
    }


    getWorkspacePath(): string {
        return this.workspacePath;
    }

    async addNewAttachments(): Promise<string[]> {
        let attachments = await this.getAttachmentPaths();
        return this.copyAttachmentsToWorkspace(attachments);
    }

    async getAttachmentPaths(): Promise<string[]> {
        const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
        if (canceled) {
            return;
        } else {
            return filePaths;
        }
    }

    async copyAttachmentsToWorkspace(attachments: string[]) {
        const subFolderName = path.basename(this.activeBpmnFile, path.extname(this.activeBpmnFile));
        attachments = attachments.map(attachment => {
            const fileName = path.basename(attachment)
            const directoryPath = path.join(this.workspacePath, subFolderName);
            const absoluteFilePath = path.join(directoryPath, fileName);
            const relativeFilePath = path.join(subFolderName, fileName);
            fs.mkdirSync(directoryPath, { recursive: true });
            fs.copyFileSync(attachment, absoluteFilePath);
            return relativeFilePath;
        });
        this.mainWindow.webContents.send('loadFolder', this.workspacePath);
        return attachments;

    }

    async handleOpenFile(filePath: string, isFullPath: boolean) {

        if (isFullPath) {
            await this.openFile(filePath);
        }
        else {
            const absoluteFilePath = path.join(this.workspacePath, filePath);
            await this.openFile(absoluteFilePath);
        }
    }
    async openFile(filePath: string) {
        const extension = path.extname(filePath);

        if (extension == ".bpmn") {
            this.activeBpmnFile = path.basename(filePath);
            const data = fs.readFileSync(filePath, 'utf-8');
            this.mainWindow.webContents.send('openXmlFile', data);
        } else {
            await shell.openPath(filePath);
        }
    }

    createBpmnFile(xml: string, loadFolder: boolean) {
        const filePath = path.join(this.workspacePath, this.activeBpmnFile);
        fs.writeFileSync(filePath, xml, { encoding: "utf-8" });
        if(loadFolder) {
            this.mainWindow.webContents.send('loadFolder', this.workspacePath);
        }
    }

    createNewFile(filename: string, xml: string) {
        this.activeBpmnFile = filename;
        this.createBpmnFile(xml, true);
    }

    async importBPMN() {
        const openDialogResult = await dialog.showOpenDialog({ properties: ['openFile'] });
        if (openDialogResult.canceled) {
            return;
        }
        const filePath = openDialogResult.filePaths[0];
        console.log(filePath)
        if (path.extname(filePath) != '.zip') {
            return;
        }
        console.log(this.workspacePath)

        const zip = new AdmZip(filePath);
        zip.extractAllTo(this.workspacePath);
        this.mainWindow.webContents.send('loadFolder', this.workspacePath);
    }

    async exportBPMN() {
        const subFolderName = path.basename(this.activeBpmnFile, path.extname(this.activeBpmnFile));
        const attachmentsPath = path.join(this.workspacePath, subFolderName);
        const mainFilePath = path.join(this.workspacePath, this.activeBpmnFile);

        const saveDialogResult = await dialog.showSaveDialog({
            filters: [{
                name: 'Zip',
                extensions: ['zip']
            }]
        });
        if (saveDialogResult.canceled) {
            return;
        }
        const outputPath = saveDialogResult.filePath;

        const zip = new AdmZip();
        zip.addLocalFile(mainFilePath);
        if (fs.existsSync(attachmentsPath)) {
            zip.addLocalFolder(attachmentsPath, subFolderName);
        }
        zip.writeZip(outputPath);

    }

    async changeWorkspaceLocation() {
        const openDialogResult = await dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (openDialogResult.canceled) {
            return;
        }
        const filePath = openDialogResult.filePaths[0];
        this.workspacePath = filePath;
        return this.workspacePath
    }

    async deleteFile(filePath: string) {
        fs.rmSync(filePath);
        const attachmentsFolderPath = path.join(path.dirname(filePath), path.basename(filePath, ".bpmn"));
        console.log(attachmentsFolderPath);
        if (fs.existsSync(attachmentsFolderPath)) {
            fs.rmSync(attachmentsFolderPath, { recursive: true, force: true });
        }

        this.mainWindow.webContents.send('loadFolder', this.workspacePath);
    }
}