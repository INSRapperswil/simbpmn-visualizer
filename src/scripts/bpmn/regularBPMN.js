import $ from "jquery";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { debounce } from "min-dash";
import { BpmnPropertiesPanelModule } from "bpmn-js-properties-panel";
import BpmnColorPickerModule from "bpmn-js-color-picker";
import RegularBPMNControlsModule from '../controls/regularBPMN';
import RegularBPMNRulesModules from '../controls/regularBPMN';
import minimapModule from "diagram-js-minimap";
import { logic } from "../logic/logic";
import { is } from "bpmn-js/lib/util/ModelUtil";

import ExtensionPropertiesProvider from "../provider";
import simBpmnModdleDescriptor from "../descriptors/simBPMN.json";
import regularBpmnModdleDescriptor from "../descriptors/regularBPMN.json";
import diagramXML from "../../resources/newDiagram.bpmn";
import ControlsModule from '../controls';

import bpmnTranslations from "../../translations/bpmn/translations";
import { toggleSettings } from "../tabs/settings";


const container = $("#js-drop-zone");
const canvas = $("#js-canvas");
const bpmnContent = document.querySelector("#bpmnContent");
const tabs = document.querySelector("#bottomMenu");
const middle = document.querySelector("#middle");

const simBPMNLogic = new logic();
initApplication(false);

const customTranslateModule = {
  translate: ["value", bpmnTranslations],
};

const bpmnModeler = new BpmnModeler({
  container: canvas,
  propertiesPanel: {
    parent: "#js-properties-panel",
  },
  additionalModules: [
    minimapModule,
    BpmnPropertiesPanelModule,
    BpmnColorPickerModule,
    ExtensionPropertiesProvider,
    // Can not activly switch translations atm
    //customTranslateModule,
    ControlsModule,
    RegularBPMNControlsModule,
    RegularBPMNRulesModules
  ],
  moddleExtensions: {
    simbpmn: simBpmnModdleDescriptor,
    regularbpmn: regularBpmnModdleDescriptor
  },
});
container.removeClass("with-diagram");

function createNewDiagram() {
  const filename = document.getElementById("filename");
  window.electronAPI.createNewFile(filename.value + ".bpmn", diagramXML);

  openDiagram(diagramXML);
}

async function openDiagram(xml) {
  try {
    await bpmnModeler.importXML(xml);
    initApplication(true);

    container.addClass("with-diagram");
  } catch (err) {
    console.error(err);
  }
}

function registerFileDrop(container, callback) {
  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    var file = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var xml = e.target.result;
      callback(xml);
    };

    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener("dragover", handleDragOver, false);
  container.get(0).addEventListener("drop", handleFileSelect, false);
}

////// file drag / drop ///////////////////////

// check file api availability

if (!window.FileList || !window.FileReader) {
  window.alert(
    "Looks like you use an older browser that does not support drag and drop. " +
    "Try using Chrome, Firefox or the Internet Explorer > 10."
  );
} else {
  registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions

$(function () {
  $("#js-create-diagram").on("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    createNewDiagram();
  });

  var downloadLink = $("#js-download-diagram");
  var downloadSvgLink = $("#js-download-svg");

  $(".buttons a").on("click", (e) => {
    if (!$(this).is(".active")) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass("active").attr({
        href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
        download: name,
      });
    } else {
      link.removeClass("active");
    }
  }

  var exportArtifacts = debounce(async function () {
    try {
      const { svg } = await bpmnModeler.saveSVG();
      setEncoded(downloadSvgLink, "diagram.svg", svg);
    } catch (err) {
      console.error("Error happened saving SVG: ", err);
      setEncoded(downloadSvgLink, "diagram.svg", null);
    }

    try {
      const { xml } = await bpmnModeler.saveXML({ format: true });
      setEncoded(downloadLink, "diagram.bpmn", xml);
    } catch (err) {
      console.log("Error happened saving XML: ", err);
      setEncoded(downloadLink, "diagram.bpmn", null);
    }
  }, 500);

  bpmnModeler.on("commandStack.changed", exportArtifacts);
});

//save

window.electronAPI.onCreateXmlFile((event) => {
  bpmnModeler
    .saveXML({ format: true })
    .then((xml) => {
      event?.sender.send("xml-value", xml.xml);
      window.markAsClean();
    })
    .catch((error) => console.error("Error happened saving XML: ", error));
});

window.electronAPI.onOpenXmlFile((event, xml) => {
  openDiagram(xml);
});

window.onbeforeunload = (e) => {
  if (window.electronAPI.isDev()) {
    // If reload due to code changes should not be a question of dirty but autom. save
    bpmnModeler
      .saveXML({ format: true })
      .then((xml) => {
        window.electronAPI.saveForQuit(xml.xml).then();
      })
      .catch((error) => {
        console.error("Error happened saving XML: ", error);
      });
    window.markAsClean();
    return;
  }
  if (window.modelIsDirty) {
    e.preventDefault();
    e.returnValue = false;

    setTimeout(() => {
      window.checkForDirty().then(res => {
        if (res) {
          window.electronAPI.closeApp();
        }
      })
    }, 100);
  }
}

window.checkForDirty = () => {
  return new Promise(resolve => {
    if (window.modelIsDirty) {
      // buttons: ['Yes', 'No', 'Cancel'],
      var response = 1;
      if (!window.electronAPI.isDev()) {
        response = window.electronAPI.askForSavingChanges();
      }
      if (response == 0) {
        bpmnModeler
          .saveXML({ format: true })
          .then((xml) => {
            window.electronAPI.saveForQuit(xml.xml).then(() => {
              window.markAsClean();
              resolve(true);
            });
          })
          .catch((error) => {
            console.error("Error happened saving XML: ", error);
            resolve(false);
          });
      } else if (response == 1) {
        resolve(true);
      } else if (response == 2) {
        resolve(false);
      }
    } else {
      resolve(true);
    }
  });
}
//----------------------------------------------------------------------
//simBPMN functions
//----------------------------------------------------------------------

var eventBus = bpmnModeler.get("eventBus");
let _currentBusinessObject = null;

eventBus.on("element.click", function (event) {
  //console.log(event.element.id + " was clicked");

  //selectShape(event.element);

});

eventBus.on('selection.changed', function (context) {
  var oldSelection = context.oldSelection,
    newSelection = context.newSelection;

  if (newSelection.length > 0) {
    selectShape(newSelection[0]);
  }
  // go crazy
});

function selectShape(shape) {
  console.log(shape.id + " was clicked");

  //showHideLogic(shape.type == "bpmn:SubProcess")
  showHideLogic(is(shape, "bpmn:SubProcess"))

  _currentBusinessObject = simBPMNLogic.getRelevantBusinessObject(shape);

  //load logic xml if existing
  const xml = simBPMNLogic.readLogic(_currentBusinessObject);
  window.electronAPI.openLogicRelay(xml);
}

function showHideLogic(hide) {
  if (hide) {
    $(".tabSwitchMenu li:first").trigger('click');
    document.getElementById("tabswitchMenu").children[1].style.display = "none";
    document.getElementById("tabswitchMenu").children[2].style.display = "none";
  } else {
    document.getElementById("tabswitchMenu").children[1].style.display = "";
    document.getElementById("tabswitchMenu").children[2].style.display = "";
  }

}
eventBus.on('elements.changed', function (context) {
  window.markAsDirty();
  //var elements = context.elements;
});

eventBus.on('commandStack.shape.create.executed', function (event) {
  console.log("shape added");
  //selectShape(event.context.shape);
});

window.markAsDirty = () => {
  window.modelIsDirty = true;
  if (!document.title.endsWith("*")) {
    document.title += " *"
  }
}

window.markAsClean = () => {
  window.modelIsDirty = false;
  if (document.title.endsWith("*")) {
    document.title = document.title.substring(0, document.title.length - 1).trimEnd();
  }
}

window.markAsClean();

window.electronAPI.saveLogic((event, xml) => {
  if (_currentBusinessObject === null) {
    return;
  }
  simBPMNLogic.writeLogic(_currentBusinessObject, bpmnModeler, xml);
});

window.electronAPI.returnToMainPage((event) => {
  window.checkForDirty().then(res => {
    if (res) {
      container.removeClass("with-diagram");
      initApplication();
    }
  });
});


//-----------------------------------------------------------------
// init
//-----------------------------------------------------------------
function initApplication(display) {
  toggleSettings(false);
  if (display) {
    bpmnContent.style.display = "block";
    tabs.style.display = "flex";
    middle.style.display = "flex";
  }
  else {
    bpmnContent.style.display = "none";
    tabs.style.display = "none";
    middle.style.display = "none";
  }
}
