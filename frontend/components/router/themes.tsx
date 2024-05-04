import { useEffect, useState } from 'react'
import { Millennium, Dropdown, DialogHeader, DialogBody, classMap, IconsModule, pluginSelf, ShowModalProps, Toggle, ConfirmModal, ShowMessageBox, ConfirmModalProps, MessageBoxResult } from 'millennium-lib'
import { RenderThemeEditor } from './themeEditor'
import { ComboItem, ThemeItem } from '../../types/types'

const PromptReload = async () => {
    const windowOptions: ShowModalProps = {
        strTitle: "Reload Required",
        bHideMainWindowForPopouts: false,
        popupHeight: 225,
        popupWidth: 425,
    }

    const modalProps: ConfirmModalProps = {
        strTitle: "Reload Required",
        strDescription: "Selected changes need a reload in order to take affect. Should we restart right now?"
    }

    return await ShowMessageBox(windowOptions, modalProps) as MessageBoxResult
}

const ShowThemeSettings = async (_themes: ComboItem[], _active: string) => {

    const windowOptions: ShowModalProps = {
        strTitle: "Reload Required",
        bHideMainWindowForPopouts: false,
        popupHeight: 225,
        popupWidth: 425,
    }

    const modalProps: ConfirmModalProps = {
        strTitle: "Reload Required",
        strDescription: "Selected changes need a reload in order to take affect. Should we restart right now?"
    }

    const result: MessageBoxResult = await ShowMessageBox(windowOptions, modalProps)
}

interface EditThemeProps {
    themes: ComboItem[],
    active: string
}

const RenderEditTheme: React.FC<EditThemeProps> = ({ themes, active }) => {

    /** Current theme is not editable */
    // if (pluginSelf.isDefaultTheme || (pluginSelf.activeTheme as ThemeItem).data?.Conditions === undefined) {
    //     return (<></>)
    // }

    return (
        <button 
            onClick={() => ShowThemeSettings(themes, active)} 
            style={{margin: "0", padding: "0px 10px", marginRight: "10px"}} 
            className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" 
        >
            <IconsModule.Edit style={{height: "16px"}}/>
        </button>
    )
}

/** 
 * Dialog Dropdowns don't calculate width positioning properly, this fixed that. 
 */
const OnMenuOpened = async () => {

    const dialogMenu: HTMLElement = (await Millennium.findElement(pluginSelf.settingsDoc, ".DialogDropDown._DialogInputContainer.Active"))[0]
    const openMenu: HTMLElement = (await Millennium.findElement(pluginSelf.settingsDoc, ".DialogMenuPosition"))[0]

    openMenu.style.width = "max-content"

    const dialogMenuPos: DOMRect = dialogMenu.getBoundingClientRect()
    const openMenuPosition: DOMRect = openMenu.getBoundingClientRect()

    openMenu.style.left = (dialogMenuPos.x + dialogMenuPos.width) - openMenuPosition.width + "px"
}

const findAllThemes = async (): Promise<ComboItem[]> => {
    
    const activeTheme: ThemeItem = await Millennium.callServerMethod("cfg.get_active_theme")

    return new Promise<ComboItem[]>(async (resolve) => {
        const themes = JSON.parse(await Millennium.callServerMethod("find_all_themes")) as ThemeItem[]

        /** Prevent the selected theme from appearing in combo box */
        const themeMap = themes.filter((theme: ThemeItem) => !pluginSelf.isDefaultTheme ? theme.native !== activeTheme.native : true)

        let buffer: ComboItem[] = themeMap.map((theme: ThemeItem, index: number) => ({ label: theme?.data?.name ?? theme.native,  theme: theme, data: "theme" + index }))

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
        pluginSelf.isDefaultTheme ? setActive("Default") : setActive(activeTheme?.data?.name ?? activeTheme.native)

        findAllThemes().then((result: ComboItem[]) => setThemes(result))

        Millennium.callServerMethod("cfg.get_config_str").then((value: string) => {
            const json = JSON.parse(value)

            setJsState(json.scripts)
            setCssState(json.styles)
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
                window.location.reload()
            }
        })
    }

    const updateThemeCallback = (item: ComboItem) => {
        const themeName = item.data === "default" ? "__default__" : item.theme.native;

        Millennium.callServerMethod("cfg.change_theme", {theme_name: themeName});
        findAllThemes().then((result: ComboItem[]) => setThemes(result))

        // pluginSelf.activeTheme = themes.find((theme: ComboItem) => theme?.theme?.native === item?.theme?.native).theme 

        PromptReload().then((selection: MessageBoxResult) => {
            if (selection == MessageBoxResult.okay) {
                window.location.reload()
            }
        })
    }
    

    return (
        <>
            <DialogHeader>Themes</DialogHeader>
            <DialogBody className={classMap.SettingsDialogBodyFade}>

{/* 
                <div style={{display: "flex", width: "250px"}}>
                    <TextField placeholder='Type here to search...' style={{height: "14px"}}></TextField>
                    <ButtonItem tooltip='Open themes folder...' bottomSeparator={"none"}>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="24px" height="24px" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                            <path d="M343 4505 c-170 -46 -301 -185 -333 -354 -14 -74 -14 -3108 0 -3182 32 -169 156 -302 329 -353 50 -14 258 -16 2221 -16 1963 0 2171 2 2221 16 174 52 298 185 329 355 7 37 9 499 7 1365 -3 1454 3 1343 -70 1456 -71 111 -192 190 -319 208 -35 5 -531 10 -1103 10 l-1040 1 -185 221 c-102 122 -199 236 -216 255 l-31 33 -879 -1 c-723 0 -888 -3 -931 -14z"/>
                            </g>
                        </svg>
                    </ButtonItem>
                </div> */}

                <style>{`.DialogDropDown._DialogInputContainer.Panel.Focusable {min-width: fit-content;}`}</style>

                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                        <div className="_3b0U-QDD-uhFpw6xM716fw">Client Theme</div>
                        <div className={classMap.FieldChildrenWithIcon}>

                            <RenderEditTheme themes={themes} active={active}/>
                            <Dropdown onMenuOpened={OnMenuOpened} rgOptions={themes as any} selectedOption={1} strDefaultLabel={active} onChange={updateThemeCallback as any}></Dropdown>        
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>Select the theme you want Steam to use (requires reload)</div>
                </div> 
                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                        <div className="_3b0U-QDD-uhFpw6xM716fw">Inject Javascript</div>
                        <div className={classMap.FieldChildrenWithIcon}>

                            { jsState !== undefined && <Toggle value={jsState} onChange={onScriptToggle}></Toggle> }
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>Decide whether themes are allowed to insert javascript into Steam. Disabling javascript may break Steam interface as a byproduct (requires reload)</div>
                </div> 
                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                        <div className="_3b0U-QDD-uhFpw6xM716fw">Inject StyleSheets</div>
                        <div className={classMap.FieldChildrenWithIcon}>
                            { cssState !== undefined && <Toggle value={cssState} onChange={onStyleToggle}></Toggle> }
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>Decide whether themes are allowed to insert stylesheets into Steam. (requires reload)</div>
                </div> 
            </DialogBody>
        </>
    )
}

export { ThemeViewModal }