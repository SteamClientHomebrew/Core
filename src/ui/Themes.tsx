import { 
    Millennium, 
    Dropdown, 
    DialogHeader, 
    DialogBody, 
    classMap, 
    IconsModule, 
    pluginSelf, 
    ShowModalProps, 
    Toggle, 
    MessageBoxResult, 
    showModal 
} from '@millennium/ui'

import { FC, useEffect, useState } from 'react'
import { RenderThemeEditor } from './ThemeEditor'
import { ComboItem, ThemeItem } from '../components/types'
import { PromptReload } from './RestartModal'
import { SetupAboutRenderer } from './AboutTheme'
import { locale } from '../locales'
import { ConnectionFailed } from './ConnectionFailed'

const ShowThemeSettings = async (activeTheme: string) => {

    const title = "Editing " + activeTheme

    const OnClose = () => {

        if (!pluginSelf.ConditionConfigHasChanged) {
            return
        }

        PromptReload().then((result) => {
            if (result === MessageBoxResult.okay) {
                SteamClient.Browser.RestartJSContext()
            }
        })
        pluginSelf.ConditionConfigHasChanged = false
    }

    const windowOptions: ShowModalProps = {
        strTitle: title,
        bHideMainWindowForPopouts: false,
        popupHeight: 675,
        popupWidth: 850,
        browserContext: 1,
        fnOnClose: OnClose
    }

    showModal(<RenderThemeEditor/>, window, windowOptions)

    /**
     * hacky solution to extending the restricted showModal wrapper. 
     * @todo fix with custom wrapper
     * @returns window details of open modal
     */
    const findWindow = () => {
        return new Promise((resolve, _reject) => {
            (function checkAgain() {
                setTimeout(() => {
                    // @ts-ignore
                    const modalResult = Array.from(g_PopupManager.m_mapPopups.data_, ([key, value]) => ({ key, value })).find((value) => {
            
                        if (value.key === title) 
                            return value.value
                    })

                    !modalResult ? checkAgain() : resolve(modalResult)
                }, 1)
            })()
        })
    }

    const window1: any = await findWindow()
    const body: HTMLBodyElement = window1.value.value_.m_popup.document.body as HTMLBodyElement

    body.classList.add("DesktopUI")
}

interface EditThemeProps {
    active: string
}

/**
 * Display the edit theme button on a theme if applicable
 * @param active the common name of a theme
 * @returns react component
 */
const RenderEditTheme: React.FC<EditThemeProps> = ({ active }) => {

    /** Current theme is not editable */
    if (pluginSelf?.isDefaultTheme || (pluginSelf.activeTheme as ThemeItem)?.data?.Conditions === undefined) {
        return (<></>)
    }

    return (
        <button 
            onClick={() => ShowThemeSettings(active)} 
            style={{margin: "0", padding: "0px 10px", marginRight: "10px"}} 
            className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable millenniumIconButton" 
        >
            <IconsModule.Edit style={{height: "16px"}}/>
        </button>
    )
}

const findAllThemes = async (): Promise<ComboItem[]> => {
    
    const activeTheme: ThemeItem = await Millennium.callServerMethod("cfg.get_active_theme")

    return new Promise<ComboItem[]>(async (resolve) => {
        let buffer: ComboItem[] = (JSON.parse(await Millennium.callServerMethod("find_all_themes")) as ThemeItem[])
            /** Prevent the selected theme from appearing in combo box */
            .filter((theme: ThemeItem) => !pluginSelf.isDefaultTheme ? theme.native !== activeTheme.native : true)
            .map((theme: ThemeItem, index: number) => ({ 

                label: theme?.data?.name ?? theme.native, theme: theme, data: "theme" + index 
            }))


        /** Add the default theme to list */
        !pluginSelf.isDefaultTheme && buffer.unshift({ label: "< Default >", data: "default", theme: null })
        resolve(buffer)
    })
}

const ThemeViewModal: React.FC = () => {

    const [themes, setThemes] = useState<ComboItem[]>()
    const [active, setActive] = useState<string>()
    const [jsState, setJsState] = useState<boolean>(undefined)
    const [cssState, setCssState] = useState<boolean>(undefined)

    useEffect(() => {

        const activeTheme: ThemeItem = pluginSelf.activeTheme
        pluginSelf.isDefaultTheme ? setActive("Default") : setActive(activeTheme?.data?.name ?? activeTheme?.native)

        findAllThemes().then((result: ComboItem[]) => setThemes(result))

        Millennium.callServerMethod("cfg.get_config_str").then((value: string) => {
            const json = JSON.parse(value)

            setJsState(json.scripts)
            setCssState(json.styles)
        })
        .catch((_: any) => {
            console.error("Failed to fetch theme settings")
            pluginSelf.connectionFailed = true
        })
    }, [])

    const onScriptToggle = (enabled: boolean) => {
        setJsState(enabled)

        PromptReload().then((selection: MessageBoxResult) => {
            if (selection == MessageBoxResult.okay) {
                Millennium.callServerMethod("cfg.set_config_keypair", {key: "scripts", value: enabled})
                window.location.reload()
            }
        })
    }

    const onStyleToggle = (enabled: boolean) => {
        setCssState(enabled)

        PromptReload().then((selection: MessageBoxResult) => {
            if (selection == MessageBoxResult.okay) {
                Millennium.callServerMethod("cfg.set_config_keypair", {key: "styles", value: enabled})
                .catch((_: any) => {
                    console.error("Failed to update settings")
                    pluginSelf.connectionFailed = true
                })

                SteamClient.Browser.RestartJSContext()
            }
        })
    }

    const updateThemeCallback = (item: ComboItem) => {
        const themeName = item.data === "default" ? "__default__" : item.theme.native;

        Millennium.callServerMethod("cfg.change_theme", {theme_name: themeName});
        findAllThemes().then((result: ComboItem[]) => setThemes(result))

        PromptReload().then((selection: MessageBoxResult) => {
            if (selection == MessageBoxResult.okay) {
                SteamClient.Browser.RestartJSContext()
            }
        })
    }

    const OpenThemeRepository = () => {
        SteamClient.System.OpenInSystemBrowser("https://steambrew.app/themes")
    }

	if (pluginSelf.connectionFailed) {
		return <ConnectionFailed/>
	}

    return (
        <>

            <style>
                {
                    `.DialogDropDown._DialogInputContainer.Panel.Focusable {
                        min-width: max-content !important;
                    }`
                }
            </style>

            <DialogHeader>{locale.settingsPanelThemes}</DialogHeader>
            <DialogBody className={classMap.SettingsDialogBodyFade}>
                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                        <div className="_3b0U-QDD-uhFpw6xM716fw">{locale.themePanelClientTheme}</div>
                        <div className={classMap.FieldChildrenWithIcon}>

                            <RenderEditTheme active={active}/>
                            {
                                !pluginSelf.isDefaultTheme && 
                                <button 
                                    onClick={() => SetupAboutRenderer(active)} 
                                    style={{margin: "0", padding: "0px 10px", marginRight: "10px"}} 
                                    className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable millenniumIconButton" 
                                >
                                    <IconsModule.Information style={{height: "16px"}}/>
                                </button>
                            }

                            <Dropdown contextMenuPositionOptions={{bMatchWidth: false}} rgOptions={themes as any} selectedOption={1} strDefaultLabel={active} onChange={updateThemeCallback as any}></Dropdown>        
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>
                        <div>{locale.themePanelThemeTooltip}</div>
                        <a href="#" onClick={OpenThemeRepository} className="RmxP90Yut4EIwychIEg51" style={{ display: "flex", gap: "5px"}}>
                            <IconsModule.Hyperlink style={{width: "14px"}}/>
                            {locale.themePanelGetMoreThemes}
                        </a>
                    </div>
                </div> 
                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                        <div className="_3b0U-QDD-uhFpw6xM716fw">{locale.themePanelInjectJavascript}</div>
                        <div className={classMap.FieldChildrenWithIcon}>

                            { jsState !== undefined && <Toggle value={jsState} onChange={onScriptToggle}></Toggle> }
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>{locale.themePanelInjectJavascriptToolTip}</div>
                </div> 
                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                        <div className="_3b0U-QDD-uhFpw6xM716fw">{locale.themePanelInjectCSS}</div>
                        <div className={classMap.FieldChildrenWithIcon}>
                            { cssState !== undefined && <Toggle value={cssState} onChange={onStyleToggle}></Toggle> }
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>{locale.themePanelInjectCSSToolTip}</div>
                </div> 
            </DialogBody>
        </>
    )
}

export { ThemeViewModal }