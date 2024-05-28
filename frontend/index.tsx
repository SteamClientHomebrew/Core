import { Millennium, pluginSelf } from "millennium-lib"; 
import { patchDocumentContext } from "./patcher/index"
import { RenderSettingsModal } from "./@interfaces/Settings"
import { ConditionsStore, ThemeItem, SystemAccentColor } from "./components/types";
import { DispatchSystemColors } from "./patcher/SystemColors";
import { ParseLocalTheme } from "./patcher/ThemeParser";
import { Logger } from "./components/Logger";

const getBackendProps = () => {
    return new Promise(async (resolve: any, _reject: any) => {
        resolve(JSON.parse(await Millennium.callServerMethod("get_load_config")))
    })
}

const UnsetSilentStartup = () => {
    const params = new URLSearchParams(window.location.href);
    
    if (params.get("SILENT_STARTUP") === "true") {
        params.set("SILENT_STARTUP", "false")

        const newSearchParams = decodeURIComponent(params.toString())
        console.log("new url", newSearchParams)
        window.location.href = newSearchParams
    }
}

const SetSilentStartup = () => {
    const params = new URLSearchParams(window.location.href);
    const silent = params.get("SILENT_STARTUP")
    
    if (silent === "false" || silent == null) {
        params.set("SILENT_STARTUP", "true")

        const newSearchParams = decodeURIComponent(params.toString())
        console.log("new url", newSearchParams)
        window.location.href = newSearchParams
    }
}

const PatchMissedDocuments = () => {
    // @ts-ignore
    g_PopupManager.m_mapPopups.data_.forEach((element: any) => {
        if (element.value_.m_popup.window.HAS_INJECTED_THEME === undefined) {
            patchDocumentContext(element.value_);
        }
    })
}

const windowCreated = (windowContext: any): void => {

    switch (windowContext.m_strTitle) {
        /** @ts-ignore */
        case LocalizationManager.LocalizeString("#Steam_Platform"): {
            UnsetSilentStartup()

        }
        /** @ts-ignore */
        case LocalizationManager.LocalizeString("#Settings_Title"): {
            RenderSettingsModal(windowContext)
        }     
    }

    PatchMissedDocuments();
    patchDocumentContext(windowContext);
}

const InitializePatcher = (startTime: number, result: any) => {

    Logger.Log(`Received props in [${(performance.now() - startTime).toFixed(3)}ms]`, result)

    const theme: ThemeItem = result.active_theme
    const systemColors: SystemAccentColor = result.accent_color
    
    ParseLocalTheme(theme)
    DispatchSystemColors(systemColors)
    
    pluginSelf.conditionals   = result.conditions as ConditionsStore
    pluginSelf.scriptsAllowed = result?.settings?.scripts as boolean ?? true
    pluginSelf.stylesAllowed  = result?.settings?.styles as boolean ?? true

    // @ts-ignore
    if (g_PopupManager.m_mapPopups.size > 0) {
        SteamClient.Browser.RestartJSContext();
    }
    PatchMissedDocuments();
}

// Entry point on the front end of your plugin
export default async function PluginMain() {

    const startTime = performance.now();

    getBackendProps().then((result: any) => InitializePatcher(startTime, result))
    Millennium.AddWindowCreateHook(windowCreated)
}