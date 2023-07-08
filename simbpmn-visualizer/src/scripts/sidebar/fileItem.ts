export class FileItem {
    filename: string;
    path: string;
    isDirectory: boolean;

    children: FileItem[];

    constructor(path: string, isDirectory: boolean) {
        this.path = path;
        this.isDirectory = isDirectory;
        this.filename = path.replace(/^.*[\\\/]/, '');
        this.children = [];
    }

    addChild(item: FileItem) {
        this.children.push(item);
    }
}