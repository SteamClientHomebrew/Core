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
    showModal, 
    Classes
} from '@millennium/ui'

import { FC, useEffect, useState } from 'react'
import { RenderThemeEditor } from './ThemeEditor'
import { ComboItem, ThemeItem } from '../components/types'
import { PromptReload } from './RestartModal'
import { SetupAboutRenderer } from './AboutTheme'
import { locale } from '../locales'
import { ConnectionFailed } from './ConnectionFailed'
import { FieldClasses } from '../components/Classes'

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
    .then((result: any) => {
        pluginSelf.connectionFailed = false
        return result
    })

    return new Promise<ComboItem[]>(async (resolve) => {
        let buffer: ComboItem[] = (JSON.parse(await Millennium.callServerMethod("find_all_themes")
            .then((result: any) => {
                pluginSelf.connectionFailed = false
                return result
            })) as ThemeItem[])

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

        setJsState(pluginSelf.scriptsAllowed)
        setCssState(pluginSelf.stylesAllowed)
    }, [])

    const onScriptToggle = (enabled: boolean) => {
        setJsState(enabled)

        PromptReload().then((selection: MessageBoxResult) => {
            if (selection == MessageBoxResult.okay) {
                Millennium.callServerMethod("cfg.set_config_keypair", {key: "scripts", value: enabled})
                .then((result: any) => {
                    pluginSelf.connectionFailed = false
                    return result
                })
                .catch((_: any) => {
                    console.error("Failed to update settings")
                    pluginSelf.connectionFailed = true
                })

                SteamClient.Browser.RestartJSContext()
            }
        })
    }

    const onStyleToggle = (enabled: boolean) => {
        setCssState(enabled)

        PromptReload().then((selection: MessageBoxResult) => {
            if (selection == MessageBoxResult.okay) {
                Millennium.callServerMethod("cfg.set_config_keypair", {key: "styles", value: enabled})
                .then((result: any) => {
                    pluginSelf.connectionFailed = false
                    return result
                })
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

        Millennium.callServerMethod("cfg.change_theme", {theme_name: themeName}).then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        });
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

    const containerClasses = [
        Classes.Field, 
        Classes.WithFirstRow, 
        Classes.VerticalAlignCenter, 
        Classes.WithDescription, 
        Classes.WithBottomSeparatorStandard, 
        Classes.ChildrenWidthFixed, 
        Classes.ExtraPaddingOnChildrenBelow, 
        Classes.StandardPadding, 
        Classes.HighlightOnFocus,
        "Panel"
    ]
    .join(" ")

    const OpenThemesFolder = () => {
        Millennium.callServerMethod("open_themes_folder")
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
                <div className={containerClasses}>
                    <div className={FieldClasses.FieldLabelRow}>
                        <div className={FieldClasses.FieldLabel}>{locale.themePanelClientTheme}</div>
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

                            <button 
                                onClick={OpenThemesFolder} 
                                style={{margin: "0", padding: "0px 10px", marginRight: "10px"}} 
                                className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable millenniumIconButton" 
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16px" height="16px"><path fill="currentColor" d="M 8.5 8 C 6.019 8 4 10.019 4 12.5 L 4 18 L 16.052734 18 C 16.636734 18 17.202344 17.793922 17.652344 17.419922 L 23.5 12.546875 L 19.572266 9.2734375 C 18.586266 8.4524375 17.336734 8 16.052734 8 L 8.5 8 z M 27.644531 13 L 19.572266 19.724609 C 18.585266 20.546609 17.336734 21 16.052734 21 L 4 21 L 4 35.5 C 4 37.981 6.019 40 8.5 40 L 39.5 40 C 41.981 40 44 37.981 44 35.5 L 44 17.5 C 44 15.019 41.981 13 39.5 13 L 27.644531 13 z" /></svg>
                            </button>

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
                <div className={containerClasses}>
                    <div className={FieldClasses.FieldLabelRow}>
                        <div className={FieldClasses.FieldLabel}>{locale.themePanelInjectJavascript}</div>
                        <div className={classMap.FieldChildrenWithIcon}>

                            { jsState !== undefined && <Toggle value={jsState} onChange={onScriptToggle}></Toggle> }
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>{locale.themePanelInjectJavascriptToolTip}</div>
                </div> 
                <div className={containerClasses}>
                    <div className={FieldClasses.FieldLabelRow}>
                        <div className={FieldClasses.FieldLabel}>{locale.themePanelInjectCSS}</div>
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