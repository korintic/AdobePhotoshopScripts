# Adobe Photoshop Scripts

Collection of simple Photoshops scripts written to improve workflow and learn Javascript and ExtendScripting.

## Photoshop Scripts

These scripts can be used through File>Scripts>Browse or saving the scripts to *C:\Program Files\Adobe\ (your photoshop version e.g. Adobe Photoshop CC 2018)\Presets\Scripts* which requires admin rights.
The latter way is necessary for binding scripts to hotkeys as scripts saved in the scripts folder are available through the *File>Scripts* menu and can be bound to a shortcut through *Edit>Keyboard Shortcuts => [Shortcuts for: Application Menus] File> Scripts> (Your script name)*.

---

### ColorIDPicker

![Header image](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ColorIDPicker.png "Header image")

ColorIDPicker is a Photoshop workflow script that allow the user to quickly make selections from a color id layer.
When used the script will change the layer to the color id layer and active tool to magic wand and when ran again it will return the user to the previously selected layer and tool.
ColorIDPicker is meant to be used bind to a shortcut for efficiency.

**Save script to:**  
*C:\Program Files\Adobe\ (your photoshop version e.g. Adobe Photoshop CC 2018)\Presets\Scripts*

**Open Photoshop and set a hotkey for the script at:**  
*Edit>Keyboard Shortcuts => [Shortcuts for: Application Menus] File> Scripts> ColorIDPicker*

Make sure the file you're working with has a layer called ColorID 
(this name can be changed by opening the script in a plain text editor like notepad and following the instruction at the top of the file).
In the script file you can also change whether you want the ColorIDPicker to toggle layer and/or selection visibility when used.

![Changeable variables](https://github.com/korintic/AdobePhotoshopScripts/blob/master/Images/ChangeableVariables.png "ColorIDPicker.cs")

Toggling layer visibility works like alt+clicking on later visibility icon in the Layers panel(so the previous state will be lost if you change layer visibility manually while in pick mode).
And the selection visibility works like ctrl+H.


[IMAGE HERE] Use cases
