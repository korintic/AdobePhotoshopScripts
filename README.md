# Adobe Photoshop Scripts

Collection of simple Photoshops scripts written to improve workflow and learn Javascript and ExtendScripting.

## Photoshop Scripts

These scripts can be used through File>Scripts>Browse or saving the scripts to *C:\Program Files\Adobe\ (your photoshop version e.g. Adobe Photoshop CC 2018)\Presets\Scripts* which requires admin rights.
The latter way is necessary for binding scripts to hotkeys as scripts saved in the scripts folder are available through the *File>Scripts* menu and can be bound to a shortcut through *Edit>Keyboard Shortcuts => [Shortcuts for: Application Menus] File> Scripts> (Your script name)*.

#### Scripts:
* ColorIDPicker
* AdvancedLayerRenamer
* ChangeColorOnSelected
* UngroupNested
* SetTextLayerContent
* QuickExportPNG

---

### ColorIDPicker

![Header image](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPicker.png "Header image")


ColorIDPicker script will toggle between currently active layer and tool and ColorID layer and Magic Wand tool making it faster to work with selections.
The script is built for a workflow where a flat color layer is used for making selections.
This is a common workflow used in illustration, comicbook coloring and touch-up of 3D renders.
Depending on who is using this workflow the selection layer has many names: Selections, Flats, ColorID, ClownPass and so on.
By default this script uses the layer name ColorID.
ColorIDPicker is meant to be used bind to a shortcut for efficiency.

#### Set-up:
**Save ColorIDPicker.jsx and ColorIDPickerPreferences.jsx scripts to:**  
*C:\Program Files\Adobe\ (your photoshop version e.g. Adobe Photoshop CC 2018)\Presets\Scripts*

**Open Photoshop and set a hotkey for ColorIDPicker.jsx script at:**  
*Edit>Keyboard Shortcuts => [Shortcuts for: Application Menus] File> Scripts> ColorIDPicker*

After this the script is ready to with any photoshop file that has a layer called ColorID.
ColorID is the default layer name ColorIDPicker is looking for when starting a pick.

The default behaviour of the script can be changed by running ColorIDPreferences.jsx from *File> Scripts> ColorIDPicker Preferences*.

![Preferences](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences.png "Preferences")

**Selection Layer Name** changes the layer that is used for the selections.

**Toggle selection visibility** toggles the selection edge ("marching ants").
The selection edge visibility toggle works like ctrl+H.

**Toggle layer visibility** works like alt+clicking on layer visibility icon in the Layers panel(so the previous state will be lost if layer visibility is changed manually while in pick mode).

**Always select layer mask** sets ColorIDPicker to always select layer mask if current layer has one when returning from pick.
When this is off the script will only select layer's layer mask if the active layer is not a normal paint layer as this is usually the desired outcome when working non-destructively using solid color layer and adjustment layers with masks.

#### Combinations of different preferences:

![Preferences 1](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences1.gif "Preferences 1")![Preferences 2](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences2.gif "Preferences 2")

![Preferences 3](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences3.gif "Preferences 3")![Preferences 4](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences4.gif "Preferences 4")

**Note:**
Usually in this workflow the flat color layer has hard edges without anti-aliasing for precise selections. 
For correct results the Magic Wand tool settings should be set so that anti-aliasing is off and tolerance is set to zero.
This is not forced by the script however so it is up to the user to set their Magic Wand tool properties.

---

### AdvancedLayerRenamer

This script provides a UI dialog for manipulating layer names and selecting layers. Includes advanced options for searching by blend mode, layer type, opacity or fill amounts.

![AdvancedLayerRenamer](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/AdvancedLayerRenamer.png "AdvancedLayerRenamer")

Note: Use regex works only partly. The functionality needs to be reconsidered and brought in.

---

### ChangeColorOnSelected

Changes color on all selected layers by prompting a ColorPicker–dialog. Works on Solid Color layers, Text layers, Normal layers and Shape layers with solid fill set.
If groups are selected applies color changes to all applicable layers in those groups as this is assumed intented behaviour when selecting groups.

---

### UngroupNested

Simple script that ungroups layers from nested groups inside the selected group and deletes the empty groups.

---

### SetTextLayerContent

This script updates contents of text layers in the active document based on the contents of the selected JSON file. The script prompts an open dialog for the user to select a JSON file. Then it matches the keys from the JSON object to text layer names and updates those layers contents with the corresponding value pairs.

---

### QuickExportPNG

Simple workflow script done for quickly exporting and resizing PNGs according to naming conventions and project folder structure.
Destination path variable **_folder** should be edited to point at the the correct folder on per project basis.
The script uses the active layer name as the target name for exporting. It will by default try to find a subfolder that matches the start of the target name to save to and will prompt the user if a subfolder is not found. This behaviour can be changed so that if matching subfolder is not found the image will be always saved to the root folder by changing **_saveInRoot** to **"true"**. The script will also by default resize the exported image if it's name's beginning matches a prefix defined in **_resizeRules** object. To disable resizing **_isResizedByPrefix** should be set to **"false"**.
