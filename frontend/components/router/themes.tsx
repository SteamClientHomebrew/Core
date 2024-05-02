import { useEffect, useState } from 'react'
import { Dropdown, DropdownOption } from '../dropdown'
import { Millennium, WindowType, WindowControls } from '../../millennium'
import { ComboItem, ThemeItem } from '../../types/theme'

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
        Millennium.callServerMethod("get_active_theme").then((value: any) => {
            const json = JSON.parse(value)
            json?.failed ? setActive("Default") : setActive(json?.data?.name ?? json.native)
        })
    }, [])

    return (
        <>
            <div className="DialogHeader">Themes</div>
            <div className="DialogBody aFxOaYcllWYkCfVYQJFs0">
                <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                    <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                        <div className="_3b0U-QDD-uhFpw6xM716fw">Client Theme</div>
                        <div className="_2ZQ9wHACVFqZcufK_WRGPM">

                            <button onClick={() => ShowThemeSettings(themes, active)} style={{margin: "0", padding: "0px 10px", marginRight: "10px"}} type="button" className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" tabIndex={0}>
                                <svg height={"16px"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path d="M28.1684 2.16431L23.5793 6.75343L29.2362 12.4103L33.8253 7.82116L28.1684 2.16431Z" fill="currentColor"></path><path d="M20.76 9.58999L5.67 24.67L4 32L11.33 30.33L26.41 15.24L20.76 9.58999Z" fill="currentColor"></path></svg>
                            </button>
                            
                            <Dropdown rgOptions={themes as any} selectedOption={1} strDefaultLabel={active} onChange={updateThemeCallback as any}></Dropdown>
                        </div>
                    </div>
                    <div className="_2OJfkxlD3X9p8Ygu1vR7Lr">Select the theme you want Steam to use (requires reload)</div>
                </div>        
            </div>
        </>
    )
}

export { ThemeViewModal }