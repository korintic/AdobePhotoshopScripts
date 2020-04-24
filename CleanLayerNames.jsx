var doc;
var setLayerColors = true;
var addOpacityAmount = true;
var addFillAmount = false;

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
            var blendMode = doc.activeLayer.blendMode.toString();
            var str = upperCaseFirstLetter(blendMode.split(".")[1].toLowerCase())
            if(setLayerColors) {
                MatchLayerColorToBlendMode(str);
            }
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
            doc.activeLayer.name = str + " " + suffix;
            selectLayerByIndex( selectedLayersIndices[i], false)
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

function MatchLayerColorToBlendMode(str) {
    switch(String(str)){
        // Color names: "None",  "Rd  ", "Orng", "Ylw ", "Grn ", "Bl  ",  "Vlt ", "Gry "
        // None "None"
        case "Normal":
        SetActiveLayerColor("None")
        break;

        // Grey "Gry "
        case "Dissolve":
        SetActiveLayerColor("Gry ")
        break;

        // Blue "Bl  "
        case "Multiply":
        SetActiveLayerColor("Bl  ")
        break;

        case "Darken":
        SetActiveLayerColor("Bl  ")
        break;

        case "Colorburn":
        SetActiveLayerColor("Bl  ")
        break;

        case "Linearburn":
        SetActiveLayerColor("Bl  ")
        break;

        case "Darkercolor":
        SetActiveLayerColor("Bl  ")
        break;

        // Yellow "Ylw "
        case "Lighten":
        SetActiveLayerColor("Ylw ")
        break;

        case "Screen":
        SetActiveLayerColor("Ylw ")
        break;

        case "Colordodge":
        SetActiveLayerColor("Ylw ")
        break;

        case "Lineardodge":
        SetActiveLayerColor("Ylw ")
        break;

        case "Lightercolor":
        SetActiveLayerColor("Ylw ")
        break;

        // Orange "Orng"
        case "Overlay":
        SetActiveLayerColor("Orng")
        break;

        case "Softlight":
        SetActiveLayerColor("Orng")
        break;

        case "Hardlight":
        SetActiveLayerColor("Orng")
        break;

        case "Vividlight":
        SetActiveLayerColor("Orng")
        break;

        case "Linearlight":
        SetActiveLayerColor("Orng")
        break;

        case "Pinlight":
        SetActiveLayerColor("Orng")
        break;

        case "Hardmix":
        SetActiveLayerColor("Orng")
        break;

        // Green "Grn "
        case "Difference":
        SetActiveLayerColor("Grn ")
        break;

        case "Exclusion":
        SetActiveLayerColor("Grn ")
        break;

        case "Substact":
        SetActiveLayerColor("Grn ")
        break;

        case "Divide":
        SetActiveLayerColor("Grn ")
        break;

        // Violet "Vlt "
        case "Hue":
        SetActiveLayerColor("Vlt ")
        break;

        case "Saturation":
        SetActiveLayerColor("Vlt ")
        break;

        case "Color":
        SetActiveLayerColor("Vlt ")
        break;

        case "Luminosity":
        SetActiveLayerColor("Vlt ")
        break;
    }
}
