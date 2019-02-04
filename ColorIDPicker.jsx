// Name of the color ID layer
var idName = 'ColorID' // replace 'ColorID' with your desired ID layer name e.g 'My layer name'

// Color ID layer visibility toggle
//If true the visibility of layers will be toggled like alt+clicking the visibility icon of ID layer in Layers panel
var toggleLayerVisibility = true // or false

//Selection visibility toggle
//If true the selection visibility "marching ants" will be toggled when entering/exiting ID picking
//Works like ctrl+H
var toggleSelectionVisibility = false // or true

var doc
var idLayer
var savedState

pickColorID()

function pickColorID () {
  if (app.documents.length <= 0) {
    alert('No active document')
    return
  }

  doc = app.activeDocument

  idLayer = getLayerIDByName(idName)

  if (idLayer == undefined) {
    alert(idName + ' layer not found!')
  } else {
    // If saved state not found save state and apply colorpicker state
    if (!PreferencesExist()) {
      captureState()
      setState()
    }
    // If saved state found and document name matches apply saved state
    else {
      if (savedState.getString(3) != doc.name) {
        captureState()
        setState()
      } else {
        resetState()
      }
    }
  }
}

function captureState () {
  var desc = new ActionDescriptor()

  desc.putString(0, currentTool)
  desc.putString(1, getLayerIDByName(doc.activeLayer.name))
  desc.putBoolean(2, doc.activeLayer.visible)
  desc.putString(3, doc.name)
  app.putCustomOptions('ColorIDPicker', desc, true)
}

function setState () {
  currentTool = 'magicWandTool'
  if (toggleLayerVisibility) {
    showOnlyLayerByID(idLayer)
  }
  selectLayerByID(idLayer)

  if (toggleSelectionVisibility) {
    app.runMenuItem(app.stringIDToTypeID('toggleShowExtras'))
  }
}

function resetState () {
  currentTool = savedState.getString(0)
  if (toggleLayerVisibility) {
    showOnlyLayerByID(idLayer)
  }
  selectLayerByID(savedState.getString(1))
  if (!savedState.getBoolean(2) && toggleLayerVisibility) {
    hideLayerByID(savedState.getString(1))
  }

  if (toggleSelectionVisibility) {
    app.runMenuItem(app.stringIDToTypeID('toggleShowExtras'))
  }
  app.eraseCustomOptions('ColorIDPicker')
}

function showOnlyLayerByID (layerID) {
  var idShw = charIDToTypeID('Shw ')
  var desc = new ActionDescriptor()
  var idnull = charIDToTypeID('null')
  var list = new ActionList()
  var ref = new ActionReference()
  var idLyr = charIDToTypeID('Lyr ')
  ref.putIdentifier(idLyr, layerID)
  list.putReference(ref)
  desc.putList(idnull, list)
  var idTglO = charIDToTypeID('TglO')
  desc.putBoolean(idTglO, true)
  executeAction(idShw, desc, DialogModes.NO)
}

function selectLayerByID (layerID) {
  var idslct = charIDToTypeID('slct')
  var desc = new ActionDescriptor()
  var idnull = charIDToTypeID('null')
  var ref = new ActionReference()
  var idLyr = charIDToTypeID('Lyr ')
  ref.putIdentifier(idLyr, layerID)
  desc.putReference(idnull, ref)
  var idMkVs = charIDToTypeID('MkVs')
  desc.putBoolean(idMkVs, false)
  var idLyrI = charIDToTypeID('LyrI')
  var list = new ActionList()
  list.putInteger(4)
  desc.putList(idLyrI, list)
  executeAction(idslct, desc, DialogModes.NO)
}

function selectLayerByName (layerName) {
  var idslct = charIDToTypeID('slct')
  var desc = new ActionDescriptor()
  var idnull = charIDToTypeID('null')
  var ref = new ActionReference()
  var idLyr = charIDToTypeID('Lyr ')
  ref.putName(idLyr, layerName)
  desc.putReference(idnull, ref)
  var idMkVs = charIDToTypeID('MkVs')
  desc.putBoolean(idMkVs, false)
  var idLyrI = charIDToTypeID('LyrI')
  var list = new ActionList()
  list.putInteger(4)
  desc.putList(idLyrI, list)
  executeAction(idslct, desc, DialogModes.NO)
}

function hideLayerByID (layerID) {
  var idHd = charIDToTypeID('Hd  ')
  var desc = new ActionDescriptor()
  var idnull = charIDToTypeID('null')
  var list = new ActionList()
  var ref = new ActionReference()
  var idLyr = charIDToTypeID('Lyr ')
  ref.putIdentifier(idLyr, layerID)
  list.putReference(ref)
  desc.putList(idnull, list)
  executeAction(idHd, desc, DialogModes.NO)
}

function getLayerIDByName (layerName) {
  currentLayer = doc.activeLayer
  try {
    selectLayerByName(layerName)
    var ref = new ActionReference()
    ref.putEnumerated(
      charIDToTypeID('Lyr '),
      charIDToTypeID('Ordn'),
      charIDToTypeID('Trgt')
    )
    return executeActionGet(ref).getInteger(charIDToTypeID('LyrI'))
  } catch (e) {
  } finally {
    doc.activeLayer = currentLayer
  }
}

function PreferencesExist () {
  try {
    return (savedState = app.getCustomOptions('ColorIDPicker'))
  } catch (e) {}
}
