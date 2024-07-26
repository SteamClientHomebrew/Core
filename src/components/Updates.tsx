import { useEffect, useState } from 'react'
import { Millennium, DialogBody, DialogBodyText, DialogSubHeader, classMap, DialogHeader, IconsModule, pluginSelf, Toggle, Classes } from '@millennium/ui'
import { locale } from '../locales';
import { ThemeItem } from '../types';
import { Settings } from '../Settings';
import { ConnectionFailed } from './ConnectionFailed';
import { FieldClasses } from '../classes';

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

interface UpdateProps {
    updates: UpdateItemType[];
    setUpdates: React.Dispatch<React.SetStateAction<UpdateItemType[]>>
}

interface UpdateItemType {
    message: string, // Commit message
    date: string, // Humanized since timestamp
    commit: string, // Full GitHub commit URI
    native: string, // Folder name in skins folder. 
    name: string // Common display name
}

const UpToDateModal: React.FC  = () => {

    return (
        <div className="__up-to-date-container" style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", height: "100%", justifyContent: "center"
        }}>
            <div className="__up-to-date-header" style={{marginTop: "-120px", color: "white", fontWeight: "500", fontSize: "15px"}}>{locale.updatePanelNoUpdatesFound}</div>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: "40px"}}>
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="#55bd00"></path>
                </g>
            </svg>
        </div>
    )
}

const RenderAvailableUpdates: React.FC<UpdateProps> = ({ updates, setUpdates }) => {
    
    const [updating, setUpdating] = useState<Array<any>>([])
    const viewMoreClick = (props: UpdateItemType) => SteamClient.System.OpenInSystemBrowser(props?.commit)
    
    const updateItemMessage = (updateObject: UpdateItemType, index: number) => 
    {
        setUpdating({ ...updating, [index]: true });
        Millennium.callServerMethod("updater.update_theme", {native: updateObject.native})
        .then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        })
        .then((success: boolean) => 
        {
            /** @todo: prompt user an error occured. */
            if (!success) return 

            const activeTheme: ThemeItem = pluginSelf.activeTheme

            // the current theme was just updated, so reload SteamUI
            if (activeTheme?.native === updateObject?.native) {
                SteamClient.Browser.RestartJSContext()
            }

            Millennium.callServerMethod("updater.get_update_list")
            .then((result: any) => {
                pluginSelf.connectionFailed = false
                return result
            })
            .then((result: any) => {
                setUpdates(JSON.parse(result).updates)
            })
        })
    }

    return (
        <>
        <DialogSubHeader className='_2rK4YqGvSzXLj1bPZL8xMJ'>{locale.updatePanelHasUpdates}</DialogSubHeader>
        <DialogBodyText className='_3fPiC9QRyT5oJ6xePCVYz8'>{locale.updatePanelHasUpdatesSub}</DialogBodyText>

        {updates.map((update: UpdateItemType, index: number) => (
            <div className={containerClasses} key={index}>
                <div className={classMap.FieldLabelRow}>
                    <div className="update-item-type" style={{color: "white", fontSize: "12px", padding: "4px", background: "#007eff", borderRadius: "6px"}}>Theme</div>
                    <div className={FieldClasses.FieldLabel}>{update.name}</div>
                    <div className={classMap.FieldChildrenWithIcon}>
                        <div className={Classes.FieldChildrenInner} style={{gap: "10px", width: "200px"}}>

                            <button 
                                onClick={() => viewMoreClick(update)} 
                                className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable">
                                    {locale.ViewMore}
                            </button>
                            <button 
                                onClick={() => updateItemMessage(update, index)} 
                                className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable">
                                    {updating[index] ? locale.updatePanelIsUpdating : locale.updatePanelUpdate}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={classMap.FieldDescription}><b>{locale.updatePanelReleasedTag}</b> {update?.date}</div>
                <div className={classMap.FieldDescription}><b>{locale.updatePanelReleasePatchNotes}</b> {update?.message}</div>
            </div>
        ))}
        </>
    )
} 

const UpdatesViewModal: React.FC = () => {

    const [updates, setUpdates] = useState<Array<UpdateItemType>>(null)
    const [checkingForUpdates, setCheckingForUpdates] = useState<boolean>(false)
    const [showUpdateNotifications, setNotifications] = useState<boolean>(undefined)
    
    useEffect(() => {
        Millennium.callServerMethod("updater.get_update_list")
        .then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        })
        .then((result: any) => {
            
            const updates = JSON.parse(result)
            console.log(updates)

            setUpdates(updates.updates)
            setNotifications(updates.notifications ?? false)
        })
        .catch((_: any) => {
            console.error("Failed to fetch updates")
            pluginSelf.connectionFailed = true
        })
    }, [])

    const checkForUpdates = async () => {
        if (checkingForUpdates) return 
        
        setCheckingForUpdates(true)
        await Millennium.callServerMethod("updater.re_initialize")

        Millennium.callServerMethod("updater.get_update_list")
        .then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        })
        .then((result: any) => {
            setUpdates(JSON.parse(result).updates)
            setCheckingForUpdates(false)
        })
        .catch((_: any) => {
            console.error("Failed to fetch updates")
            pluginSelf.connectionFailed = true
        })
    }

    const DialogHeaderStyles: any = {
        display: "flex", alignItems: "center", gap: "15px"
    }

    const OnNotificationsChange = (enabled: boolean) => {

        Millennium.callServerMethod("updater.set_update_notifs_status", { status: enabled})
        .then((result: any) => {
            pluginSelf.connectionFailed = false
            return result
        })
        .then((success: boolean) => {
            if (success) {
                setNotifications(enabled)
                Settings.FetchAllSettings()
            }
        })
    }

    if (pluginSelf.connectionFailed) {
        return <ConnectionFailed/>
    }

    return (
        <>
            <DialogHeader style={DialogHeaderStyles}>
                {locale.settingsPanelUpdates}
                {
                    !checkingForUpdates && 
                    <button 
                        onClick={checkForUpdates} 
                        className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" 
                        style={{width: "16px", "-webkit-app-region": "no-drag", zIndex: "9999", padding: "4px 4px", display: "flex"} as any}>
                        <IconsModule.Update/>
                    </button>
                }
            </DialogHeader>
            <DialogBody className={classMap.SettingsDialogBodyFade}>
                <div className={containerClasses}>
                    <div className={FieldClasses.FieldLabelRow}>
                        <div className={FieldClasses.FieldLabel}>{locale.updatePanelUpdateNotifications}</div>
                        <div className={classMap.FieldChildrenWithIcon}>

                            { showUpdateNotifications !== undefined && <Toggle value={showUpdateNotifications} onChange={OnNotificationsChange}></Toggle> }
                        </div>
                    </div>
                    <div className={classMap.FieldDescription}>{locale.updatePanelUpdateNotificationsTooltip}</div>
                </div> 
                {updates && (!updates.length ? <UpToDateModal/> : <RenderAvailableUpdates updates={updates} setUpdates={setUpdates}/>)}   
            </DialogBody>
        </>
    )
}

export { UpdatesViewModal }