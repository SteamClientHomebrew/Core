// import React, { useEffect, useState } from 'react';
// import { Millennium } from '../../millennium';
import { useEffect, useState } from 'react'
import { Dropdown } from '../dropdown'
import { Millennium } from '../../millennium'

const ThemeViewModal: React.FC = () => {

    const [themes, setThemes] = useState<any>()
    const [active, setActive] = useState<any>()

    const updateThemeCallback = (_data: any) => {
        //setSelected(_data)
        console.log(_data.theme["native-name"])

        Millennium.callServerMethod("change_theme", {plugin_name: _data.theme["native-name"]})
        window.location.reload()
    }
    
    useEffect(() => {
        Millennium.callServerMethod("find_all_themes").then((value: any) => {
            const json = JSON.parse(value)
            let themeBuffer: any = []

            json.forEach((theme: any, index: number) => {
                themeBuffer.push({
                    label: theme?.data?.name ?? theme["native-name"], data: `theme_${index}`, theme: theme
                })
            });
            setThemes(themeBuffer)
        })
        Millennium.callServerMethod("get_active_theme").then((value: any) => {
            const json = JSON.parse(value)
            setActive(json?.data?.name ?? json["native-name"])
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
                            <Dropdown rgOptions={themes} selectedOption={1} strDefaultLabel={active} contextMenuPositionOptions={"Left"} onChange={updateThemeCallback}></Dropdown>
                        </div>
                    </div>
                    <div className="_2OJfkxlD3X9p8Ygu1vR7Lr">Select the theme you want Steam to use (requires reload)</div>
                </div>        
            </div>
        </>
    )
}

export { ThemeViewModal }