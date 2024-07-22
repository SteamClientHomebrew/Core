import { Millennium, pluginSelf } from "@millennium/ui"; 
import { patchDocumentContext } from "./patcher/index"
import { RenderSettingsModal } from "./ui/Settings"
import { ConditionsStore, ThemeItem, SystemAccentColor, UpdateItem, SettingsProps, ThemeItemV1 } from "./components/types";
import { DispatchSystemColors } from "./patcher/SystemColors";
import { ParseLocalTheme } from "./patcher/ThemeParser";
import { Logger } from "./components/Logger";
import { PatchNotification } from "./ui/Notifications";
import { Settings, SettingsStore } from "./components/Settings";
import { DispatchGlobalColors } from "./patcher/v1/GlobalColors";

/**
 * @note crashes steam on silent boot startup
 */
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
            //UnsetSilentStartup()

        }
        /** @ts-ignore */
        case LocalizationManager.LocalizeString("#Settings_Title"): {
            RenderSettingsModal(windowContext)
        }     
    }

    if (windowContext.m_strTitle.includes("notificationtoasts")) {
        PatchNotification(windowContext.m_popup.document)
    }

    PatchMissedDocuments();
    patchDocumentContext(windowContext);
}

const InitializePatcher = (startTime: number, result: SettingsProps) => {

    Logger.Log(`Received props in [${(performance.now() - startTime).toFixed(3)}ms]`, result)

    const theme: ThemeItem = result.active_theme
    const systemColors: SystemAccentColor = result.accent_color
    
    ParseLocalTheme(theme)
    DispatchSystemColors(systemColors)

    const themeV1: ThemeItemV1 = result?.active_theme?.data as ThemeItemV1

    if (themeV1?.GlobalsColors) {
        DispatchGlobalColors(themeV1?.GlobalsColors)
    }
    
    pluginSelf.conditionals   = result.conditions as ConditionsStore
    pluginSelf.scriptsAllowed = result?.settings?.scripts as boolean ?? true
    pluginSelf.stylesAllowed  = result?.settings?.styles as boolean ?? true
    pluginSelf.steamPath      = result.steamPath

    // @ts-ignore
    if (g_PopupManager.m_mapPopups.size > 0) {
        SteamClient.Browser.RestartJSContext();
    }
    PatchMissedDocuments();
}

const ProcessUpdates = (updates: UpdateItem[]) => {

    const updateCount = updates.length

    if (!SettingsStore.settings.updateNotifications || updateCount <= 0) {
        return
    }

    const message = `Millennium found ${updateCount} available update${updateCount > 1 ? "s" : ""}`

    setTimeout(() => {
        SteamClient.ClientNotifications.DisplayClientNotification(
            1, JSON.stringify({ title: 'Updates Available', body: message, state: 'online', steamid: 0 }), (_: any) => {}
        )
    }, 5000)
}

// Entry point on the front end of your plugin
export default async function PluginMain() {

    const startTime = performance.now();
    Settings.FetchAllSettings().then((result: SettingsProps) => InitializePatcher(startTime, result))

    Millennium.callServerMethod("updater.get_update_list")
        .then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        })
        .then((result : any)          => JSON.parse(result).updates)
        .then((updates: UpdateItem[]) => ProcessUpdates(updates))
        .catch((_: any)               => {
            console.error("Failed to fetch updates")
            pluginSelf.connectionFailed = true
        })

    Millennium.AddWindowCreateHook(windowCreated)
}