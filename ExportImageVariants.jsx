/*
<javascriptresource>
<name>Export Images Variants</name>
<category>BatchOperations</category>
</javascriptresource>
*/

// minified JSON2
if(typeof JSON!=="object"){JSON={}}(function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){escapable.lastIndex=0;return escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t==="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];if(a&&typeof a==="object"&&typeof a.toJSON==="function"){a=a.toJSON(e)}if(typeof rep==="function"){a=rep.call(t,e,a)}switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a){return"null"}gap+=indent;u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1){u[n]=str(n,a)||"null"}i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]";gap=o;return i}if(rep&&typeof rep==="object"){s=rep.length;for(n=0;n<s;n+=1){if(typeof rep[n]==="string"){r=rep[n];i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}else{for(r in a){if(Object.prototype.hasOwnProperty.call(a,r)){i=str(r,a);if(i){u.push(quote(r)+(gap?": ":":")+i)}}}}i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}";gap=o;return i}}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var cx,escapable,gap,indent,meta,rep;if(typeof JSON.stringify!=="function"){escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};JSON.stringify=function(e,t,n){var r;gap="";indent="";if(typeof n==="number"){for(r=0;r<n;r+=1){indent+=" "}}else if(typeof n==="string"){indent=n}rep=t;if(t&&typeof t!=="function"&&(typeof t!=="object"||typeof t.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":e})}}if(typeof JSON.parse!=="function"){cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i==="object"){for(n in i){if(Object.prototype.hasOwnProperty.call(i,n)){r=walk(i,n);if(r!==undefined){i[n]=r}else{delete i[n]}}}}return reviver.call(e,t,i)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})()


// endsWith method for strings
String.prototype.endsWith = function (str) {
    return this.substring(this.length - str.length, this.length) === str;
}
// trim method for strings
String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}
// includes method for strings
String.prototype.includes = function(search, start) {
    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    } 
    if (start === undefined) { start = 0; }
    return this.indexOf(search, start) !== -1;
}

const eIVSourceImageFolder = app.stringIDToTypeID("eIVImageSourceFolder");
const eIVExportFolder = app.stringIDToTypeID("eIVExportFolder");
const eIVFile = app.stringIDToTypeID("eIVFile");
const eIVCustomFileName = app.stringIDToTypeID("eIVCustomFileName");
const eIVUseSaveAll = app.stringIDToTypeID("eIVUseSaveAll");
const eIVUseImageFolder = app.stringIDToTypeID("eIVUseImageFolder");
const eIVUseCustomFileName = app.stringIDToTypeID("eIVUseCustomFileName");
const eIVInput = "eIVInput";

var doc;
var jsonObject = null;
var layersToRename = [];
var originalLayerNames = [];
var invalidImageLinks = [];
var invalidHexColors = [];
var folder;
var imageFolder;
var file;
var customFileName;
var savedState;
var useImageFolder = false;
var useCustomFileName = false;
var useSaveAll = true;
var isValid = true;

if (app.documents.length <= 0) {
    alert("No active document!");
} else {
    doc = app.activeDocument;
    doc.suspendHistory("Export Images Variants", "ShowUI();");
}

function ShowUI() {
    var w = new Window("dialog", "Export Image Variants", undefined, {
        closeButton: true
    });
    w.alignChildren = "fill";
    w.orientation = "column";

    w.add("statictext", undefined, "Variant Description File:");

    var g1 = w.add("group", undefined, undefined);
    g1.orientation = "row";
    var fileLocBox = g1.add("edittext", undefined, "Selected File Location");
    fileLocBox.size = [350, 20];
    var getFileBtn = g1.add("button", undefined, "File");
    getFileBtn.helpTip = "Select variant description JSON file";
    getFileBtn.size = [50, 20];

    w.add("statictext", undefined, "Export Location:");

    var g2 = w.add("group", undefined, undefined);
    g2.orientation = "row";
    var folderLocBox = g2.add("edittext", undefined, "Selected Export Folder");
    folderLocBox.size = [350, 20];
    var getFolderBtn = g2.add("button", undefined, "Folder");
    getFolderBtn.size = [50, 20];
    getFolderBtn.helpTip = "Select destination folder for exported images";

    var useSaveAllCheckBox = w.add("checkbox", undefined, "Save All");
    useSaveAllCheckBox.value = useSaveAll;
    useSaveAllCheckBox.helpTip = "Save all variant images even if they contain invalid image links or hex codes";

    var useImageFolderCheckBox = w.add("checkbox", undefined, "Use Source Image Folder");

    var g3 = w.add("group", undefined, undefined);
    g3.orientation = "row";
    var imageFolderLocBox = g3.add("edittext", undefined, "Selected Source Image Folder");
    imageFolderLocBox.size = [350, 20];
    var getImageFolderBtn = g3.add("button", undefined, "Folder");
    getImageFolderBtn.helpTip = "Select source image folder";
    getImageFolderBtn.size = [50, 20];
    g3.enabled = false;

    var useCustomFileNameCheckBox = w.add("checkbox", undefined, "Use Custom File Name");
    useCustomFileNameCheckBox.helpTip = "Create custom file name for exported images \n\nKeywords: \nActive Document: [Document] \nVariant Name: [Variant] \nRunning Number: [Increment] \nDate: [YYYY] [YY] [MM] [DD] [HR] [MIN] \n\nIf neither [Variant] nor [Increment] are used the file names are not unique and will save over each other\n ";

    var g4 = w.add("group", undefined, undefined);
    g4.orientation = "row";
    var customFileNameLocBox = g4.add("edittext", undefined, "[Document]_[Variant]_[YY][MM][DD][HR][MIN]");
    customFileNameLocBox.size = [350, 20];
    g4.enabled = false;

    var ExportBtn = w.add("button", undefined, "Export Image Variants");
    ExportBtn.size = {
        width: 160,
        height: 50
    }
    ExportBtn.graphics.font = "dialog:12";

    getFileBtn.onClick = function () {
        file = File.openDialog("Select variant description file", "Supported formats:*.json", false);
        fileLocBox.text = file.fsName;
    }
    getFolderBtn.onClick = function () {
        folder = Folder.selectDialog("Select Export Folder");
        folderLocBox.text = folder.fsName;
    }
    getImageFolderBtn.onClick = function () {
        imageFolder = Folder.selectDialog("Select Source Image Folder");
        imageFolderLocBox.text = imageFolder.fsName;
    }
    useSaveAllCheckBox.onClick = function () {
        if (useSaveAllCheckBox.value) {
            useSaveAll = true;
        } else {
            useSaveAll = false;
        }
    }
    useImageFolderCheckBox.onClick = function () {
        if (useImageFolderCheckBox.value) {
            g3.enabled = true;
            useImageFolder = true;
        } else {
            g3.enabled = false;
            useImageFolder = false;
        }
    }
    useCustomFileNameCheckBox.onClick = function () {
        if (useCustomFileNameCheckBox.value) {
            g4.enabled = true;
            useCustomFileName = true;
        } else {
            g4.enabled = false;
            useCustomFileName = false;
        }
    }
    customFileNameLocBox.onChange = function () {
        if(!(customFileNameLocBox.text.includes("[Variant]") || customFileNameLocBox.text.includes("[Increment]"))) {
            alert("Custom file name must include either [Variant] or [Increment] keyword otherwise variant file names won't be unique")
            customFileNameLocBox.active = true;
        }
        customFileName = customFileNameLocBox.text;
    }


    ExportBtn.onClick = function () {
        folder = new Folder(Folder.encode(folderLocBox.text));
        imageFolder = new Folder(Folder.encode(imageFolderLocBox.text));
        file = new File(File.encode(fileLocBox.text));
        if (!folder.exists) {
            alert("Selected export folder is not valid")
        } else if (useImageFolder && !imageFolder.exists) {
            alert("Selected source image folder is not valid")
        } else if (!file.exists || !file.fsName.endsWith(".json")) {
            alert("Selected file is not valid")
        } else {
            CreateAndExportVariants(file);
        }
        invalidImageLinks = [];
        invalidHexColors = [];
    }
    w.center();
    w.onShow = function () {
        try {
            var savedInput = getSavedInput(eIVInput);
            fileLocBox.text = savedInput.File == undefined ? fileLocBox.text : savedInput.File;
            folderLocBox.text = savedInput.Folder == undefined ? folderLocBox.text : savedInput.Folder;
            imageFolderLocBox.text = savedInput.SourceImageFolder == undefined ? imageFolderLocBox.text : savedInput.SourceImageFolder;
            customFileNameLocBox.text = savedInput.CustomFileName == undefined ?  customFileNameLocBox.text : savedInput.CustomFileName;
            
            useSaveAllCheckBox.value = savedInput.UseSaveAll == undefined ? useSaveAllCheckBox.value : savedInput.UseSaveAll;
            useSaveAll = savedInput.UseSaveAll== undefined ? useSaveAll : savedInput.UseSaveAll;
            
            useImageFolderCheckBox.value = savedInput.UseImageFolder == undefined ? useImageFolderCheckBox.value : savedInput.UseImageFolder;
            useImageFolder = savedInput.UseImageFolder == undefined ? useImageFolder : savedInput.UseImageFolder;
            g3.enabled = savedInput.UseImageFolder == undefined ? g3.enabled : savedInput.UseImageFolder;
            
            useCustomFileNameCheckBox.value = savedInput.UseCustomFileName == undefined ? useCustomFileNameCheckBox.value : savedInput.UseCustomFileName;
            useCustomFileName = savedInput.UseCustomFileName == undefined ? useCustomFileName : savedInput.UseCustomFileName;
            g4.enabled = savedInput.UseCustomFileName == undefined ? g4.enabled : savedInput.UseCustomFileName;
            
            eraseCustomOptions(eIVInput);
        } catch (e) {}
    }
    w.onClose = function () {
        saveInput(fileLocBox.text, folderLocBox.text, imageFolderLocBox.text, customFileNameLocBox.text, useSaveAllCheckBox.value, useImageFolderCheckBox.value ,useCustomFileNameCheckBox.value);
    }
    w.show();
}

var getKeysWithoutObjectKeysSupport = function (associativeArrayObject) {
    var arrayWithKeys = [],
        associativeArrayObject;
    for (key in associativeArrayObject) {
        if (key !== undefined && key !== "toJSONString" && key !== "parseJSON") {
            arrayWithKeys.push(key);
        }
    }
    return arrayWithKeys;
}

function CreateAndExportVariants(file) {
    var exportedFiles = [];
    try {
        if (file.open('r')) {
            var content = file.read();
            jsonObject = JSON.parse(content);
            file.close();
        }
    } catch (e) {
        alert("Selected file is not valid");
        return;
    }
    savedState = doc.activeHistoryState;
    var i = 1;
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            UpdateDocumentContents(doc.layers, key);
            if(useSaveAll || isValid)
            {
                var now = new Date();
                var path = doc.name.split(".")[0] + "_" + key + "_" + GetTimeStamp() + ".png";
                if(useCustomFileName) {
                    path = customFileName;
                    path = path.replace("[Document]",doc.name.split(".")[0]);
                    path = path.replace("[Variant]", key);
                    path = path.replace("[Increment]", AddPadding(i,3));
                    path = path.replace("[YYYY]", now.getFullYear().toString());
                    path = path.replace("[YY]", now.getFullYear().toString().slice(-2));
                    path = path.replace("[MM]", AddPadding(now.getMonth() + 1, 2));
                    path = path.replace("[DD]", AddPadding(now.getDate(), 2));
                    path = path.replace("[HR]", AddPadding(now.getHours(), 2));
                    path = path.replace("[MIN]", AddPadding(now.getMinutes(), 2));
                }
                var savePath = folder + "/" + path;
                var saveFile = new File(savePath);
                SaveAsPNG(saveFile)
                exportedFiles.push(doc.name + "_" + key + "_" + GetTimeStamp() + ".png");
                i ++;
            }
            isValid = true;
            doc.activeHistoryState = savedState;
        }
    }
    doc.activeHistoryState = savedState;
    alert(exportedFiles.length + " files exported");
    var message = "";
    if (invalidImageLinks.length > 0) {
        for (var i = 0; i < invalidImageLinks.length; i++) {
            message += invalidImageLinks[i] + "\n\n";
        }
        alert(invalidImageLinks.length + " invalid image links. \n\n" + message);
    }
    if (invalidHexColors.length > 0) {
        message = "";
        for (var i = 0; i < invalidHexColors.length; i++) {
            message += invalidHexColors[i] + "\n\n";
        }
        alert(invalidHexColors.length + " invalid hex colors. \n\n" + message);
    }
}

function UpdateDocumentContents(layers, key) {
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].typename === "LayerSet") {
            UpdateDocumentContents(layers[i].layers);
        } else if (layers[i].kind == LayerKind.TEXT && layers[i].visible) {
            if (layers[i].name in jsonObject[key]) {
                if (jsonObject[key][layers[i].name] !== null) {
                    layers[i].textItem.contents = jsonObject[key][layers[i].name];
                }
            }
        } else if (layers[i].kind == LayerKind.SMARTOBJECT && layers[i].visible) {
            if (layers[i].name in jsonObject[key]) {
                if (jsonObject[key][layers[i].name] !== null) {
                    var path = jsonObject[key][layers[i].name];
                    if (useImageFolder) {
                        path = imageFolder.fsName;
                        if (!path.endsWith("\\")) {
                            path = path + "\\";
                        }
                        path = path + jsonObject[key][layers[i].name];
                    }
                    doc.activeLayer = layers[i];
                    var f = new File(path)
                    if (f.exists) {
                        ReplaceLinkedImage(path, true, doc.activeLayer);
                    } else {
                        isValid = false;
                        invalidImageLinks.push("Variant: " + key + "\nLayer Name: " + layers[i].name + "\nLink: " + jsonObject[key][layers[i].name]);
                    }
                } else {
                    isValid = false;
                    invalidImageLinks.push("Variant: " + key + "\nLayer Name: " + layers[i].name + "\nLink: undefined");
                }
            }
        } else if (layers[i].kind == LayerKind.SOLIDFILL && layers[i].visible) {
            if (layers[i].name in jsonObject[key]) {
                if (jsonObject[key][layers[i].name] !== null) {
                    var color = new SolidColor();
                    var hex = jsonObject[key][layers[i].name].trim();
                    if(hex.charAt(0) === "#") {
                        hex =   hex.substring(1)
                    }
                    if(hex.length === 6 && isHex(hex)) {
                        color.rgb.hexValue = hex;
                        doc.activeLayer = layers[i];
                        SetSolidFillColor(color);
                    }
                    else {
                        isValid = false;
                        invalidHexColors.push("Variant: " + key + "\nLayer Name: " + layers[i].name + "\nInvalid Hex: " + jsonObject[key][layers[i].name]);
                    } 
                }
            }
        }
    }
}

function isHex(str) {
    var letters = /^[0-9a-fA-f]+$/;
    if (str.match(letters)) {
        return true;
    }
}

function SetTextLayerContent(textLayer) {
    if (textLayer.name in jsonObject) {
        if (jsonObject[textLayer.name] !== null) {
            textLayer.textItem.contents = jsonObject[textLayer.name];
        }
    }
}

function ReplaceLinkedImage(path, forceSize, layer) {
    var width;
    var height;
    if (forceSize) {
        var size = GetLayerSize(layer);
        width = size[0];
        height = size[1];
    }
    var idplacedLayerRelinkToFile = stringIDToTypeID("placedLayerRelinkToFile");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    desc.putPath(idnull, new File(path));
    executeAction(idplacedLayerRelinkToFile, desc, DialogModes.NO);
    if (forceSize) {
        ResizeLayer(layer, width, height)
    }
}

function GetLayerSize(layer) {
    var startRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    var bounds = layer.bounds;
    var width = bounds[2].value - bounds[0].value;
    var height = bounds[3].value - bounds[1].value;
    app.preferences.rulerUnits = startRulerUnits;
    return [width, height];
}

function ResizeLayer(layer, newWidth, newHeight) {
    var startRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    var bounds = layer.bounds;
    var width = bounds[2].value - bounds[0].value;
    var height = bounds[3].value - bounds[1].value;
    width = (100 / width) * newWidth;
    height = (100 / height) * newHeight;
    activeDocument.activeLayer.resize(width, height, AnchorPosition.MIDDLECENTER);
    app.preferences.rulerUnits = startRulerUnits;
}

function DoResize(width, height) {
    var userUnits = preferences.rulerUnits;
    if (preferences.rulerUnits != Units.PIXELS) {
        preferences.rulerUnits = Units.PIXELS;
    }
    doc.resizeImage(UnitValue(width, "px"), UnitValue(height, "px"), 72, ResampleMethod.AUTOMATIC, 0);
    preferences.rulerUnits = userUnits;
}

function SaveAsPNG(saveFile) {
    var saveOptions = new PNGSaveOptions;
    saveOptions.compression = 9;
    saveOptions.interlaced = false;
    activeDocument.saveAs(saveFile, saveOptions, true, Extension.LOWERCASE);
}

function GetTimeStamp() {
    var now = new Date();
    return (now.getFullYear().toString().slice(-2)) +
        AddPadding(now.getMonth() + 1, 2) +
        AddPadding(now.getDate(), 2) +
        AddPadding(now.getHours(), 2) +
        AddPadding(now.getMinutes(), 2);
}

function AddPadding(value, digits) {
    var paddedString = String(value);
    while (digits > paddedString.length) {
        paddedString = '0' + paddedString;
    }
    return paddedString;
}

function SetSolidFillColor(color) {
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
    desc3.putDouble(idRd, color.rgb.red);
    var idGrn = charIDToTypeID("Grn ");
    desc3.putDouble(idGrn, color.rgb.green);
    var idBl = charIDToTypeID("Bl  ");
    desc3.putDouble(idBl, color.rgb.blue);
    var idRGBC = charIDToTypeID("RGBC");
    desc2.putObject(idClr, idRGBC, desc3);
    var idsolidColorLayer = stringIDToTypeID("solidColorLayer");
    desc1.putObject(idT, idsolidColorLayer, desc2);
    executeAction(idsetd, desc1, DialogModes.NO);
}

function saveInput(file, folder, sourceImageFolder, customFileName, useSaveAll, useImageFolder, useCustomFileName) {
    var desc = new ActionDescriptor();
    desc.putString(eIVSourceImageFolder, sourceImageFolder);
    desc.putString(eIVExportFolder, folder);
    desc.putString(eIVFile, file);
    desc.putString(eIVCustomFileName, customFileName);
    desc.putBoolean(eIVUseSaveAll, useSaveAll);
    desc.putBoolean(eIVUseImageFolder, useImageFolder);
    desc.putBoolean(eIVUseCustomFileName, useCustomFileName);

    app.putCustomOptions(eIVInput, desc, false);
}

function getSavedInput() {
    var desc = app.getCustomOptions(eIVInput);
    return {SourceImageFolder:desc.getString(eIVSourceImageFolder),
            Folder:desc.getString(eIVExportFolder),
            File: desc.getString(eIVFile),
            CustomFileName: desc.getString(eIVCustomFileName),
            UseSaveAll: desc.getBoolean(eIVUseSaveAll),
            UseImageFolder: desc.getBoolean(eIVUseImageFolder),
            UseCustomFileName: desc.getBoolean(eIVUseCustomFileName)
            }
}