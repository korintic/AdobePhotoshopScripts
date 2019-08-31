# Adobe Photoshop Scripts

Collection of simple Photoshops scripts written to improve workflow and learn Javascript and ExtendScripting.

## Photoshop Scripts

These scripts can be used through File>Scripts>Browse or saving the scripts to *C:\Program Files\Adobe\ (your photoshop version e.g. Adobe Photoshop CC 2018)\Presets\Scripts* which requires admin rights.
The latter way is necessary for binding scripts to hotkeys as scripts saved in the scripts folder are available through the *File>Scripts* menu and can be bound to a shortcut through *Edit>Keyboard Shortcuts => [Shortcuts for: Application Menus] File> Scripts> (Your script name)*.

#### Scripts:
* ColorIDPicker
* ChangeColorOnSelected
* QuickExportPNG

---

### ColorIDPicker

![Header image](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPicker.png "Header image")


ColorIDPicker script will toggle between currently active layer and tool an ColorID layer and Magic Wand tool making it faster to work with selections.
The script is build for a workflow where there is a flat color layer that is used for making selections.
This is a common workflow used in illustration, comicbook coloring and touch-up of 3D renders.
Depending on who is using this workflow the selection layer has many names: Selections, Flats, ColorID, ClownPass and so on.
By default this script uses the layer name ColorID.
ColorIDPicker is meant to be used bind to a shortcut for efficiency.

#### Set-up:
**Save script to:**  
*C:\Program Files\Adobe\ (your photoshop version e.g. Adobe Photoshop CC 2018)\Presets\Scripts*

**Open Photoshop and set a hotkey for the script at:**  
*Edit>Keyboard Shortcuts => [Shortcuts for: Application Menus] File> Scripts> ColorIDPicker*

After this the script is ready to with any photoshop file that has a layer called ColorID.
ColorID is the default layer name ColorIDPicker is looking for when starting a pick.

It is possible to change the default behaviour of ColorIDPicker by opening the script in a plain text editor like notepad or notepad++ and following the instruction at the top of the script file.

To change the name of used for the selections layer find the line **var idLayerName = "ColorID";** near the top of the script file and change the text **"ColorID"** inside the quotation marks to the desired layer name.

#### Combinations of different preferences:

![Preferences 1](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences1.gif "Preferences 1")![Preferences 2](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences2.gif "Preferences 2")

![Preferences 3](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences3.gif "Preferences 3")![Preferences 4](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences4.gif "Preferences 4")

It is possible to change whether the ColorIDPicker toggles layer and selection edge ("marching ants") visibility when used by changing the lines: **var toggleLayerVisibility = true;** and **var toggleSelectionVisibility = true;**.
Replacing the word **'true'** with **'false'** will turn these features off.

Toggling layer visibility works like alt+clicking on layer visibility icon in the Layers panel(so the previous state will be lost if layer visibility is changed manually while in pick mode).
The selection edge visibility toggle works like ctrl+H.

If the active layer is not a normal paint layer the script will select this layer's layer mask if it has one. 
This is usually the desired outcome when working more non-destructively using solid color layer and adjustment layers with masks.
It is possible to set ColorIDPicker to always select layer mask if current layer has one when returning from pick.
Replace **var alwaysSelectLayerMask = false;** from **'false'** to **'true'** for this behaviour.

![Changeable variables](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPickerPreferences.png "ColorIDPicker.cs")

**Note:**
Usually in this workflow the flat color layer has hard edges without anti-aliasing for precise selections. 
For correct results the Magic Wand tool settings should be set so that anti-aliasing is off and tolerance is set to zero.
This is not forced by the script however so it is up to the user to set their Magic Wand tool properties.

---

### ChangeColorOnSelected

Changes color on all selected layers by prompting a ColorPicker–dialog. Works on Solid Color layers, Text layers, Normal layers and Shape layers with solid fill set.
If groups are selected applies color changes to all applicable layers in those groups as this is assumed intented behaviour when selecting groups.

---

### QuickExportPNG

Simple workflow script done for quickly exporting and resizing PNGs according to naming conventions and project folder structure.
Destination path variable **_folder** should be edited to point at the the correct folder on per project basis.
The script uses the active layer name as the target name for exporting. It will by default try to find a subfolder that matches the start of the target name to save to and will prompt the user if a subfolder is not found. This behaviour can be changed so that if matching subfolder is not found the image will be always saved to the root folder by changing **_saveInRoot** to **"true"**. The script will also by default resize the exported image if it's name's beginning matches a prefix defined in **_resizeRules** object. To disable resizing **_isResizedByPrefix** should be set to **"false"**.
