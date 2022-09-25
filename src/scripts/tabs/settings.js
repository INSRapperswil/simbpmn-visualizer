
const links = [...document.querySelectorAll("#settingsSwitch li")];
const menu = document.querySelector("#settingsSwitch");
const light = document.querySelector("#settingsSwitch .tubelight");

const settingsDiv = document.querySelector("#settings");
const bpmnDiv = document.querySelector("#bpmnContent");

const sidebarTitle = document.getElementById("sidebar_title");
const languageDescription = document.getElementById("language_description");
const workspaceTitle = document.getElementById("workspace_title");
const workspaceLocationDescription = document.getElementById("workspace_location_description");
const workspaceLocationLabel = document.getElementById("workspace_location_label");
const languageTitle = document.getElementById("language_title");
const languageLabel = document.getElementById("language_label");
const searchBox = document.getElementById("search");
const changeWorkspaceButton = document.getElementById("change_workspace_button");
const workspaceLocationField = document.getElementById("workspace_location");
const languagesSelectField = document.getElementById("languages");
const jsCreateDiagram = document.getElementById("js-create-diagram");

let active = false;

toggleSettings(active);
await initTranslations();

links.forEach((item, index) => {
    item.addEventListener("click", () => clickItem(item, index));
})

function clickItem(item, index) {
    toggleSettings(active);
    offsetLight(item, light);
}

function offsetLight(element, light) {
    const menuItem = element.getBoundingClientRect();
    const menuOffset = menu.getBoundingClientRect();
    let left = Math.floor(menuItem.left - menuOffset.left + (light.offsetWidth - menuItem.width) / 2);
    light.style.transform = `translate3d(${left}px, 0 , 0)`;
}

export function toggleSettings(isActive) {
    if (isActive) {
        light.style.display = "block";
        settingsDiv.style.display = "block";
        bpmnDiv.style.display = "none";
    }
    else {
        light.style.display = "none";
        settingsDiv.style.display = "none";
        bpmnDiv.style.display = "block";
    }

    active = !isActive;
}

async function initTranslations()
{
    changeWorkspaceButton.innerText = await window.electronAPI.getTranslation("Change");
    sidebarTitle.innerText = await window.electronAPI.getTranslation("Specifications");
    workspaceTitle.innerText = await window.electronAPI.getTranslation("WorkspaceLocation");
    workspaceLocationDescription.innerText = await window.electronAPI.getTranslation("WorkspaceLocationDescription");
    workspaceLocationLabel.innerText = await window.electronAPI.getTranslation("WorkspaceLocationLabel");
    languageTitle.innerText = await window.electronAPI.getTranslation("Language");
    languageLabel.innerText = await window.electronAPI.getTranslation("Language");
    languageDescription.innerText = await window.electronAPI.getTranslation("LanguageDescription");
    jsCreateDiagram.innerText = await window.electronAPI.getTranslation("Create");
    searchBox.placeholder = await window.electronAPI.getTranslation("Search");

}

window.electronAPI.getApplicationLanguage().then(language => {
    languagesSelectField.value = language;
});

languagesSelectField.addEventListener('change', async function () {
    await window.electronAPI.changeApplicationLanguage(this.value);
    await initTranslations();
});

window.electronAPI.getWorkspacePath().then(workspacePath => {
    workspaceLocationField.value = workspacePath;
});


changeWorkspaceButton.onclick = function() {
    window.electronAPI.changeWorkspaceLocation().then(workspacePath => {
        workspaceLocationField.value = workspacePath;
        }
    )
};