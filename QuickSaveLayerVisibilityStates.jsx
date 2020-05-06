/*
<javascriptresource>
<name>Quick Save Layer Visibility States</name>
<category>AdvancedUtils</category>
</javascriptresource>
*/

var doc;

var docStateExist = false;
var visibleLayerIDs = new ActionList();
var desc = new ActionDescriptor();

var toggleVisibility = false; //If true the visibility on all layers that are not selected will be turned off when saving visibility states

if (app.documents.length <= 0) {
    alert("No active document!");
} else {
    doc = app.activeDocument;
    if(doc.layers.length === 1 && doc.layers[0].isBackgroundLayer) {
        alert("Operation cancelled\n Document only contains a background layer")
    }
    else {
        QuickSaveLayerVisibilityStates();  
    }
}

function QuickSaveLayerVisibilityStates() {
    try {
        desc = app.getCustomOptions("QuickSaveLayerVisibilityStates");
        desc.getList(doc.id);
        docStateExist = true;
    } catch (e) {}

    if (docStateExist) {
        HideAllLayers(doc.layers);
        ReturnDocState(GetDocState(doc.id), doc.layers);
        DeleteDocState(doc.id);
    } else {
        GetVisibleLayerIDs(doc.layers);
        CreateDocState(doc.id, visibleLayerIDs);
        if (toggleVisibility) {
            HideAllLayers(doc.layers);
            var selectedLayersIndices = GetSelectedLayersIndices();
            RevealSelectedLayers(doc.layers, selectedLayersIndices);
        }
    }

}

function RevealSelectedLayers(layers, selectedLayerIndices) {
    for (var i = 0; i < layers.length; i++) {
        for (var j = 0; j < selectedLayerIndices.length; j++) {
            if (layers[i].itemIndex === selectedLayerIndices[j]) {
                layers[i].visible = true;
                SetParentsVisible(layers[i]);
            }
        }
        if (layers[i].typename === "LayerSet") {
            RevealSelectedLayers(layers[i].layers, selectedLayerIndices);
        }
    }
}

function SetParentsVisible(layer) {
    if (layer.parent.typename === "LayerSet") {
        layer.parent.visible = true;
        SetParentsVisible(layer.parent);
    }
}

function GetVisibleLayerIDs(layers) {
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].visible) {
            visibleLayerIDs.putInteger(layers[i].id);
        }
        if (layers[i].typename === "LayerSet") {
            GetVisibleLayerIDs(layers[i].layers);
        }
    }
}

function HideAllLayers(layers) {
    for (var i = 0; i < layers.length; i++) {
        layers[i].visible = false;
        if (layers[i].typename === "LayerSet") {
            HideAllLayers(layers[i].layers)
        }
    }
}

function ReturnDocState(layerIDs, layers) {
    for (var i = 0; i < layers.length; i++) {
        for (var j = 0; j < layerIDs.count; j++) {
            if (layers[i].id === layerIDs.getInteger(j)) {
                layers[i].visible = true;
            }
        }
        if (layers[i].typename === "LayerSet") {
            ReturnDocState(layerIDs, layers[i].layers);
        }
    }
}

function DeleteDocState(docID) {
    desc.erase(docID);
    app.putCustomOptions("QuickSaveLayerVisibilityStates", desc, false);
}

function CreateDocState(docID, actionList) {
    desc.putList(docID, actionList);
    app.putCustomOptions("QuickSaveLayerVisibilityStates", desc, false);
}

function GetDocState(docID) {
    var desc = app.getCustomOptions("QuickSaveLayerVisibilityStates");
    return desc.getList(docID);
}

function GetSelectedLayersIndices() {
    var selectedLayers = new Array;
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
        desc = desc.getList(stringIDToTypeID('targetLayers'));
        var c = desc.count;
        var selectedLayers = new Array();
        for (var i = 0; i < c; i++) {
            selectedLayers.push(desc.getReference(i).getIndex()+1);
        }
    } else {
        var ref = new ActionReference();
        ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
        ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
        selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI"))+1);
    }
    return selectedLayers;
}
