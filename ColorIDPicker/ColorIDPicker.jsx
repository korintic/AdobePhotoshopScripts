/*
<javascriptresource>
<name>ColorIDPicker</name>
<category>ColorIDPicker</category>
</javascriptresource>
*/

// Default settings
var idLayerName = "ColorID";
var toggleLayerVisibility = true;
var toggleSelectionVisibility = true;
var alwaysSelectLayerMask = false;

// CustomOption variables
const cIDToggleLayerVis = app.stringIDToTypeID("cIDToggleLayerVis");
const cIDToggleSelectionVis = app.stringIDToTypeID("cIDToggleSelectionVis");
const cIDAlwaysSelectMask = app.stringIDToTypeID("cIDAlwaysSelectMask");
const cIDLayerName = app.stringIDToTypeID("cIDLayerName");
const cIDSettings = "cIDSettings";

var doc;
var idLayer;
var savedState;

try {
    if (setPrefs) {
        eraseCustomOptions("ColorIDPicker");
        showUI();
    }
} catch (e) {
    try {
        var settings = getSettings();
        toggleLayerVisibility = settings[0];
        toggleSelectionVisibility = settings[1];
        alwaysSelectLayerMask = settings[2];
        idLayerName = settings[3];
    } catch (e) {
        eraseCustomOptions("ColorIDPicker");
        saveSettings(toggleLayerVisibility, toggleSelectionVisibility, alwaysSelectLayerMask, idLayerName);
    }
    pickColorID();
}

function pickColorID() {
    if (app.documents.length <= 0) {
        alert("No active document");
        return;
    }

    doc = app.activeDocument;
    idLayer = getLayerIDByName(idLayerName);

    if (idLayer == undefined) {
        alert('"' + idLayerName + '"' + " layer not found!");
    } else if (!PreferencesExist()) {
        // If saved state not found save state and apply colorpicker state
        captureState();
        setState();
    }
    else if (savedState.getString(3) != doc.name) {
        // If saved state found and document name matches apply saved state
        captureState();
        setState();
    } else {
        restoreState();
    }
}

function captureState() {
    var desc = new ActionDescriptor();

    desc.putString(0, currentTool);
    desc.putInteger(1, doc.activeLayer.id);
    desc.putBoolean(2, doc.activeLayer.visible);
    desc.putString(3, doc.name);
    
    app.putCustomOptions("ColorIDPicker", desc, true);
}

function setState() {
    currentTool = "magicWandTool";
    if (toggleLayerVisibility) {
        showOnlyLayerByID(idLayer);
    }
    
    selectLayerByID(idLayer);
    if (toggleSelectionVisibility) {
        app.runMenuItem(app.stringIDToTypeID("toggleShowExtras"));
    }
}

function restoreState() {
    currentTool = savedState.getString(0);
    if (toggleLayerVisibility) {
        showOnlyLayerByID(idLayer);
    }
    
    selectLayerByID(savedState.getInteger(1));
    if (!savedState.getBoolean(2) && toggleLayerVisibility) {
        hideLayerByID(savedState.getString(1));
    }

    if (toggleSelectionVisibility) {
        app.runMenuItem(app.stringIDToTypeID("toggleShowExtras"));
    }

    if (app.activeDocument.activeLayer.kind != LayerKind.NORMAL || alwaysSelectLayerMask) {
        selectLayerMask();
    }
    
    app.eraseCustomOptions("ColorIDPicker");
}

function showOnlyLayerByID(layerID) {
    var idShw = charIDToTypeID("Shw ");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var list = new ActionList();
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putIdentifier(idLyr, layerID);
    list.putReference(ref);
    desc.putList(idnull, list);
    var idTglO = charIDToTypeID("TglO");
    desc.putBoolean(idTglO, true);
    
    executeAction(idShw, desc, DialogModes.NO);
}

function selectLayerByID(layerID) {
    var idslct = charIDToTypeID("slct");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putIdentifier(idLyr, layerID);
    desc.putReference(idnull, ref);
    var idMkVs = charIDToTypeID("MkVs");
    desc.putBoolean(idMkVs, false);
    var idLyrI = charIDToTypeID("LyrI");
    var list = new ActionList();
    list.putInteger(4);
    desc.putList(idLyrI, list);
    
    executeAction(idslct, desc, DialogModes.NO);
}

function selectLayerByName(layerName) {
    var idslct = charIDToTypeID("slct");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putName(idLyr, layerName);
    desc.putReference(idnull, ref);
    var idMkVs = charIDToTypeID("MkVs");
    desc.putBoolean(idMkVs, false);
    var idLyrI = charIDToTypeID("LyrI");
    var list = new ActionList();
    list.putInteger(4);
    desc.putList(idLyrI, list);
    
    executeAction(idslct, desc, DialogModes.NO);
}

function hideLayerByID(layerID) {
    var idHd = charIDToTypeID("Hd  ");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var list = new ActionList();
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putIdentifier(idLyr, layerID);
    list.putReference(ref);
    desc.putList(idnull, list);
    
    executeAction(idHd, desc, DialogModes.NO);
}

function selectLayerMask() {
    try {
        var idslct = charIDToTypeID("slct");
        var desc = new ActionDescriptor();
        var idnull = charIDToTypeID("null");
        var ref = new ActionReference();
        var idChnl = charIDToTypeID("Chnl");
        var idChnl = charIDToTypeID("Chnl");
        var idMsk = charIDToTypeID("Msk ");
        ref.putEnumerated(idChnl, idChnl, idMsk);
        desc.putReference(idnull, ref);
        var idMkVs = charIDToTypeID("MkVs");
        desc.putBoolean(idMkVs, false);
        
        executeAction(idslct, desc, DialogModes.NO);
    } catch (e) {}
}

function getLayerIDByName(layerName) {
    currentLayer = doc.activeLayer;
    try {
        selectLayerByName(layerName);
        var ref = new ActionReference();
        ref.putEnumerated(
            charIDToTypeID("Lyr "),
            charIDToTypeID("Ordn"),
            charIDToTypeID("Trgt")
        );
        return executeActionGet(ref).getInteger(charIDToTypeID("LyrI"));
    } catch (e) {} finally {
        doc.activeLayer = currentLayer;
    }
}

function PreferencesExist() {
    try {
        return (savedState = app.getCustomOptions("ColorIDPicker"));
    } catch (e) {}
}

function showUI() {
    try {
        var settings = getSettings();
        toggleLayerVisibility = settings[0];
        toggleSelectionVisibility = settings[1];
        alwaysSelectLayerMask = settings[2];
        idLayerName = settings[3];
    } catch (e) {
        saveSettings(toggleLayerVisibility, toggleSelectionVisibility, alwaysSelectLayerMask, idLayerName);
    }
    
    eraseCustomOptions("cIDSettings");
    var w = new Window("dialog", "ColorIDPicker Preferences", undefined, {
        closeButton: true
    });
    w.alignChildren = "fill";

    var inputGrp = w.add("group");
    inputGrp.add("statictext", undefined, "Selection Layer Name:");
    var layerNameField = inputGrp.add("edittext", undefined, idLayerName);
    layerNameField.characters = 15;

    var panelGrp = w.add("panel", undefined, undefined);
    panelGrp.orientation = "column";
    panelGrp.alignChildren = "fill";
    var selectionVisField = panelGrp.add("checkbox", undefined, "Toggle selection visibility");
    selectionVisField.value = toggleSelectionVisibility;
    var layerVisField = panelGrp.add("checkbox", undefined, "Toggle layer visibility");
    layerVisField.value = toggleLayerVisibility;
    var selectMaskField = panelGrp.add("checkbox", undefined, "Always select layer mask");
    selectMaskField.value = alwaysSelectLayerMask;

    var buttonGrp = w.add('group {alignment: "center"}');
    btnSavePrefs = buttonGrp.add('button', undefined, 'Save Preferences');
    btnSavePrefs.onClick = function() {
        saveSettings(layerVisField.value, selectionVisField.value, selectMaskField.value, layerNameField.text);
        w.close(1)
    }

    var showWin = w.show();
}

function saveSettings(layerVis, selectionVis, selectMask, layerName) {
    var desc = new ActionDescriptor();
    desc.putBoolean(cIDToggleLayerVis, layerVis);
    desc.putBoolean(cIDToggleSelectionVis, selectionVis);
    desc.putBoolean(cIDAlwaysSelectMask, selectMask);
    desc.putString(cIDLayerName, layerName);

    app.putCustomOptions(cIDSettings, desc, true);
}

function getSettings() {
    var desc = app.getCustomOptions(cIDSettings);
    return [desc.getBoolean(cIDToggleLayerVis), desc.getBoolean(cIDToggleSelectionVis),
        desc.getBoolean(cIDAlwaysSelectMask), desc.getString(cIDLayerName)
    ];
}