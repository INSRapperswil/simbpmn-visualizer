import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import diagramXML from "../../resources/newLogicDiagram.bpmn";
import emptyDiagramXML from "../../resources/emptyLogicDiagram.bpmn";

export class logic {

    getRelevantBusinessObject = function (element) {
        let businessObject = getBusinessObject(element);

        if (is(element, 'bpmn:Participant')) {
            return businessObject.get('processRef');
        }

        return businessObject;
    }

    getPropertiesList = function (businessObject) {
        const properties = this.getProperties(businessObject);
        return properties && properties.get('values');
    }

    readLogic(businessObject) {
        let xml = businessObject.$attrs.content;
        if (xml === undefined) {
            if(is(businessObject, "bpmn:SequenceFlow") || is(businessObject, "bpmn:Gateway") || is(businessObject, "bpmn:Event") || is(businessObject, "regularBPMN:Entity") || is(businessObject, "regularBPMN:Resource") || is(businessObject, "regularBPMN:ResourceBoM") || is(businessObject, "regularBPMN:ResourceWaste")) {
                return emptyDiagramXML;
            } 
            return diagramXML;
        }

        return xml;
    }

    writeLogic = function (businessObject, bpmnModeler, xml) {
        const moddle = bpmnModeler.get("moddle");
        const modeling = bpmnModeler.get("modeling");
        const elementRegistry = bpmnModeler.get("elementRegistry");

        let element = elementRegistry.get(businessObject.id);
        if(element) {
            let newBody = moddle.create("simBPMN:Logic", { content: xml });
            modeling.updateProperties(element, newBody);
        }
    }
}