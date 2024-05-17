import { Millennium, pluginSelf } from "millennium-lib"; 
import { parseTheme, patchDocumentContext } from "./patcher"
import { RenderSettingsModal } from "./components/settings"
import { ConditionsStore, ThemeItem, SystemAccentColor } from "./types/types";

const getBackendProps = () => {
    return new Promise(async (resolve: any, _reject: any) => {
        resolve(JSON.parse(await Millennium.callServerMethod("get_load_config")))
    })
}

function windowCreated(windowContext: any) 
{
    const title = windowContext.m_strTitle

    // @ts-ignore
    if (title == LocalizationManager.LocalizeString("#Settings_Title")) {
        RenderSettingsModal(windowContext)
    }

    // @ts-ignore
    g_PopupManager.m_mapPopups.data_.forEach((element: any) => {
        if (element.value_.m_strName == 'SP Desktop_uid0') {

            // main steam window popup sometimes doesn't get hooked. steam bug
            if (element.value_.m_popup.window.HAS_INJECTED_THEME === undefined) {
                patchDocumentContext(element.value_);
            }
        }
    })

    patchDocumentContext(windowContext);
}

const ReloadMillenniumFrontend = () => {
    SteamClient.Browser.RestartJSContext();
}

Millennium.exposeObj({ ReloadMillenniumFrontend })

// Entry point on the front end of your plugin
export default async function PluginMain() {

    const startTime = performance.now();

    getBackendProps().then((result: any) => {
        console.log(`Received props [${performance.now() - startTime}ms]`, result)

        pluginSelf.conditionals = result.conditions as ConditionsStore
        const theme: ThemeItem = result.active_theme
        const systemColors: SystemAccentColor = result.accent_color

        pluginSelf.scriptsAllowed = result?.settings?.scripts as boolean ?? true
        pluginSelf.stylesAllowed = result?.settings?.styles as boolean ?? true

        pluginSelf.systemColor = `
        :root {
            --SystemAccentColor: ${systemColors.accent};
            --SystemAccentColorLight1: ${systemColors.light1};
            --SystemAccentColorLight2: ${systemColors.light2};
            --SystemAccentColorLight3: ${systemColors.light3};
            --SystemAccentColorDark1: ${systemColors.dark1};
            --SystemAccentColorDark2: ${systemColors.dark2};
            --SystemAccentColorDark3: ${systemColors.dark3};
        }`


        theme?.failed && (pluginSelf.isDefaultTheme = true)
        // evaluate overriden patch keys from default patches, if specified. 
        if (theme?.data?.UseDefaultPatches) {
            theme.data.Patches = parseTheme(theme?.data?.Patches ?? [])
        }

        pluginSelf.activeTheme = theme as ThemeItem
        console.log(pluginSelf.activeTheme)
    })

    Millennium.AddWindowCreateHook(windowCreated)
}