import React, { useState } from "react"
import { Classes, Dropdown, Millennium, SingleDropdownOption, Toggle, classMap, pluginSelf } from "@millennium/ui"
import { Conditions, ConditionsStore, ICondition, ThemeItem } from "../components/types"
import { FieldClasses } from "../components/Classes"

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
            .then((result: any) => {
                pluginSelf.connectionFailed = false
                return result
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

        return (
            <div key={condition} className={containerClasses}>
                <div className={FieldClasses.FieldLabelRow}>
                    <div className={FieldClasses.FieldLabel}>{condition}</div>
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

                <style>{`.DialogBody.${Classes.SettingsDialogBodyFade}:last-child { padding-bottom: 65px; }`}</style>

                <div className="ModalPosition_Content" style={{width: "100vw", height: "100vh"}}>
                    <div className={`${Classes.PagedSettingsDialog} ${Classes.SettingsModal} ${Classes.DesktopPopup} Panel`}>
                        <div className="DialogContentTransition Panel" style={{minWidth: "100vw"}}>
                            <div className={`DialogContent _DialogLayout ${Classes.PagedSettingsDialog_PageContent} `}>
                                <div className="DialogContent_InnerWidth">
                                    <div className="DialogHeader">Editing {activeTheme?.data?.name ?? activeTheme.native}</div>
                                    <div className={`DialogBody ${Classes.SettingsDialogBodyFade}`}>
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