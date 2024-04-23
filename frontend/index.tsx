import { Millennium, pluginSelf } from "./millennium"; 
import { parseTheme, patch_context } from "./patcher"
import { RenderSettingsModal } from "./components/settings"

async function getThemes() {
    return new Promise(async (resolve: any, _reject: any) => {
        const result = await Millennium.callServerMethod("find_all_themes")
        resolve(JSON.parse(result))
    })
}

async function getConditionals() {
    return new Promise(async (resolve: any, _reject: any) => {
        const result = await Millennium.callServerMethod("get_conditionals")
        resolve(JSON.parse(result))
    })
}

async function getSystemColor() {
    return new Promise(async (resolve: any, _reject: any) => {
        const result = await Millennium.callServerMethod("get_accent_color")
        resolve(JSON.parse(result))
    })
}


async function getActive() {
    return new Promise(async (resolve: any, _) => {
        const themes: any = await getThemes() 

        themes.forEach((theme: any) => {
            if (theme["native-name"] == "Fluenty") {

                if ("Patches" in theme.data) {
                    theme.data.Patches = parseTheme(theme.data.Patches)    
                }
                resolve(theme)
            }
        });
    })
}

function windowCreated(_context: any) 
{
    // window create event. 
    // you can interact directly with the document and monitor it with dom observers
    // you can then render components in specific pages. 
    // console.log("window created ->", pluginSelf.activeTheme, _context)
    const title = _context.m_strTitle

    // @ts-ignore
    if (title == LocalizationManager.LocalizeString("#Settings_Title")) {
        RenderSettingsModal(_context)
    }

    // @ts-ignore
    g_PopupManager.m_mapPopups.data_.forEach((element: any) => {
        if (element.value_.m_strName == 'SP Desktop_uid0') {

            if (element.value_.m_popup.window.HAS_INJECTED_THEME === undefined) {
                console.log("patching Steam window because it wasn't already")
                patch_context(element.value_);
            }
        }
    })

    patch_context(_context);
}

// Entry point on the front end of your plugin
export default async function PluginMain() {

    const current: any = await getActive()
    const conditionals: any = await getConditionals()
    const col: any = await getSystemColor()

    console.log('loaded with', current, "conditionals", conditionals)
    console.log("system colors ->", col)

    pluginSelf.systemColor = `
    :root {
        --SystemAccentColor: ${col.accent};
        --SystemAccentColorLight1: ${col.light1};
        --SystemAccentColorLight2: ${col.light2};
        --SystemAccentColorLight3: ${col.light3};
        --SystemAccentColorDark1: ${col.dark1};
        --SystemAccentColorDark2: ${col.dark2};
        --SystemAccentColorDark3: ${col.dark3};
    }`

    pluginSelf.activeTheme = current
    pluginSelf.conditionals = conditionals

    Millennium.AddWindowCreateHook(windowCreated)
}