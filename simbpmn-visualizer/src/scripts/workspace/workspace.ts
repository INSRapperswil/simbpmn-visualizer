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

    createBpmnFile(xml: string) {
        const filePath = path.join(this.workspacePath, this.activeBpmnFile);
        fs.writeFileSync(filePath, xml, { encoding: "utf-8" });
        this.mainWindow.webContents.send('loadFolder', this.workspacePath);
    }

    createNewFile(filename: string, xml: string) {
        this.activeBpmnFile = filename;
        this.createBpmnFile(xml);
    }

    async importBPMN() {
        const openDialogResult = await dialog.showOpenDialog({ properties: ['openFile'] });
        if (openDialogResult.canceled) {
            return;
        }
        const filePath = openDialogResult.filePaths[0];

        if (path.extname(filePath) != '.zip') {
            return;
        }

        const fileNameWithExtension = filePath.split('\\').pop();
        var projectName = fileNameWithExtension.split('.').slice(0, -1).join('.');

        if (this.projectExists(projectName)) {
            const res = dialog.showMessageBoxSync(this.mainWindow,
                {
                    type: 'question',
                    buttons: ['Yes', 'No', 'Cancel'],
                    title: 'Project exists',
                    message: `The project '${projectName}' already exists. Should this be overwritten?`
                });
            if (res == 2) {
                return;
            }
            if (res == 1) {
                var number = 1;
                while (true) {
                    if (!this.projectExists(projectName + ` (${number})`)) {
                        break;
                    }
                }

                const newProjectName = projectName + ` (${number})`;
                const tempPath = path.join(this.workspacePath, newProjectName);
                const zip = new AdmZip(filePath);

                zip.extractAllTo(tempPath, true);

                // *** rename
                const oldPath = path.join(tempPath, projectName + ".bpmn");
                const newPath = path.join(tempPath, newProjectName + ".bpmn")
                fs.renameSync(oldPath, newPath);
                fs.renameSync(path.join(tempPath, newProjectName + ".bpmn"), path.join(this.workspacePath, newProjectName + ".bpmn"));

                

                const oldAttachmentsPath = path.join(tempPath, projectName);
                fs.access(oldAttachmentsPath, error => {
                    if (!error) {
                        const newAttachmentsPath = path.join(tempPath, newProjectName);
                        console.log(oldAttachmentsPath, " => ", newAttachmentsPath);
                        fs.renameSync(oldAttachmentsPath, newAttachmentsPath);

                        const items = fs.readdirSync(newAttachmentsPath);
                        items.forEach((item) => {
                            const sourcePath = path.join(newAttachmentsPath, item);
                            const destinationPath = path.join(this.workspacePath, newProjectName, item);
    
    
                            fs.renameSync(sourcePath, destinationPath);
                        });
                        fs.rmdirSync(newAttachmentsPath);
                    }
                    this.mainWindow.webContents.send('loadFolder', this.workspacePath);                    
                });
                return true;
            }
        }
        const zip = new AdmZip(filePath);
        zip.extractAllTo(this.workspacePath, true);
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
        const parsedPath = path.parse(outputPath);

        const filenameWithoutExtension = parsedPath.name;

        const zip = new AdmZip();
        zip.addLocalFile(mainFilePath, "", filenameWithoutExtension + ".bpmn");
        if (fs.existsSync(attachmentsPath)) {
            zip.addLocalFolder(attachmentsPath, subFolderName);
        }
        zip.writeZip(outputPath);

    }

    projectExists(projectName: string): boolean {
        const filePath = path.join(this.workspacePath, projectName + ".bpmn");
        return fs.existsSync(filePath);
    }

    async renameProject(oldName: string, newName: string) {
        const oldPath = path.join(this.workspacePath, oldName + ".bpmn");
        const newPath = path.join(this.workspacePath, newName + ".bpmn")
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error(`Error renaming file: ${err.message}`);
            } else {
                console.log(`File renamed from ${oldPath} to ${newPath}`);


                const oldAttachmentsPath = path.join(this.workspacePath, oldName);
                fs.access(oldAttachmentsPath, error => {
                    if (!error) {
                        const newAttachmentsPath = path.join(this.workspacePath, newName);
                        fs.rename(oldAttachmentsPath, newAttachmentsPath, (err) => {
                            if (err) {
                                console.error(`Error renaming the subfolder: ${err.message}`);
                            } else {
                                console.log(`Subfolder renamed from ${oldAttachmentsPath} to ${newAttachmentsPath}`);
                            }
                        });
                    }
                });
            }
        });
        return true;
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