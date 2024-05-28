import { Millennium, pluginSelf } from "millennium-lib"

/**
 * @todo use builtin notification components instead of altering 
 * SteamClient.ClientNotifications.DisplayClientNotification
 * @param doc document of notification
 */

const RemoveAllListeners = (doc: Document) => {
    var bodyClass = [...doc.getElementsByClassName("_3CGHgMXRIoyrljmStDoKuf")];
        
    Array.from(bodyClass).forEach(function(element) {
        var newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
    });
}

const SetClickListener = (doc: Document) => {
    var bodyClass = [...doc.getElementsByClassName("_3CGHgMXRIoyrljmStDoKuf")][0];

    bodyClass.addEventListener("click", () => {
        console.log("clicked notif!")
        pluginSelf.OpenOnUpdatesPanel = true

        /** Open the settings window */
        window.open("steam://open/settings", "_blank")
    });
}

const PatchNotification = (doc: Document) => {

    Millennium.findElement(doc, "._3dAcRIhxsyAgEam4dywJvj").then(async (elements) => {

        const header = elements[0].textContent

        if (header == "Updates Available") {
            (await Millennium.findElement(doc, "._28AhGOLtOo3TwshpQm2-wk"))?.[0]?.remove();
            (await Millennium.findElement(doc, "._2yhOCNV9s2fKohW8wqWRTY"))?.[0]?.remove();
            (await Millennium.findElement(doc, "._19g_L-qkP3q7SDkgXAgoli"))?.[0]?.remove();
        }

        RemoveAllListeners(doc)
        SetClickListener(doc)
    })
}

export { PatchNotification }