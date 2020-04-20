// Script to change color on all selected layers supports solid, shape, text and artlayers
var doc;

if (app.documents.length <= 0) {
    alert("No active document!");
} else {
    doc = app.activeDocument;
    doc.suspendHistory("Set Color On Selected", "ChangeLayerColors();");
}

function ChangeLayerColors() {
    if (app.showColorPicker()) {
        var color = app.foregroundColor.rgb;
        var selectedLayers = getSelectedLayersIndices();
        var normalLayers = [];
        var invisibleLayers = [];

        for (var i = 0; i < selectedLayers.length; i++) {
            selectLayerByIndex( selectedLayers[i], false)
            if (!doc.activeLayer.visible) {
                invisibleLayers.push(doc.activeLayer);
            }
            if (doc.activeLayer.kind == LayerKind.SOLIDFILL) {
                setSolidFillColor(color);
            } else if (doc.activeLayer.kind == LayerKind.TEXT) {
                var textColor = new SolidColor();
                textColor.rgb.red = color.red;
                textColor.rgb.green = color.green;
                textColor.rgb.blue = color.blue;
                doc.activeLayer.textItem.color = textColor;
            } else if (doc.activeLayer.kind == LayerKind.NORMAL) {
                normalLayers.push(doc.activeLayer);
            }
        }
        for (var i = 0; i < normalLayers.length; i++) {
            doc.activeLayer = normalLayers[i];
            fillWithColor(color);
        }
        for (var i = 0; i < invisibleLayers.length; i++) {
            doc.activeLayer = invisibleLayers[i];
            doc.activeLayer.visible = false;
        }
    }
    for (var i = 0; i < selectedLayers.length; i++) {
        selectLayerByIndex(selectedLayers[i], true);
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

function setSolidFillColor(color) {
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