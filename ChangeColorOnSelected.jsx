// Script to change color on all selected layers supports solid, shape, text and artlayers

var doc;

if (app.documents.length <= 0) {
    alert("No active document!");
} else {
    doc = app.activeDocument;
    doc.suspendHistory("Change color on select layers", "ChangeLayerColors();")
}

function ChangeLayerColors() {

    if (app.showColorPicker()) {
        var color = app.foregroundColor.rgb;
        GroupSelectedLayers();
        var layers = doc.activeLayer.layers;
        var layersLength = doc.activeLayer.layers.length;
        var grp = doc.activeLayer;
        var normalLayers = [];

        var selectedLayers = [];
        for (var i = 0; i < layersLength; i++) {
            selectedLayers.push(layers[i])
        }
        undo();

        for (var i = 0; i < selectedLayers.length; i++) {
            app.refresh();
            if (selectedLayers[i].kind == LayerKind.SOLIDFILL) {
                doc.activeLayer = selectedLayers[i];
                SetSolidFillColor(color);
            } else if (selectedLayers[i].kind == LayerKind.TEXT) {
                var textColor = new SolidColor();
                textColor.rgb.red = color.red;
                textColor.rgb.green = color.green;
                textColor.rgb.blue = color.blue;
                doc.activeLayer = selectedLayers[i];
                doc.activeLayer.textItem.color = textColor;
            } else if (selectedLayers[i].kind == LayerKind.NORMAL) {
                normalLayers.push(selectedLayers[i]);
            }
        }
        for (var i = 0; i < normalLayers.length; i++) {
            doc.activeLayer = normalLayers[i];
            fillWithColor(color);
        }
    }

}

function fillWithColor(color) {
    doc.selection.selectAll();
    if (doc.activeLayer.visible === false) {
        doc.activeLayer.visible = true;
        doc.selection.fill(color, ColorBlendMode.NORMAL, 100, true);
        doc.selection.deselect();
        doc.activeLayer.visible = false;
    } else {
        doc.selection.fill(color, ColorBlendMode.NORMAL, 100, true);
        doc.selection.deselect();
    }
}


function SetSolidFillColor(color) {
    var color = app.foregroundColor.rgb;
    var idsetd = charIDToTypeID("setd");
    var desc1 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idcontentLayer = stringIDToTypeID("contentLayer");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref.putEnumerated(idcontentLayer, idOrdn, idTrgt);
    desc1.putReference(idnull, ref);
    var idT = charIDToTypeID("T   ");
    var desc2 = new ActionDescriptor();
    var idClr = charIDToTypeID("Clr ");
    var desc3 = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    desc3.putDouble(idRd, color.red);
    var idGrn = charIDToTypeID("Grn ");
    desc3.putDouble(idGrn, color.green);
    var idBl = charIDToTypeID("Bl  ");
    desc3.putDouble(idBl, color.blue);
    var idRGBC = charIDToTypeID("RGBC");
    desc2.putObject(idClr, idRGBC, desc3);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc1.putObject(idT, idsolidColorLayer, desc2);
    executeAction(idsetd, desc1, DialogModes.NO);
}

function GroupSelectedLayers() {
    var idMk = charIDToTypeID("Mk  ");
    var desc1 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idlayerSection = stringIDToTypeID("layerSection");
    ref.putClass(idlayerSection);
    desc1.putReference(idnull, ref);
    var idFrom = charIDToTypeID("From");
    var ref2 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref2.putEnumerated(idLyr, idOrdn, idTrgt);
    desc1.putReference(idFrom, ref2);
    var idlayerSectionStart = stringIDToTypeID("layerSectionStart");
    desc1.putInteger(idlayerSectionStart, 7);
    var idlayerSectionEnd = stringIDToTypeID("layerSectionEnd");
    desc1.putInteger(idlayerSectionEnd, 8);
    var idNm = charIDToTypeID("Nm  ");
    desc1.putString(idNm, """Temp""");
    executeAction(idMk, desc1, DialogModes.NO);
}

function undo() {
    executeAction(app.charIDToTypeID("undo", undefined, DialogModes.NO));
};