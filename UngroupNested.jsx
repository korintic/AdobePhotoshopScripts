// Ungroups layers in nested groups inside selected group and deletes the empty groups.

var selectedGroup;
var deleteEmptyGroups = true;

if (app.documents.length <= 0) {
    alert("No active document!");
} else if (app.activeDocument.activeLayer.typename != "LayerSet") {
    alert("Active layer needs to be a group");
} else {
    selectedGroup = app.activeDocument.activeLayer;
    app.activeDocument.suspendHistory("Ungroup Nested", "main();");
}

function main() {
    UngroupNested(selectedGroup);
    if(deleteEmptyGroups) {
        removeEmptySets(selectedGroup);
    }
}

function UngroupNested(sourceSet) {
    for (var i = 0; i < sourceSet.layers.length; i++) {
        if (sourceSet.layers[i] instanceof LayerSet) {
            UngroupNested(sourceSet.layers[i]);
        } else {
            sourceSet.layers[i].move(selectedGroup, ElementPlacement.INSIDE);
        }
    }
}

function removeEmptySets(sourceSet) {
    for (var i = sourceSet.layers.length - 1; i >= 0; i--) {
        if (sourceSet.layers[i] instanceof LayerSet && sourceSet.layers[i].artLayers.length == 0) {
            sourceSet.layers[i].remove();
        }
    }
}