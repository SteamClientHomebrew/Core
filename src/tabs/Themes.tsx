import { 
    Millennium, 
    ConfirmModal,
    Dropdown, 
    DialogHeader, 
    DialogBody, 
    DialogButton,
    classMap, 
    IconsModule, 
    pluginSelf, 
    ShowModalProps, 
    Toggle, 
    showModal, 
} from '@millennium/ui'
import { Field } from '../custom_components/Field'

import { useEffect, useState } from 'react'
import { RenderThemeEditor } from '../components/ThemeEditor'
import { ComboItem, ThemeItem } from '../types'
import { SetupAboutRenderer } from '../popups/AboutTheme'
import { locale } from '../locales'
import { ConnectionFailed } from '../components/ConnectionFailed'
import { BBCodeParser } from '../components/BBCodeParser'

const Localize = (token: string): string =>
    // @ts-ignore
    LocalizationManager.LocalizeString(token);

const PromptReload = (onOK: () => void) =>
	showModal(
		<ConfirmModal
			strTitle={Localize("#Settings_RestartRequired_Title")}
			strDescription={Localize("#Settings_RestartRequired_Description")}
            strOKButtonText={Localize("#Settings_RestartNow_ButtonText")}
			onOK={onOK}
		/>,
		pluginSelf.settingsWnd,
		{
			bNeverPopOut: true,
		},
	);

const ThemeSettings = (activeTheme: string) =>
    showModal(<RenderThemeEditor />, pluginSelf.settingsWnd, {
        strTitle: "Editing " + activeTheme,
        popupHeight: 675,
        popupWidth: 850,
        fnOnClose: () => {
            if (!pluginSelf.ConditionConfigHasChanged) {
                return;
            }

            PromptReload(() => {
                SteamClient.Browser.RestartJSContext();
            });
            pluginSelf.ConditionConfigHasChanged = false;
        },
    });

interface EditThemeProps {
    active: string
}

/**
 * Display the edit theme button on a theme if applicable
 * @param active the common name of a theme
 * @returns react component
 */
const RenderEditTheme: React.FC<EditThemeProps> = ({ active }) => {

    const Theme = (pluginSelf.activeTheme as ThemeItem)

    /** Current theme is not editable */
    if (pluginSelf?.isDefaultTheme || (Theme?.data?.Conditions === undefined && Theme?.data?.RootColors === undefined)) {
        return (<></>)
    }

    return (
        <DialogButton 
            onClick={() => ThemeSettings(active)}
            style={{margin: "0", padding: "0px 10px", marginRight: "10px"}} 
            className="_3epr8QYWw_FqFgMx38YEEm millenniumIconButton" 
        >
            <IconsModule.Edit style={{height: "16px"}}/>
        </DialogButton>
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

        PromptReload(() => {
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
        })
    }

    const onStyleToggle = (enabled: boolean) => {
        setCssState(enabled)

        PromptReload(() => {
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
        })
    }

    const updateThemeCallback = (item: ComboItem) => {
        const themeName = item.data === "default" ? "__default__" : item.theme.native;

        Millennium.callServerMethod("cfg.change_theme", {theme_name: themeName}).then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        });
        findAllThemes().then((result: ComboItem[]) => setThemes(result))

        PromptReload(() => {
            SteamClient.Browser.RestartJSContext();
        });
    }

	if (pluginSelf.connectionFailed) {
		return <ConnectionFailed/>
	}

    const OpenThemesFolder = () => {
        Millennium.callServerMethod("Millennium.steam_path")
        .then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        })
        .then((path: string) => {
            console.log(path)
            SteamClient.System.OpenLocalDirectoryInSystemExplorer(`${path}/steamui/skins`)
        })
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
                <Field
                    label={locale.themePanelClientTheme}
                    description=<BBCodeParser
                        text={`${locale.themePanelThemeTooltip} [url=https://steambrew.app/themes]${locale.themePanelGetMoreThemes}[/url]`}
                    />
                >
                    <RenderEditTheme active={active} />

                    {!pluginSelf.isDefaultTheme && (
                        <DialogButton
                            onClick={() => SetupAboutRenderer(active)}
                            style={{ margin: "0", padding: "0px 10px", marginRight: "10px" }}
                            className="_3epr8QYWw_FqFgMx38YEEm millenniumIconButton"
                        >
                            <IconsModule.Information style={{ height: "16px" }} />
                        </DialogButton>
                    )}
        
                    <DialogButton
                        onClick={OpenThemesFolder}
                        style={{ margin: "0", padding: "0px 10px", marginRight: "10px" }}
                        className="_3epr8QYWw_FqFgMx38YEEm millenniumIconButton"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            width="16px"
                            height="16px"
                        >
                            <path
                                fill="currentColor"
                                d="M 8.5 8 C 6.019 8 4 10.019 4 12.5 L 4 18 L 16.052734 18 C 16.636734 18 17.202344 17.793922 17.652344 17.419922 L 23.5 12.546875 L 19.572266 9.2734375 C 18.586266 8.4524375 17.336734 8 16.052734 8 L 8.5 8 z M 27.644531 13 L 19.572266 19.724609 C 18.585266 20.546609 17.336734 21 16.052734 21 L 4 21 L 4 35.5 C 4 37.981 6.019 40 8.5 40 L 39.5 40 C 41.981 40 44 37.981 44 35.5 L 44 17.5 C 44 15.019 41.981 13 39.5 13 L 27.644531 13 z"
                            />
                        </svg>
                    </DialogButton>
        
                    <Dropdown
                        contextMenuPositionOptions={{ bMatchWidth: false }}
                        rgOptions={themes as any}
                        selectedOption={1}
                        strDefaultLabel={active}
                        onChange={updateThemeCallback as any}
                    />
                </Field>

                <Field
                    label={locale.themePanelInjectJavascript}
                    description={locale.themePanelInjectCSSToolTip}
                >
                    {jsState !== undefined && (
                        <Toggle value={jsState} onChange={onScriptToggle} />
                    )}
                </Field>

                <Field
                    label={locale.themePanelInjectCSS}
                    description={locale.themePanelInjectCSSToolTip}
                >
                    {cssState !== undefined && (
                        <Toggle value={cssState} onChange={onStyleToggle} />
                    )}
                </Field>
            </DialogBody>
        </>
    )
}

export { ThemeViewModal }