var _folder = "C:/Users/userName/Desktop/Textures"; // Path to the root folder of textures in a project
var _isResizedByPrefix = false; // Set to true to resize image on export based on export target name and resize rules
var _saveInRoot = false; // Always save the root folder if subfolder is not found

var _resizeRules = {
    64:  ["Icon_"],
    128: ["Prop_"],
    256: ["Weapon_", "Animal_", "Env_"],
    512: ["Vehicle_", "Character_"]
}

var doc;
var targetName;
var _subFolders = [];


QuickExport();

function QuickExport() {
    if (app.documents.length <= 0) {
        alert("No active document!");
        return;
    }
    var f = new Folder(_folder);
    if (!f.exists) {
        alert(_folder + " is not a valid directory");
        return;
    }
    doc = app.activeDocument;

    // Uses the active layer name as the target if no layer is selected uses the top layer
    // If preferrable to always use top layer name or bottom layer name as export target name use:
    // targetName = doc.layers[0].name; // top layer
    // targetName = doc.layers[doc.layers.length - 1].name; // bottom layer
    targetName = doc.activeLayer.name;
    var savedState = doc.activeHistoryState;
    var _wasSaved = false;

    _subFolders = GetSubFolders(f);

    if (_subFolders.length != 0) {
        for (var i = 0; i < _subFolders.length; i++) {
            if (targetName.match("^" + _subFolders[i].name)) {
                var savePath = _folder + "/" + _subFolders[i].name + "/" + targetName + ".png";
                var saveFile = new File(savePath);

                if (_isResizedByPrefix) {
                    _isResizedByPrefix = ResizeByPrefix(_resizeRules, targetName);
                }
                SaveAsPNG(saveFile);
                _wasSaved = true;
            }
        }
    }
    if (!_wasSaved) {
        var answer = true;
        if(!_saveInRoot)
        {
            answer = confirm("Correct subfolder for " + targetName + " not found at " + _folder + "\nDo you want to save to the root folder?");  
        }
        if (answer) {
            var savePath = _folder + "/" + targetName + ".png";
            var saveFile = new File(savePath);

            if (_isResizedByPrefix) {
                _isResizedByPrefix = ResizeByPrefix(_resizeRules, targetName);
            }
            SaveAsPNG(saveFile);
        }
    }
    if(_isResizedByPrefix)
    {
        doc.activeHistoryState = savedState;
    }
}

// Resizes based on the _resizeRules object matching the start of the layer name
function ResizeByPrefix(resizeRules, layerName) {
    for (var size in resizeRules) {
        var names = resizeRules[size];
        for (var i = 0; i < names.length; i++) {
            if (layerName.match("^" + names[i])) {
                DoResize(size, size)
                return true;
            }
        }
    }
    return false;
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

function GetSubFolders(folder) {
    var filesInFolder = folder.getFiles();
    var subFolders = [];

    for (var i = 0; i < filesInFolder.length; i++) {
        var currentFile = filesInFolder[i];
        if (currentFile instanceof Folder) {
            subFolders.push(currentFile);
            GetSubFolders(currentFile);
        }
    }
    return subFolders;
}