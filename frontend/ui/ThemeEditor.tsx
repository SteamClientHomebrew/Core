import React, { useState } from "react"
import { Dropdown, Millennium, SingleDropdownOption, Toggle, classMap, pluginSelf } from "@millennium/ui"
import { Conditions, ConditionsStore, ICondition, ThemeItem } from "../components/types"

interface ConditionalComponent {
    condition: string,
    value: ICondition,
    store: ConditionsStore
}

interface ComponentInterface {
    conditionType: ConditionType, 
    values: string[], 
    conditionName: string,
    store: ConditionsStore
}

enum ConditionType {
    Dropdown,
    Toggle
}

export class RenderThemeEditor extends React.Component {

    GetConditionType = (value: any): ConditionType => {

        if (Object.keys(value).every((element: string) => element === 'yes' || element === 'no')) {
            return ConditionType.Toggle
        }
        else {
            return ConditionType.Dropdown
        }
    }
    
    UpdateLocalCondition = (conditionName: string, newData: string) => {
        const activeTheme: ThemeItem = pluginSelf.activeTheme as ThemeItem
    
        return new Promise<boolean>((resolve) => {
            Millennium.callServerMethod("cfg.change_condition", {
                theme: activeTheme.native, newData: newData, condition: conditionName
            })
            .then((response: any) => {

                const success = JSON.parse(response)?.success as boolean ?? false

                success && (pluginSelf.ConditionConfigHasChanged = true)
                resolve(success)
            })
        })
    }
    
    RenderComponentInterface: React.FC<ComponentInterface> = ({ conditionType, values, store, conditionName }) => {
    
        /** Dropdown items if given that the component is a dropdown */
        const items = values.map((value: string, index: number) => ({ label: value, data: "componentId" + index }))
    
        /** Checked status if given that the component is a toggle */
        const [checked, setChecked] = useState(store?.[conditionName] == "yes" ? true : false)
        // const [isHovered, setIsHovered] = useState({state: false, target: null});
    
        const onCheckChange = (enabled: boolean) => {
    
            this.UpdateLocalCondition(conditionName, enabled ? "yes" : "no").then((success) => {
                success && setChecked(enabled)
            })
        }
    
        const onDropdownChange = (data: SingleDropdownOption) => {
            this.UpdateLocalCondition(conditionName, data.label as string)
        }

        switch (conditionType) {
            case ConditionType.Dropdown: 
                // @ts-ignore
                return <Dropdown contextMenuPositionOptions={{bMatchWidth: false}} onChange={onDropdownChange} rgOptions={items} selectedOption={1} strDefaultLabel={store[conditionName]}/>
    
            case ConditionType.Toggle:
                return <Toggle value={checked} onChange={onCheckChange} />
        }
    }
    
    RenderComponent: React.FC<ConditionalComponent> = ({condition, value, store}) => {
    
        const conditionType: ConditionType = this.GetConditionType(value.values)
    
        return (
            <div key={condition} className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel">
                <div className="H9WOq6bV_VhQ4QjJS_Bxg">
                    <div className="_3b0U-QDD-uhFpw6xM716fw">{condition}</div>
                    <div className={classMap.FieldChildrenWithIcon}>
                        <this.RenderComponentInterface conditionType={conditionType} store={store} conditionName={condition} values={Object.keys(value?.values)} />
                    </div>
                </div>
                <div className={classMap.FieldDescription} dangerouslySetInnerHTML={{__html: value?.description ?? "No description yet."}}>
                </div>
            </div> 
        )
    }
    
    render() {
        const activeTheme: ThemeItem = pluginSelf.activeTheme as ThemeItem
    
        const themeConditions: Conditions = activeTheme.data.Conditions
        const savedConditions = pluginSelf?.conditionals?.[activeTheme.native] as ConditionsStore
    
        return (


            <div className="ModalPosition" tabIndex={0}>

                <style>{`.DialogBody.aFxOaYcllWYkCfVYQJFs0:last-child { padding-bottom: 65px; }`}</style>

                <div className="ModalPosition_Content" style={{width: "100vw", height: "100vh"}}>
                    <div className="_3I6h_oySuLmmLY9TjIKT9s _3few7361SOf4k_YuKCmM62 MzjwfxXSiSauz8kyEuhYO Panel">
                        <div className="DialogContentTransition Panel" style={{minWidth: "100vw"}}>
                            <div className="DialogContent _DialogLayout _1I3NifxqTHCkE-2DeritAs ">
                                <div className="DialogContent_InnerWidth">
                                    <div className="DialogHeader">Editing {activeTheme?.data?.name ?? activeTheme.native}</div>
                                    <div className="DialogBody aFxOaYcllWYkCfVYQJFs0">
                                        {Object.entries(themeConditions).map(([key, value]) => <this.RenderComponent condition={key} store={savedConditions} value={value}/>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}