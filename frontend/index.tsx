import { Millennium, findModuleChild, pluginSelf } from "millennium-lib"; 
import { parseTheme, patchDocumentContext } from "./patcher"
import { RenderSettingsModal } from "./components/settings"
import { ConditionsStore, ThemeItem, SystemAccentColor } from "./types/types";

async function getTheme(): Promise<ThemeItem> {
    return new Promise(async (resolve: any, _reject: any) => {
        resolve(JSON.parse(await Millennium.callServerMethod("cfg.get_active_theme")) as ThemeItem)
    })
}

const getConditionals = (): Promise<ConditionsStore> => {
    return new Promise(async (resolve: any, _reject: any) => {
        resolve(JSON.parse(await Millennium.callServerMethod("get_conditionals")) as ConditionsStore)
    })
}

const getSystemColor = (): Promise<SystemAccentColor> => {
    return new Promise(async (resolve: any, _reject: any) => {
        resolve(JSON.parse(await Millennium.callServerMethod("get_accent_color")) as SystemAccentColor)
    })
}

const getBackendProps = () => {
    return new Promise(async (resolve: any, _reject: any) => {
        resolve(JSON.parse(await Millennium.callServerMethod("get_load_config")))
    })
}

async function getActive() {
    return new Promise(async (resolve: (value: ThemeItem | PromiseLike<ThemeItem>) => void, reject: any) => {
        const theme: ThemeItem = await getTheme()

        // failed to parse whatever theme was selected, or the default is active
        theme?.failed && reject("default")
        // evaluate overriden patch keys from default patches, if specified. 
        if (theme?.data?.Patches !== undefined && theme?.data?.UseDefaultPatches) {
            theme.data.Patches = parseTheme(theme.data.Patches)
        }
        resolve(theme)
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

// Entry point on the front end of your plugin
export default async function PluginMain() {

    const current: ThemeItem = await getActive().catch((_: string) => {
        pluginSelf.isDefaultTheme = true
        return null
    })

    pluginSelf.activeTheme = current
    
    const conditionals: ConditionsStore = await getConditionals()
    const systemColors: SystemAccentColor = await getSystemColor()

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

    pluginSelf.activeTheme = current
    pluginSelf.conditionals = conditionals

    Millennium.AddWindowCreateHook(windowCreated)
}