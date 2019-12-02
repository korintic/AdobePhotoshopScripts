/*
<javascriptresource>
<name>Advanced Layer Renamer</name>
<category>AvancedUtils</category>
</javascriptresource>
*/

var doc;
var matchingLayers = [];
var layersToUpdate = [];
var layerIDs = [];
var selected = [];

var matches = false;
var contains = true;
var begingsWith = false;
var endsWith = false;

var replace = true;
var replaceWhole = false;
var addPrefix = false;
var addSuffix = false;
var selectMatching = false;
var ignoreCase = false;
var useRegEx = false;
var global = true;

var updateMatching = true;
var updateSelected = false;

var selectWhenRenaming = false;
var newSelection = true;
var addToSelection = false;
var removeFromSelection = false;

var searchInput = "";
var replaceWith = "";
var flag = "g";
var layerTypeDropdown;
var blendModeDropdown;

var checkOpacity = false;
var checkFillOpacity = false;
var minOpacity = 0;
var maxOpacity = 100;
var minFillOpacity = 0;
var maxFillOpacity = 100;

String.prototype.endsWith = function (str) {
    return this.substring(this.length - str.length, this.length) === str;
};
String.prototype.startsWith = function (str) {
    return this.substring(0, str.length) === str;
};

var layerBlendModes = {
    "Normal": BlendMode.NORMAL,
    "Dissolve": BlendMode.DISSOLVE,
    "Darken": BlendMode.DARKEN,
    "Multiply": BlendMode.MULTIPLY,
    "Color Burn": BlendMode.COLORBURN,
    "Linear Burn": BlendMode.LINEARBURN,
    "Darker Color": BlendMode.DARKERCOLOR,
    "Lighten": BlendMode.LIGHTEN,
    "Screen": BlendMode.SCREEN,
    "Color Dodge": BlendMode.COLORDODGE,
    "Linear Dodge (Add)": BlendMode.LINEARDODGE,
    "Lighter Color": BlendMode.LIGHTERCOLOR,
    "Overlay": BlendMode.OVERLAY,
    "Soft Light": BlendMode.SOFTLIGHT,
    "Hard Light": BlendMode.HARDLIGHT,
    "Vivid Light": BlendMode.VIVIDLIGHT,
    "Linear Light": BlendMode.LINEARLIGHT,
    "Pin Light": BlendMode.PINLIGHT,
    "Hard Mix": BlendMode.HARDMIX,
    "Difference": BlendMode.DIFFERENCE,
    "Exclusion": BlendMode.EXCLUSION,
    "Subtract": BlendMode.SUBTRACT,
    "Divide": BlendMode.DIVIDE,
    "Hue": BlendMode.HUE,
    "Saturation": BlendMode.SATURATION,
    "Color": BlendMode.COLORBLEND,
    "Luminosity": BlendMode.LUMINOSITY
};

var layerTypes = {
    "Normal": LayerKind.NORMAL,
    "Text": LayerKind.TEXT,
    "SmartObject": LayerKind.SMARTOBJECT,
    "Solid": LayerKind.SOLIDFILL,
    "Gradient": LayerKind.GRADIENTFILL,
    "Pattern": LayerKind.PATTERNFILL,
    "Brightness/Contrast": LayerKind.BRIGHTNESSCONTRAST,
    "Levels": LayerKind.LEVELS,
    "Curves": LayerKind.CURVES,
    "Exposure": LayerKind.EXPOSURE,
    "Vibrance": LayerKind.VIBRANCE,
    "Hue/Saturation": LayerKind.HUESATURATION,
    "Color Balance": LayerKind.COLORBALANCE,
    "Black & White": LayerKind.BLACKANDWHITE,
    "Photo Filter": LayerKind.PHOTOFILTER,
    "Channel Mixer": LayerKind.CHANNELMIXER,
    "Color Lookup": LayerKind.COLORLOOKUP,
    "Invert": LayerKind.INVERSION,
    "Posterize": LayerKind.POSTERIZE,
    "Threshold": LayerKind.THRESHOLD,
    "Gradient Map": LayerKind.GRADIENTMAP,
    "Selective Color": LayerKind.SELECTIVECOLOR
};

var adjustmentLayers = [
    LayerKind.BRIGHTNESSCONTRAST, LayerKind.LEVELS, LayerKind.CURVES,
    LayerKind.EXPOSURE, LayerKind.VIBRANCE, LayerKind.HUESATURATION,
    LayerKind.COLORBALANCE, LayerKind.BLACKANDWHITE, LayerKind.PHOTOFILTER,
    LayerKind.CHANNELMIXER, LayerKind.COLORLOOKUP, LayerKind.INVERSION, LayerKind.POSTERIZE,
    LayerKind.THRESHOLD, LayerKind.GRADIENTMAP, LayerKind.SELECTIVECOLOR
];

var shapeAndFillLayers = {
    "Solid Fill": LayerKind.SOLIDFILL,
    "Gradient Fill": LayerKind.GRADIENTFILL,
    "Pattern": LayerKind.PATTERNFILL
};

if (app.documents.length <= 0) {
    alert("No active document");
} else {
    doc = app.activeDocument;
    doc.suspendHistory("Advanced Layer Renamer", "main();");
}

function main() {
    selected = GetSelectedLayersIDs();
    for(var i = 0; i < selected.length; i++) {
        layerIDs.push(getLayerIDByIndex(selected[i]));
    }
    if(layerIDs.length !== 0) {
        deselectAllLayers();
        selectLayersByID(layerIDs);
    }
    showUI();
}

function showUI() {

    var w = new Window("dialog", "Advanced Layer Renamer", undefined, {closeButton: true});
    w.alignChildren = "fill";

    var searchResults = "";
    var inputGrp = w.add("group");
    inputGrp.add("statictext", undefined, "Search For:");
    var searchInputField = inputGrp.add("edittext", undefined, searchResults);
    searchInputField.characters = 30;


    var panelGrp = w.add("panel", undefined, undefined);
    panelGrp.orientation = "row";
    var containsToggle = panelGrp.add("radiobutton", undefined, "Contains");
    var matchesToggle = panelGrp.add("radiobutton", undefined, "Matches");
    var begingsWithToggle = panelGrp.add("radiobutton", undefined, "Begins With");
    var endsWithToggle = panelGrp.add("radiobutton", undefined, "Ends With");
    containsToggle.value = true;

    var replaceGrp = w.add("group");
    replaceGrp.add("statictext", undefined, "New Name:");
    var replaceWithField = replaceGrp.add("edittext", undefined, "");
    replaceWithField.characters = 30;

    var toggleGrp = w.add("panel", undefined, undefined);
    toggleGrp.orientation = "row";
    toggleGrp.alignChildren = "fill";

    var replaceToggle = toggleGrp.add("radiobutton", undefined, "Replace");
    var replaceWholeToggle = toggleGrp.add("radiobutton", undefined, "Replace Whole");
    var addPrefixToggle = toggleGrp.add("radiobutton", undefined, "Add Prefix");
    var addSuffixToggle = toggleGrp.add("radiobutton", undefined, "Add Suffix");
    replaceToggle.value = true;

    var buttonGrp = w.add('group {alignment: "center"}');
    var updateLayerNamesBtn = buttonGrp.add('button', undefined, 'Update Layer Names');
    updateLayerNamesBtn.preferredSize = {width: 160,height: 40};
    updateLayerNamesBtn.onClick = function () {
        matches = matchesToggle.value;
        contains = containsToggle.value;
        begingsWith = begingsWithToggle.value;
        endsWith = endsWithToggle.value;
        replaceWith = replaceWithField.text;
        searchInput = searchInputField.text;

        replace = replaceToggle.value;
        replaceWhole = replaceWholeToggle.value;
        addPrefix = addPrefixToggle.value;
        addSuffix = addSuffixToggle.value;
        checkOpacity = opacityCheckBox.value;
        checkFillOpacity = fillOpacityCheckBox.value;
        selectMatching = selectMatchingCheckBox.value;
        ignoreCase = ignoreCaseCheckBox.value;
        useRegEx = useRegExCheckBox.value;
        global = globalCheckBox.value;
        updateSelected = updateSelectedToggle.value;
        updateMatching = updateMatchingToggle.value;
        matchingLayers = [];
        layersToUpdate = [];
        var isInvalid = false;

        if(updateMatching) {
            layerIDs = [];
            returnMatchingLayers(doc.layers)
            layersToUpdate = matchingLayers;
        }
        else {
            returnLayersToUpdate(doc.layers);
        }
        for (var i = 0; i < layersToUpdate.length; i++) {
            var tempVis = layersToUpdate[i].visible;
            if (!layersToUpdate[i].isBackgroundLayer) {
                if (searchInputField.text == "" && replaceToggle.value) {
                    isInvalid = true;
                    if (updateMatching) {
                        layerIDs.push(getLayerID());
                    }
                } else {
                    var indice = 0;
                    var text = replaceWithField.text;
                    if (text.match("%NN")) {
                        if (searchInputField.text == "") {
                            indice = layersToUpdate.length - i - 1;
                        } else {
                            indice = layersToUpdate.length - i;
                        }
                        if (indice < 10) {
                            indice = "0" + indice.toString();
                        }
                        text = text.replace(/%NN/g, indice);
                    }
                    indice = 0;
                    if (text.match("%nn")) {
                        indice = i + 1;
                        if (indice < 10) {
                            indice = "0" + indice.toString();
                        }
                        text = text.replace(/%nn/g, indice);
                    }
                    updateNames(layersToUpdate[i], text)
                    if (updateMatching) {
                        layerIDs.push(getLayerID());
                    }
                }
            }
            layersToUpdate[i].visible = tempVis;
        }
        if (isInvalid) {
            alert("Replace option not available with empty search.\nTry 'replace whole', 'add prefix' or 'add suffix' options instead.");
        }
        if (layerIDs.length !== 0 && selectMatching) {
            deselectAllLayers();
            selectLayersByID(layerIDs);
        }
        else if (layerIDs.length) {
            selectLayersByID(layerIDs);
        }
    }

    var UpdateOptionsGrp = w.add('group {alignment: "center"}');
    UpdateOptionsGrp.orientation = "row";
    var updateMatchingToggle = UpdateOptionsGrp.add("radiobutton", undefined, "Matching");
    updateMatchingToggle.value = true;
    var updateSelectedToggle = UpdateOptionsGrp.add("radiobutton", undefined, "Selected");

    var advancedSettingsGrp = w.add("panel", undefined, "Advanced Settings:");
    advancedSettingsGrp.orientation = "column";
    advancedSettingsGrp.alignChildren = "left";

    var blendModeGrp = advancedSettingsGrp.add("group", undefined, undefined);
    blendModeGrp.orientation = "row";
    blendModeGrp.alignChildren = "fill";
    blendModeGrp.add("statictext", undefined, "Blend Mode:");
    blendModeDropdown = blendModeGrp.add("dropdownlist", undefined, ["Any                                            ",
        "-", "Normal", "Dissolve", "-", "Darken", "Multiply", "Color Burn", "Linear Burn", "Darker Color", "-", "Lighten",
        "Screen", "Color Dodge", "Linear Dodge (Add)", "Lighter Color", "-", "Overlay", "Soft Light", "Hard Light",
        "Vivid Light", "Linear Light", "Pin Light", "Hard Mix", "-", "Difference", "Exclusion", "Subtract", "Divide", "-",
        "Hue", "Saturation", "Color", "Luminosity"
    ]);
    blendModeDropdown.selection = 0;

    var layerTypeGrp = advancedSettingsGrp.add("group", undefined, undefined);
    layerTypeGrp.orientation = "row";
    layerTypeGrp.alignChildren = "fill";
    layerTypeGrp.add("statictext", undefined, "Layer Type:");
    layerTypeDropdown = layerTypeGrp.add("dropdownlist", undefined, ["Any", "-", "Normal", "Text", "Group/Frame",
        "SmartObject", "-", "Solid", "Gradient", "Pattern", "-", "Any Non-Fill Adjustement Layer", "-",
        "Brightness/Contrast", "Levels", "Curves", "Exposure", "-", "Vibrance", "Hue/Saturation", "Color Balance",
        "Black & White", "Photo Filter", "Channel Mixer", "Color Lookup", "-", "Invert", "Posterize", "Threshold",
        "Gradient Map", "Selective Color"
    ]);
    layerTypeDropdown.selection = 0;

    var checkboxGrp = advancedSettingsGrp.add("group", undefined, undefined);
    checkboxGrp.orientation = "row";
    checkboxGrp.alignChildren = "left";
    var opacityCheckBox = checkboxGrp.add("checkbox", undefined, "Limit By Opacity");
    var fillOpacityCheckBox = checkboxGrp.add("checkbox", undefined, "Limit By Fill");

    var opacityGrp = advancedSettingsGrp.add("group", undefined, undefined);
    opacityGrp.orientation = "row";
    opacityGrp.alignChildren = "left";
    opacityGrp.add("statictext", undefined, "Opacity:");
    var minOpacityField = opacityGrp.add('edittext {text: 0, characters: 3, justify: "left", active: true}');
    minOpacityField.onChange = function () {
        minOpacity = parseInt(minOpacityField.text);
        if (isNaN(minOpacity) || minOpacity < 0) {
            minOpacityField.text = 0;
            minOpacity = 0;
        } else if (isNaN(minOpacity) || minOpacity >= 100) {
            minOpacityField.text = 100;
            minOpacity = 100;
        }
    }
    minOpacityField.characters = 4;
    opacityGrp.add("statictext", undefined, ":");
    var maxOpacityField = opacityGrp.add('edittext {text: 100, characters: 3, justify: "left", active: true}');
    maxOpacityField.onChange = function () {
        maxOpacity = parseInt(maxOpacityField.text);
        if (isNaN(maxOpacity) || maxOpacity < 0) {
            maxOpacityField.text = 0;
            maxOpacity = 0;
        } else if (isNaN(maxOpacity) || maxOpacity >= 100) {
            maxOpacityField.text = 100;
            maxOpacity = 100;
        }
    }
    maxOpacityField.characters = 4;

    var fillGrp = advancedSettingsGrp.add("group", undefined, undefined);
    fillGrp.orientation = "row";
    fillGrp.align = "fill";
    fillGrp.add("statictext", undefined, "Fill:         ");
    var minFillOpacityField = fillGrp.add('edittext {text: 0, characters: 3, justify: "left", active: true}');
    minFillOpacityField.onChange = function () {
        minFillOpacity = parseInt(minFillOpacityField.text);
        if (isNaN(minFillOpacity) || minFillOpacity < 0) {
            minFillOpacityField.text = 0;
            minFillOpacity = 0;
        } else if (isNaN(minFillOpacity) || minFillOpacity >= 100) {
            minFillOpacityField.text = 100;
            minFillOpacity = 100;
        }
    }
    minFillOpacityField.characters = 4;
    fillGrp.add("statictext", undefined, ":");
    var maxFillOpacityField = fillGrp.add('edittext {text: 100, characters: 3, justify: "left", active: true}');
    maxFillOpacityField.onChange = function () {
        maxFillOpacity = parseInt(maxFillOpacityField.text);
        if (isNaN(maxFillOpacity) || maxFillOpacity < 0) {
            maxFillOpacityField.text = 0;
            maxFillOpacity = 0;
        } else if (isNaN(maxFillOpacity) || maxFillOpacity >= 100) {
            maxFillOpacityField.text = 100;
            maxFillOpacity = 100;
        }
    }
    maxFillOpacityField.characters = 4;

    var regGrp = advancedSettingsGrp.add("group", undefined, undefined);
    regGrp.orientation = "row";
    regGrp.align = "fill";
    var ignoreCaseCheckBox = regGrp.add("checkbox", undefined, "Ignore Case");
    var useRegExCheckBox = regGrp.add("checkbox", undefined, "Use RegEx");
    var globalCheckBox = regGrp.add("checkbox", undefined, "Global");
    globalCheckBox.value = true;
    searchInputField.active = true;

    var selectionSettingsGrp = w.add("panel", undefined, "Selection Settings:");
    selectionSettingsGrp.orientation = "column";
    selectionSettingsGrp.alignChildren = "left";

    var selectionGrp1 = selectionSettingsGrp.add("group", undefined, undefined);
    selectionGrp1.orientation = "row";
    selectionGrp1.align = "fill";

    var selectMatchingBtn = selectionGrp1.add('button', undefined, 'Select Matching');
    selectMatchingBtn.onClick = function () {
        matches = matchesToggle.value;
        contains = containsToggle.value;
        begingsWith = begingsWithToggle.value;
        endsWith = endsWithToggle.value;
        replaceWith = replaceWithField.text;
        searchInput = searchInputField.text;

        replace = replaceToggle.value;
        replaceWhole = replaceWholeToggle.value;
        addPrefix = addPrefixToggle.value;
        addSuffix = addSuffixToggle.value;
        checkOpacity = opacityCheckBox.value;
        checkFillOpacity = fillOpacityCheckBox.value;
        selectMatching = selectMatchingCheckBox.value;
        ignoreCase = ignoreCaseCheckBox.value;
        useRegEx = useRegExCheckBox.value;
        global = globalCheckBox.value;
        newSelection = newSelectioToggle.value;
        removeFromSelection = removeFromSelectionToggle.value;
        matchingLayers = [];
        var layerIDsToRemove = [];
        var layerIDsToSelect = [];
        if(newSelection) {
            layerIDs = [];
        }
        returnMatchingLayers(doc.layers);

        for (var i = 0; i < matchingLayers.length; i++) {
            doc.activeLayer = matchingLayers[i];
            if(removeFromSelection) {
                layerIDsToRemove.push(getLayerID());    
            }
            else {
                layerIDs.push(getLayerID());
            }
        }

        if(removeFromSelection) {
            layerIDsToSelect = []
            var keep = true;
            for(var i = 0; i < layerIDs.length; i++) {
                for(var j = 0; j < layerIDsToRemove.length; j++) {
                    if(layerIDs[i] === layerIDsToRemove[j]) {
                        keep = false;
                    }
                }
                if(keep) {
                    layerIDsToSelect.push(layerIDs[i])
                }
                keep = true;
            }
            layerIDs = layerIDsToSelect;
        }
        if(layerIDs.length !== 0) {
            deselectAllLayers();
            selectLayersByID(layerIDs);
        }
    }

    var selectMatchingCheckBox = selectionGrp1.add("checkbox", undefined, "Select When Renaming");
    var selectionGrp = selectionSettingsGrp.add("group", undefined, undefined);
    selectionGrp.orientation = "row";
    selectionGrp.align = "fill";
    var newSelectioToggle = selectionGrp.add("radiobutton", undefined, "New Selection");
    newSelectioToggle.value =  true;
    var addToSelectionToggle = selectionGrp.add("radiobutton", undefined, "Add To Selection");
    var removeFromSelectionToggle = selectionGrp.add("radiobutton", undefined, "Remove From Selection");

    var showWin = w.show();
}

function returnMatchingLayers(layers) {

    for (var i = 0; i < layers.length; i++) {
        if (layers[i].typename === "LayerSet") {
            returnMatchingLayers(layers[i].layers);
            matchLayers(matchingLayers, layers[i], searchInput);
        } else {
            matchLayers(matchingLayers, layers[i], searchInput);
        }
    }
}

function matchLayers(array, layer, search) {

    var layerName = layer.name;
    var escapedSearch = escapeRegExp(search);
    if (ignoreCase) {
        escapedSearch = escapedSearch.toLowerCase();
        layerName = layerName.toLowerCase();
    }
    if (matchAdvancedOptions(layer)) {
        if (matches) {
            if (layerName === search || search === "") {
                array.push(layer);
                return
            }
        } else if (contains) {
            if (useRegEx) {
                var regExSearch = new RegExp(search, "g")
                if (layerName.match(regExSearch)) {
                    array.push(layer);
                    return
                }
            } else if (layerName.match(escapedSearch)) {
                array.push(layer);
                return
            }
        }

        if (begingsWith) {
            if (layerName.startsWith(search)) {
                array.push(layer);
                return
            }
        } else if (endsWith) {
            if (layerName.endsWith(search)) {
                array.push(layer);
                return
            }
        }
    }
}

function returnLayersToUpdate(layers) {
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].typename === "LayerSet") {
            returnLayersToUpdate(layers[i].layers);
            matchID(layers[i]);
        } else {
            matchID(layers[i]);
        }
    }
}

function matchID(layer) {
    for(var i = 0; i < layerIDs.length; i++ ) {
        if (layer.id === layerIDs[i]) {
            layersToUpdate.push(layer);
        }
    }
}

function matchAdvancedOptions(layer) {

    if (checkOpacity) {
        if (matchOpacity(layer.opacity, minOpacity, maxOpacity)) {
            return false;
        }
    }
    if (checkFillOpacity) {
        if (matchOpacity(layer.fillOpacity, minFillOpacity, maxFillOpacity)) {
            return false;
        }
    }
    if (layer.blendMode !== layerBlendModes[blendModeDropdown.selection.text]) {
        if (blendModeDropdown.selection.text !== "Any                                            ") {
            return false;
        }
    }
    if ( layer.kind === layerTypes[layerTypeDropdown.selection.text])
    {
        if (!(layer instanceof LayerSet)) {
            return true;
        }
    }
    if(layerTypeDropdown.selection.text === "Group/Frame")
    {
        if (layer instanceof LayerSet) {
            return true;
        }
        else {
            return false;
        }
    }
    if (layerTypeDropdown.selection.text === "Any") {

        return true;

    }
    if (layerTypeDropdown.selection.text === "Any Non-Fill Adjustement Layer") {
        for (var i = 0; i < adjustmentLayers.length; i++) {
            if (layer.kind === adjustmentLayers[i]) {
                return  true;
            }
        }
        return false;
    }
    return false;
}

function matchOpacity(opacity, min, max) {

    if ((Math.round(opacity) >= min) && (Math.round(opacity) <= max)) {
        return false;
    } else {
        return true;
    }
}

function updateNames(layer, newLayerName) {

    var layerName = layer.name;
    if (replace) {
        var str = layerName;
        var array = [];
        var regExString;
        var replacestr = newLayerName;
        var newstr = "";
        if (ignoreCase && !useRegEx) { 
            var escapedSearchInput = escapeRegExp(searchInput);
            if(global) {
                flag = "ig";
            }
            else {
                flag = "i";
            }
            regExString = new RegExp(escapedSearchInput, flag);
            newstr = layerName.replace(regExString, newLayerName);
        }
        else if((ignoreCase && useRegEx) || useRegEx) {
            if(global) {
                flag = "ig";
            }
            else if (ignoreCase) {
                flag = "i";
            }
            else {
                flag = "";
            }
            regExString = new RegExp(searchInput, flag);
            newstr = layerName.replace(regExString, newLayerName);
        } else {
            var escapedSearchInput = escapeRegExp(searchInput);
            if(global) {
                flag = "g";
            }
            else {
                flag = "";
            }
            regExString = new RegExp(escapedSearchInput, flag);
            newstr = layerName.replace(regExString, newLayerName);
        }
        layer.name = newstr;

    } else if (replaceWhole) {
        if(replaceWith !== "") {
            layer.name = newLayerName;
        }
    }

    if (addPrefix) {
        layer.name = newLayerName.concat(layerName);
    } else if (addSuffix) {
        layer.name = layerName.concat(newLayerName);
    }
}

function deselectAllLayers() {
    var idselectNoLayers = stringIDToTypeID("selectNoLayers");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref.putEnumerated(idLyr, idOrdn, idTrgt);
    desc.putReference(idnull, ref);
    executeAction(idselectNoLayers, desc, DialogModes.NO);
}

function getLayerID() {
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    return executeActionGet(ref).getInteger(stringIDToTypeID("layerID"));
};

function getLayerIDByIndex(idx) {   
    var ref = new ActionReference();   
    ref.putProperty( charIDToTypeID("Prpr") , stringIDToTypeID( "layerID"));   
    ref.putIndex( charIDToTypeID( "Lyr " ), idx );  
    return executeActionGet(ref).getInteger(stringIDToTypeID( "layerID"));;   
};  

function selectLayersByID(array) {
    var idslct = charIDToTypeID("slct");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putIdentifier(idLyr, array[0]);
    desc.putReference(idnull, ref);
    var idselectionModifier = stringIDToTypeID("selectionModifier");
    var idselectionModifierType = stringIDToTypeID("selectionModifierType");
    var idaddToSelection = stringIDToTypeID("addToSelection");
    desc.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelection);
    var idMkVs = charIDToTypeID("MkVs");
    desc.putBoolean(idMkVs, false);
    var idLyrI = charIDToTypeID("LyrI");
    var list = new ActionList();
    for (var i = 0; i < array.length; i++) {
        selectLayerByID(array[i]);
        var layerID = getLayerID();
        list.putInteger(layerID);
    }
    desc.putList(idLyrI, list);
    executeAction(idslct, desc, DialogModes.NO);
}

function selectLayerByID(layerID) {
    var idslct = charIDToTypeID("slct");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    ref.putIdentifier(idLyr, layerID);
    desc.putReference(idnull, ref);
    var idselectionModifier = stringIDToTypeID("selectionModifier");
    var idselectionModifierType = stringIDToTypeID("selectionModifierType");
    var idaddToSelection = stringIDToTypeID("addToSelection");
    desc.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelection);
    var idMkVs = charIDToTypeID("MkVs");
    desc.putBoolean(idMkVs, false);
    executeAction(idslct, desc, DialogModes.NO)
}

function GetSelectedLayersIDs()
{
    var selectedLayers = new Array;
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') );
    var desc = executeActionGet(ref);
    if (desc.hasKey(stringIDToTypeID('targetLayers')))
    {
        desc = desc.getList(stringIDToTypeID('targetLayers'));
        var c = desc.count 
        var selectedLayers = new Array();
        for(var i = 0; i < c; ++i)
        {
            selectedLayers.push(desc.getReference(i).getIndex());
        }
    }
    else
    {
        var ref = new ActionReference(); 
        ref.putProperty(charIDToTypeID('Prpr'), charIDToTypeID('ItmI')); 
        ref.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID('ItmI')));
    }
    return selectedLayers;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}