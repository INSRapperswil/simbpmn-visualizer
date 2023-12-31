import $ from "jquery";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { debounce } from "min-dash";
import { BpmnPropertiesPanelModule } from "bpmn-js-properties-panel";
import BpmnColorPickerModule from "bpmn-js-color-picker";
import RegularBPMNControlsModule from '../controls/regularBPMN';
import RegularBPMNRulesModules from '../controls/regularBPMN';
import RegularBPMNLabelEditingProvider from '../controls/regularBPMN';
import minimapModule from "diagram-js-minimap";
import { logic } from "../logic/logic";
import { is, getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

import ExtensionPropertiesProvider from "../provider";
import simBpmnModdleDescriptor from "../descriptors/simBPMN.json";
import regularBpmnModdleDescriptor from "../descriptors/regularBPMN.json";
import diagramXML from "../../resources/newDiagram.bpmn";
import ControlsModule from '../controls';

import bpmnTranslations from "../../translations/bpmn/translations";
import { toggleSettings } from "../tabs/settings";
import { isExpanded } from "../utils/DiUtil";

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
    RegularBPMNRulesModules,
    RegularBPMNLabelEditingProvider
  ],
  colorPicker: {
    colors: [{
      label: 'Default',
      fill: undefined,
      stroke: undefined
    }, {
      label: 'Blue',
      fill: '#BBDEFB',
      stroke: '#1E88E5'
    }, {
      label: 'Orange',
      fill: '#FFE0B2',
      stroke: '#FB8C00'
    }, {
      label: 'Green',
      fill: '#C8E6C9',
      stroke: '#43A047'
    }, {
      label: 'Red',
      fill: '#FFCDD2',
      stroke: '#FB8C00'
    }, {
      label: 'Purple',
      fill: '#E1BEE7',
      stroke: '#8E24AA'
    }, {
      label: 'Brown',
      fill: '#D2691E',
      stroke: '#654321'
    }, {
      label: 'Violet',
      fill: '#6A5ACD',
      stroke: '#4B0082'
    }, {
      label: 'Olivegreen',
      fill: '#BDB76B',
      stroke: '#808000'
    }]
  },
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

//eventBus.on("element.click", function (event) {
//console.log(event.element.id + " was clicked");

//selectShape(event.element);

//});


eventBus.on('selection.changed', function (context) {
  var oldSelection = context.oldSelection,
    newSelection = context.newSelection;

  if (newSelection.length > 0) {
    selectShape(newSelection[0]);
  } else {
    showHideLogic(true);
  }
});

function selectShape(shape) {
  console.log(shape.id + " was clicked");

  //showHideLogic(shape.type == "bpmn:SubProcess")
  showHideLogic(is(shape, "bpmn:SubProcess"))

  _currentBusinessObject = simBPMNLogic.getRelevantBusinessObject(shape);

  //load logic xml if existing
  const xml = simBPMNLogic.readLogic(_currentBusinessObject);
  window.electronAPI.openLogicRelay(xml);

  if (is(shape, "bpmn:Task")) {
    // when new task is created, it will have default-resource which has to be added to logic
    // do this here, because logic will only be created here
    adjustResources(shape);
  } else if (is(shape, "bpmn:SubProcess")) {
    adjustResources(shape);
  }
}

let activeItemIndex;
function showHideLogic(hide) {
  if (hide) {
    var tabSwitchItems = document.getElementById("tabswitchMenu").children;
    for (var i = 0; i < tabSwitchItems.length; ++i) {
      if (tabSwitchItems[i].classList.contains("active")) {
        activeItemIndex = i;
        break;
      }
    }

    $(".tabSwitchMenu li:first").trigger('click');
    document.getElementById("tabswitchMenu").children[1].style.display = "none";
    document.getElementById("tabswitchMenu").children[2].style.display = "none";
  } else {
    document.getElementById("tabswitchMenu").children[1].style.display = "";
    document.getElementById("tabswitchMenu").children[2].style.display = "";

    if (activeItemIndex > 0) {
      var item = document.getElementById("tabswitchMenu").children[activeItemIndex];
      item.click();
    }
  }

}
eventBus.on('elements.changed', function (context) {
  window.markAsDirty();

  context.elements.forEach(element => {
    if (is(element, "regularBPMN:Resource") || is(element, "regularBPMN:ResourceBoM") || is(element, "regularBPMN:ResourceWaste")) {
      element.outgoing.forEach(connection => {
        if (is(connection.target, 'bpmn:SubProcess')) {
          adjustResourcesInSubprocess(connection.target);
        }
      });
    }
  });
});

// eventBus.on('commandStack.shape.create.executed', function (event) {
//   const context = event.context;
//   const shape = context.shape;
//   console.log("shape added: ", shape);
// });

eventBus.on("commandStack.connection.create.postExecuted", function (event) {
  console.log("connection created");

  const context = event.context;
  const source = context.source;
  const target = context.target;

  if (is(source, "regularBPMN:Resource") || is(source, "regularBPMN:ResourceBoM") || is(source, "regularBPMN:ResourceWaste")) {
    adjustResources(target);
  }
});

eventBus.on("commandStack.connection.delete.preExecute", function (event) {
  const { context } = event;

  const { connection } = context;

  if (is(connection.source, "regularBPMN:Resource") || is(connection.source, "regularBPMN:ResourceBoM") || is(connection.source, "regularBPMN:ResourceWaste")) {
    adjustResources(connection.target, connection.source);
  }
});

function adjustResources(shape, disconnectingResource) {
  if (is(shape, 'bpmn:SubProcess')) {
    adjustResourcesInSubprocess(shape, disconnectingResource);
  } else {
    adjustResourcesInLogic(shape, disconnectingResource);
  }
}

function adjustResourcesInLogic(shape, disconnectingResource) {
  console.log("adjust resources in logic for", shape);
  // get all resources connected to shape
  const incoming = shape.incoming || [];
  const resources = incoming.reduce((resources, connection) => {
    if ((is(connection.source, "regularBPMN:Resource") || is(connection.source, "regularBPMN:ResourceBoM") || is(connection.source, "regularBPMN:ResourceWaste")) && (!disconnectingResource || disconnectingResource != connection.source)) {
      var bo = getBusinessObject(connection.source);
      resources.push([connection.source, bo.name, connection.source.di.get('color:background-color'), connection.source.di.get('color:border-color'), connection.source.type]);
    }
    return resources;
  }, []);

  if (is(shape, "bpmn:Task")) {
    resources.push(["default", "default", shape.di.get('color:background-color'), shape.di.get('color:border-color'), "regularBPMN:Resource"]);
  }
  window.electronAPI.adjustResourcesInLogicRelay(resources);
}

function adjustResourcesInSubprocess(shape, disconnectingResource) {
  console.log("architecture: adjust resources in subprocess for", shape);

  const incoming = shape.incoming || [];
  const resources = incoming.reduce((resources, connection) => {
    if ((is(connection.source, "regularBPMN:Resource") || is(connection.source, "regularBPMN:ResourceBoM") || is(connection.source, "regularBPMN:ResourceWaste")) && (!disconnectingResource || disconnectingResource != connection.source)) {
      resources.push(connection.source);
    }
    return resources;
  }, []);


  let elementFactory = bpmnModeler.get('elementFactory');
  let elementRegistry = bpmnModeler.get('elementRegistry');
  let moddle = bpmnModeler.get('moddle');
  let modeling = bpmnModeler.get('modeling');
  let bpmnReplace= bpmnModeler.get('bpmnReplace');
  //let root = bpmnModeler.get('canvas').getRootElement();

  let root = shape;
  if (!isExpanded(shape)) {
    // https://forum.bpmn.io/t/programmatically-populate-collapsed-subprocess/7504/3?u=symas
    root = elementRegistry.get(`${shape.id}_plane`);
  }

  const ids = [];
  let cnt = 0;
  resources.forEach(element => {
    var existingResource;
    var id;
    var name;
    //if (typeof element[0] === 'string') {
    //  id = "Resource_" + element[0];
    //} else {
    id = element.id;
    //}
    id = `${shape.id}_${id}`;
    var bo = getBusinessObject(element);
    //name = element[1];
    name = bo.name;
    ids.push(id);
    existingResource = elementRegistry.get(id);

    var type = element.type;
    if (!existingResource) {
      let resource = elementFactory.createShape({
        type: type
      });

      resource.businessObject["id"] = id;
      resource.businessObject["name"] = name;
      resource.businessObject["isFromParent"] = true;
      resource.id = id;
      var x = 300 + (cnt * 50);
      var y = 100;
      if (isExpanded(shape)) {
        x += shape.x;
        y += shape.y;
      }
      console.log("create new resource")
      modeling.createShape(resource, { x: x, y: y }, root);
    } else {
      if (existingResource.type != type) {
        var res = bpmnReplace.replaceElement(existingResource, { type: type }, {
          autoResize: false,
          layoutConnection: true
        });

        modeling.moveElements([res], {
          x: existingResource.x - res.x,
          y: existingResource.y - res.y,
        });
      }

      if (existingResource.businessObject["name"] != name) {
        console.log("update name for resource ", shape, "(" + name + ")")
        modeling.updateProperties(existingResource, {
          name: name
        });
      }

      var colorFill = element.di.get('color:background-color');
      var colorStroke = element.di.get('color:border-color')
      if (colorFill && colorStroke && (colorFill != existingResource.di.get('color:background-color') || colorStroke != existingResource.di.get('color:border-color'))) {
        modeling.setColor(existingResource, { fill: colorFill, stroke: colorStroke });
      }

    }
    cnt++;
  });



  elementRegistry.getAll().forEach(shape => {
    if (is(shape, "regularBPMN:Resource") || is(shape, "regularBPMN:ResourceBoM") || is(shape, "regularBPMN:ResourceWaste")) {
      let id = shape.businessObject["id"];
      if (shape.businessObject.isFromParent && shape.parent == root && !ids.some(x => x === id)) {
        console.log("remove resource ", shape)
        modeling.removeShape(shape);
      }
    }

  });


  // resources.forEach(element => {
  //   let resource = elementFactory.createShape({
  //     type: 'regularBPMN:Resource'
  //   });

  //   //resource.businessObject["id"] = id;
  //   resource.businessObject["name"] = "abc";
  //   modeling.createShape(resource, { x: 300 + (cnt * 50), y: 100 }, root);
  // });
}

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
