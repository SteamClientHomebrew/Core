import { useEffect, useState } from 'react'
import { Millennium, WindowType, WindowControls, Dropdown, DialogHeader, DialogBody, classMap, IconsModule, pluginSelf } from 'millennium-lib'
import { ComboItem, ThemeItem } from '../../types/types'

const ShowThemeSettings = (themes: ComboItem[], active: string) => {
    
    const { theme } = themes.find((theme) => theme.theme.native === active)
    console.log(theme?.data?.name)

    const context: WindowType = {
        minimumDimensions: {
            width: 0, height: 0
        },
        dimensions: {
            width: 600, height: 450
        },
        title: "Editing " + theme?.data?.name ?? theme?.native,
        controls: WindowControls.Close | WindowControls.Minimize,
        emptyDocument: false,
        autoShow: true
    }

    console.log(context)
    Millennium.createWindow(context)
}

interface EditThemeProps {
    themes: ComboItem[],
    active: string
}

const RenderEditTheme: React.FC<EditThemeProps> = ({ themes, active }) => {

    /** Current theme is not editable */
    if (pluginSelf.isDefaultTheme || (pluginSelf.activeTheme as ThemeItem).data?.Conditions === undefined) {
        return (<></>)
    }

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

const ThemeViewModal: React.FC = () => {

    const [themes, setThemes] = useState<ComboItem[]>()
    const [active, setActive] = useState<string>()

    const updateThemeCallback = (data: ComboItem) => {
        Millennium.callServerMethod("change_theme", {theme_name: data.theme.native})
        window.location.reload()
    }
    
    useEffect(() => {
        Millennium.callServerMethod("find_all_themes").then((value: any) => {

            let buffer: ComboItem[] = JSON.parse(value).map((theme: ThemeItem, index: number) => ({
                label: theme?.data?.name ?? theme.native, 
                theme: theme,
                data: "theme" + index
            }))
            setThemes(buffer)
        })

        const activeTheme: ThemeItem = pluginSelf.activeTheme
        pluginSelf.isDefaultTheme ? setActive("Default") : activeTheme?.data?.name ?? activeTheme.native
    }, [])

    return (
        <>
            <DialogHeader>Themes</DialogHeader>
            <DialogBody className={classMap.SettingsDialogBodyFade}>
                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className={classMap.FieldLabelRow}>
                        <div className="_3b0U-QDD-uhFpw6xM716fw">Client Theme</div>
                        <div className={classMap.FieldChildrenWithIcon}>

                            <RenderEditTheme themes={themes} active={active}/>
                            <Dropdown rgOptions={themes as any} selectedOption={1} strDefaultLabel={active} onChange={updateThemeCallback as any}></Dropdown>        
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>Select the theme you want Steam to use (requires reload)</div>
                </div> 
            </DialogBody>
        </>
    )
}

export { ThemeViewModal }