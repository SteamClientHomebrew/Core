import { Millennium, pluginSelf } from "millennium-lib"; 
import { patchDocumentContext } from "./patcher/index"
import { RenderSettingsModal } from "./@interfaces/Settings"
import { ConditionsStore, ThemeItem, SystemAccentColor } from "./types/types";
import { DispatchSystemColors } from "./patcher/SystemColors";
import { ParseLocalTheme } from "./patcher/ThemeParser";

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

function windowCreated(windowContext: any) 
{
    // @ts-ignore
    if (windowContext.m_strTitle == LocalizationManager.LocalizeString("#Settings_Title")) {
        RenderSettingsModal(windowContext)
    }

    // @ts-ignore
    g_PopupManager.m_mapPopups.data_.forEach((element: any) => {
        if (element.value_.m_strName == 'SP Desktop_uid0') {
            UnsetSilentStartup()

            if (element.value_.m_popup.window.HAS_INJECTED_THEME === undefined) {
                patchDocumentContext(element.value_);
            }
        }
    })

    patchDocumentContext(windowContext);
}

// Entry point on the front end of your plugin
export default async function PluginMain() {

    const startTime = performance.now();

    getBackendProps().then((result: any) => {
        console.log(`Received props in [${performance.now() - startTime}ms]`, result)

        const theme: ThemeItem = result.active_theme
        const systemColors: SystemAccentColor = result.accent_color
        
        ParseLocalTheme(theme)
        DispatchSystemColors(systemColors)
        
        pluginSelf.conditionals   = result.conditions as ConditionsStore
        pluginSelf.scriptsAllowed = result?.settings?.scripts as boolean ?? true
        pluginSelf.stylesAllowed  = result?.settings?.styles as boolean ?? true
    })

    Millennium.AddWindowCreateHook(windowCreated)
}