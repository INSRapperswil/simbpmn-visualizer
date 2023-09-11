import { FileItem } from "./fileItem";
import Enumerable from "linq";

export class Sidebar {

  readFiles = async function (path: string) {
    try {
      //console.log("try getting files from: ", path);
      const result = await (window as any).electronAPI.scanDirectory(path);
      //console.log("file result: ",  result);
      return result;
    } catch (ex) {
      console.log("exception: " + ex);
      return [];
    }
  };

  loadFilesFromPath = function (path: string) {
    const promise = this.readFiles(path);
    promise.then((foundFiles: any) => {
      foundFiles = foundFiles.sort();

      const result = this.createHierarchy(path, foundFiles);
      result.then((elements: any) => {
        this.displayItems(elements);
      });
    });
    this.createSearchBoxEvents();
  };

  displayItems = function (fileItems: FileItem[]) {
    const root = document.getElementById("files");
    //remove all children
    root.innerHTML = "";

    for (const fileItem of fileItems) {
      this.displayItem(root, fileItem);
    }
  };

  displayItem = function (htmlNode: any, item: FileItem) {
    //console.debug("processing element: ", item);
    this.createHtmlObject(htmlNode, item);
  };

  createHierarchy = async function (rootPath: string, paths: string[]) {
    const hierarchy: FileItem[] = [];
    for (const path of paths) {
      const result = await (window as any).electronAPI.isDirectory(path);
      hierarchy.push(new FileItem(path, result));
    }

    const directories = Enumerable.from(hierarchy)
      .where((item) => item.isDirectory)
      .toArray();

    for (const file of hierarchy) {
      for (const dir of directories) {
        if (!file.isDirectory && file.filename.split('.').pop() === 'bpmn' &&
          dir.filename == file.filename.replace(/\.[^/.]+$/, "")) {
          file.addChild(dir);
          break;
        }
        if (dir.path === this.getPathName(file.path)) {
          dir.addChild(file);
          break;
        }
      }
    }

    return Enumerable.from(hierarchy)
      .where((item) => (rootPath === this.getPathName(item.path) && !item.isDirectory))
      .toArray();
  };

  createHtmlObject = function (
    htmlNode: any,
    fileItem: FileItem
  ) {

    const listItem = document.createElement("li");

    const children = document.createElement("ul");

    const node = document.createElement("input");
    node.id = 'listItem-' + fileItem.filename;
    node.classList.add("sidebar_filelist");
    node.type = 'checkbox';

    const label = document.createElement("label");
    label.htmlFor = "listItem-" + fileItem.filename;
    label.classList.add("listItemLabel");
    const labelText = fileItem.filename.replace(/\.[^/.]+$/, "");
    const labelDiv = document.createElement("div")
    labelDiv.textContent = labelText;
    label.appendChild(labelDiv);
    //label.innerHTML = labelText;

    const input = document.createElement("input");
    input.style.display = "none";
    input.style.width = "100%"
    input.addEventListener("keydown", (event) => {
      // Überprüfen, ob die gedrückte Taste die Enter-Taste ist (Keycode 13)
      if (event.key === "Enter") {
        event.stopPropagation();

        if ((window as any).electronAPI.projectExists(input.value)) {
          (window as any).electronAPI.showMessage("Warning", "Project already exists.", "warning");
          return;
        }

        (window as any).electronAPI.renameProject(labelDiv.textContent, input.value)

        fileItem.filename = input.value + ".bpmn";

        children.firstChild.textContent = fileItem.filename;

        const lastIndex = fileItem.path.lastIndexOf(labelDiv.textContent);
        fileItem.path = fileItem.path.substring(0, lastIndex) + input.value + fileItem.path.substring(lastIndex + labelDiv.textContent.length);
        if (fileItem.children.length > 0) {
          for (const child of fileItem.children[0].children) {
            const lastIndex = child.path.lastIndexOf(labelDiv.textContent);
            child.path = child.path.substring(0, lastIndex) + input.value + child.path.substring(lastIndex + labelDiv.textContent.length);
          }
        }
        labelDiv.textContent = input.value;

        input.style.display = "none";
        label.style.display = "";
        children.style.display = "";

        node.checked = false;
        // Hier können Sie den gewünschten Code ausführen, wenn die Enter-Taste gedrückt wird
        //alert("Enter wurde gedrückt!");
      } else if (event.key === "Escape") {
        event.stopPropagation();

        input.style.display = "none";
        label.style.display = "";
        children.style.display = "";
        node.checked = false;
      }
    });

    const listControlElement = document.createElement("div");
    label.appendChild(listControlElement);

    const listControlElementRename = document.createElement("div");
    listControlElementRename.classList.add("listRenameButton");
    listControlElementRename.addEventListener("click", (event) => {
      event.stopPropagation();

      input.style.display = "block";
      label.style.display = "none";
      children.style.display = "none";
      input.value = labelDiv.textContent;

      setTimeout(() => {
        input.focus();
        input.select();
      });
    })
    listControlElement.appendChild(listControlElementRename);

    const listControlElementDelete = document.createElement("div");
    listControlElementDelete.classList.add("listDeleteButton");
    listControlElementDelete.addEventListener("click", (event) => {
      event.stopPropagation();
      if ((window as any).electronAPI.askForDeleting() == 0) {
        (window as any).electronAPI.deleteFile(fileItem.path);
      }
      node.checked = false;
    })
    listControlElement.appendChild(listControlElementDelete);


    const baseFileElement = document.createElement("li");
    baseFileElement.innerHTML = fileItem.filename;
    baseFileElement.classList.add("childListItem");
    baseFileElement.addEventListener("click", () => {
      (window as any).checkForDirty().then((res: boolean) => {
        if (res) {
          (window as any).electronAPI.openFile(fileItem.path, true);
        }
      })
    })
    children.appendChild(baseFileElement);
    if (fileItem.children[0]) {
      for (const child of fileItem.children[0].children) {
        const childElement = document.createElement("li");
        childElement.innerHTML = child.filename;
        childElement.style.paddingLeft = "20px"
        childElement.classList.add("childListItem");
        console.log(child.path);
        childElement.addEventListener("click", () => {
          (window as any).electronAPI.openFile(child.path, true);
        });
        children.appendChild(childElement);
      }
    }



    listItem.appendChild(node);
    listItem.appendChild(label);
    listItem.appendChild(input);
    listItem.appendChild(children);

    htmlNode.appendChild(listItem);
    return htmlNode;
  };

  getFileName = function (path: string): string {
    return path.split(/[\\/]/).pop();
  };

  getPathName = function (path: string): string {
    const filename = this.getFileName(path);
    return path.substring(0, path.length - filename.length - 1);
  };

  createSearchBoxEvents = function () {
    const search = document.getElementById("search");
    search.addEventListener("input", this.searchBoxTextChange);
  };

  searchBoxTextChange = function (searchKey: any) {
    const searchParam = searchKey.target.value;
    const elements = document.getElementsByClassName("listItemLabel");

    for (let i = 0; i < elements.length; i++) {
      const item = elements.item(i) as HTMLElement;
      item.parentElement.style.display = "block";
    }

    if (searchParam === "") {
      return;
    }

    console.log("looking for: " + searchParam);

    const result = Array.prototype.filter.call(elements, function (element: any) {
      return !element.innerHTML
        .toLowerCase()
        .includes(searchParam.toLowerCase());
    });
    console.log(result);

    for (const elementTohide of result) {
      const toHide = elementTohide as HTMLElement;
      toHide.parentElement.style.display = "none";
    }
  };
}



//https://medium.com/teneocto/electronjs-how-to-communicate-between-main-process-renderer-process-and-injected-webview-1b4fbd76e0b7
