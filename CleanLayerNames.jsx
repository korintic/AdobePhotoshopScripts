// This script renames the selected layers by their blend mode
var doc;

// Set layer color in the layer stack by the blend mode or layer type
// If both are set to true layer type color overwrites the blend mode color
var setLayerColorsByBlendMode = true;
var setLayerColorByLayerType = true;

// Set to "true" to ignore these layer types when renaming
var ignoreAdjustementLayers = true;
var ignoreTextLayers = true;
var ignoreShapeFillAndPatternLayers = false;
var ignoreSmartObjects = false;
var ignoreGrps = true;

// Add opacity or fill amount as a suffix to layer name
// If both are set to "true" "O:" and "F:" are added in front of the percentage
var addOpacityAmount = true;
var addFillAmount = false;

var adjustmentLayer = {
    "BRIGHTNESSCONTRAST": LayerKind.BRIGHTNESSCONTRAST,
    "LEVELS": LayerKind.LEVELS,
    "CURVES": LayerKind.CURVES,
    "EXPOSURE": LayerKind.EXPOSURE,
    "VIBRANCE": LayerKind.VIBRANCE,
    "HUESATURATION": LayerKind.HUESATURATION,
    "COLORBALANCE": LayerKind.COLORBALANCE,
    "BLACKANDWHITE": LayerKind.BLACKANDWHITE,
    "PHOTOFILTER": LayerKind.PHOTOFILTER,
    "CHANNELMIXER": LayerKind.CHANNELMIXER,
    "COLORLOOKUP": LayerKind.COLORLOOKUP,
    "INVERSION": LayerKind.INVERSION,
    "POSTERIZE": LayerKind.POSTERIZE,
    "THRESHOLD": LayerKind.THRESHOLD,
    "GRADIENTMAP": LayerKind.GRADIENTMAP,
    "SELECTIVECOLOR": LayerKind.SELECTIVECOLOR
}

var shapeFillAndPatternLayer = {
    "SOLIDFILL": LayerKind.SOLIDFILL,
    "GRADIENTFILL": LayerKind.GRADIENTFILL,
    "PATTERNFILL": LayerKind.PATTERNFILL,
}

if (app.documents.length <= 0) {
    alert("No active document!");
} else {
    doc = app.activeDocument;
    doc.suspendHistory("Clean Layer Names", "CleanLayerNames();");
}

function CleanLayerNames() {
    var selectedLayersIndices = getSelectedLayersIndices();
    for (var i = 0; i < selectedLayersIndices.length; i++) {
        selectLayerByIndex(selectedLayersIndices[i], false);
        if(!doc.activeLayer.isBackgroundLayer) {
            if(doc.activeLayer.typename === "LayerSet" && ignoreGrps) {
                continue;
            }
            if(setLayerColorsByBlendMode) {
                SetLayerColorToBlendMode(doc.activeLayer.blendMode.toString().split(".")[1]);
            }
            if(setLayerColorByLayerType) {
                SetLayerColorByLayerType(doc.activeLayer.kind.toString().split(".")[1])
            }
            var blendMode = doc.activeLayer.blendMode.toString();
            var str = upperCaseFirstLetter(blendMode.split(".")[1].toLowerCase())
            str = CleanBlendModeName(str);
            var suffix = "";
            if(addOpacityAmount && addFillAmount) {
                suffix = "O:" + Math.round(doc.activeLayer.opacity) + "%" + " F:" + Math.round(doc.activeLayer.fillOpacity) + "%";
            }
            else if(addOpacityAmount) {
                suffix = Math.round(doc.activeLayer.opacity) + "%";
            }
            else if(addFillAmount) {
                suffix = Math.round(doc.activeLayer.fillOpacity) + "%";
            }
            if(adjustmentLayer[doc.activeLayer.kind.toString().split(".")[1]] !== undefined && ignoreAdjustementLayers){
                continue;
            }
            if(shapeFillAndPatternLayer[doc.activeLayer.kind.toString().split(".")[1]] !== undefined && ignoreShapeFillAndPatternLayers){
                continue;
            }
            if(doc.activeLayer.kind === LayerKind.TEXT && ignoreTextLayers){
                continue;
            }
            if(doc.activeLayer.kind === LayerKind.SMARTOBJECT && ignoreSmartObjects){
                continue;
            }
            doc.activeLayer.name = str + " " + suffix;
        }
    }
    for (var i = 0; i < selectedLayersIndices.length; i++) {
        selectLayerByIndex(selectedLayersIndices[i], true);
    }
}

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function SetActiveLayerColor(color) {
    var idsetd = charIDToTypeID( "setd" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref.putEnumerated( idLyr, idOrdn, idTrgt );
    desc.putReference( idnull, ref );
    var idT = charIDToTypeID( "T   " );
    var desc2 = new ActionDescriptor();
    var idClr = charIDToTypeID( "Clr " );var idClr = charIDToTypeID( "Clr " );
    var idBl = charIDToTypeID( color );
    desc2.putEnumerated( idClr, idClr, idBl );
    var idLyr = charIDToTypeID( "Lyr " );
    desc.putObject( idT, idLyr, desc2 );
    executeAction( idsetd, desc, DialogModes.NO )
}

function getSelectedLayersIndices(){
    var selectedLayers = new Array;
    var ref = new ActionReference();
    ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
    var desc = executeActionGet(ref);
    if( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
       desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
        var c = desc.count 
        var selectedLayers = new Array();
        for(var i=0;i<c;i++){
          try{ 
             activeDocument.backgroundLayer;
             selectedLayers.push(  desc.getReference( i ).getIndex() );
          }catch(e){
             selectedLayers.push(  desc.getReference( i ).getIndex()+1 );
          }
        }
     }else{
       var ref = new ActionReference(); 
       ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" )); 
       ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
       try{ 
          activeDocument.backgroundLayer;
          selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
       }catch(e){
          selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
       }
    }
    return selectedLayers;
 }

function selectLayerByIndex(index,add){ 
    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Lyr "), index);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref );
    if(add) {
        desc.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) ) 
    }
    desc.putBoolean( charIDToTypeID( "MkVs" ), false ); 
    try{
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO );
    }catch(e){}
}

function CleanBlendModeName(str) {
    switch(String(str)){
        case "Colorburn":
        str= "Color Burn"
        break;
       
        case "Linearburn":
        str= "Linear Burn"
        break;
        
        case "Darkercolor":
        str= "Darker Color"
        break;
        
        case "Colordodge":
        str= "Color Dodge"
        break;4
       
        case "Lineardodge":
        str = "Linear Dodge (Add)"
        break;
        
        case "Lightercolor":
        str= "Lighter Color"
        break;

        case "Softlight":
        str= "Soft Light"
        break;
        
        case "Hardlight":
        str= "Hard Light"
        break;
        
        case "Vividlight":
        str= "Vivid Light"
        break;
        
        case "Linearlight":
        str= "Linearr Light"
        break;4
        
        case "Pinlight":
        str = "Pin Light"
        break;
        
        case "Hardmix":
        str= "Hard Mix"
        break;
    }
    return str;
}

function SetLayerColorToBlendMode(str) {
    switch(String(str)){
        // Color names: "None",  "Rd  ", "Orng", "Ylw ", "Grn ", "Bl  ",  "Vlt ", "Gry "
        // None "None"
        case "NORMAL":
        SetActiveLayerColor("None")
        break;

        // Grey "Gry "
        case "DISSOLVE":
        SetActiveLayerColor("Gry ")
        break;

        // Blue "Bl  "
        case "MULTIPLY":
        SetActiveLayerColor("Bl  ")
        break;

        case "DARKEN":
        SetActiveLayerColor("Bl  ")
        break;

        case "COLORBURN":
        SetActiveLayerColor("Bl  ")
        break;

        case "LINEARBURN":
        SetActiveLayerColor("Bl  ")
        break;

        case "DARKERCOLOR":
        SetActiveLayerColor("Bl  ")
        break;

        // Yellow "Ylw "
        case "LIGHTEN":
        SetActiveLayerColor("Ylw ")
        break;

        case "SCREEN":
        SetActiveLayerColor("Ylw ")
        break;

        case "COLORDODGE":
        SetActiveLayerColor("Ylw ")
        break;

        case "LINEARDODGE":
        SetActiveLayerColor("Ylw ")
        break;

        case "LIGHTERCOLOR":
        SetActiveLayerColor("Ylw ")
        break;

        // Orange "Orng"
        case "OVERLAY":
        SetActiveLayerColor("Orng")
        break;

        case "SOFTLIGHT":
        SetActiveLayerColor("Orng")
        break;

        case "HARDLIGHT":
        SetActiveLayerColor("Orng")
        break;

        case "VIVIDLIGHT":
        SetActiveLayerColor("Orng")
        break;

        case "LINEARLIGHT":
        SetActiveLayerColor("Orng")
        break;

        case "PINLIGHT":
        SetActiveLayerColor("Orng")
        break;

        case "HARDMIX":
        SetActiveLayerColor("Orng")
        break;

        // Green "Grn "
        case "DIFFERENCE":
        SetActiveLayerColor("Grn ")
        break;

        case "EXCLUSION":
        SetActiveLayerColor("Grn ")
        break;

        case "SUBSTACT":
        SetActiveLayerColor("Grn ")
        break;

        case "DIVIDE":
        SetActiveLayerColor("Grn ")
        break;

        // Violet "Vlt "
        case "HUE":
        SetActiveLayerColor("Vlt ")
        break;

        case "SATURATION":
        SetActiveLayerColor("Vlt ")
        break;

        case "COLOR":
        SetActiveLayerColor("Vlt ")
        break;

        case "LUMINOSITY":
        SetActiveLayerColor("Vlt ")
        break;
    }
}

function SetLayerColorByLayerType(str) {
    switch(String(str)){
        // Color names: "None",  "Rd  ", "Orng", "Ylw ", "Grn ", "Bl  ",  "Vlt ", "Gry "
        case "NORMAL":
        // SetActiveLayerColor("None")
        break;

        // Grey "Gry "
        case "TEXT":
        // SetActiveLayerColor("None")
        break;

        // Blue "Bl  "
        case "SMARTOBJECT":
        // SetActiveLayerColor("None")
        break;

        case "SOLIDFILL":
        // SetActiveLayerColor("None")
        break;

        case "GRADIENTFILL":
        // SetActiveLayerColor("None")
        break;

        case "PATTERNFILL":
        // SetActiveLayerColor("None")
        break;

        // All adjustment layers layer colors are set to red
        case "BRIGHTNESSCONTRAST":
        SetActiveLayerColor("Rd  ")
        break;

        case "LEVELS":
        SetActiveLayerColor("Rd  ")
        break;

        case "CURVES":
        SetActiveLayerColor("Rd  ")
        break;

        case "EXPOSURE":
        SetActiveLayerColor("Rd  ")
        break;

        case "VIBRANCE":
        SetActiveLayerColor("Rd  ")
        break;

        case "HUESATURATION":
        SetActiveLayerColor("Rd  ")
        break;

        case "COLORBALANCE":
        SetActiveLayerColor("Rd  ")
        break;

        case "BLACKANDWHITE":
        SetActiveLayerColor("Rd  ")
        break;

        case "CHANNELMIXER":
        SetActiveLayerColor("Rd  ")
        break;

        case "COLORLOOKUP":
        SetActiveLayerColor("Rd  ")
        break;

        case "INVERSION":
        SetActiveLayerColor("Rd  ")
        break;

        case "POSTERIZE":
        SetActiveLayerColor("Rd  ")
        break;

        case "THRESHOLD":
        SetActiveLayerColor("Rd  ")
        break;

        case "GRADIENTMAP":
        SetActiveLayerColor("Rd  ")
        break;

        case "SELECTIVECOLOR":
        SetActiveLayerColor("Rd  ")
        break;
    }
}
