import { useEffect, useState } from 'react'
import { Millennium, DialogBody, DialogBodyText, DialogSubHeader, classMap, DialogHeader, IconsModule } from 'millennium-lib'

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
            <div className="__up-to-date-header" style={{marginTop: "-120px", color: "white", fontWeight: "500", fontSize: "15px"}}>No updates found. You're good to go!</div>
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
    const viewMoreClick = (props: UpdateItemType) => window.open(props?.commit, "_blank");
    
    const updateItemMessage = (updateObject: UpdateItemType, index: number) => 
    {
        setUpdating({ ...updating, [index]: true });
        Millennium.callServerMethod("update_theme", {native: updateObject.native}).then((success: boolean) => 
        {
            /** @todo: prompt user an error occured. */
            if (!success) return 

            Millennium.callServerMethod("get_cached_updates").then((result: any) => {
                setUpdates(JSON.parse(result))
            })
        })
    }

    return (
        <>
        <DialogSubHeader className='_2rK4YqGvSzXLj1bPZL8xMJ'>Updates Available!</DialogSubHeader>
        <DialogBodyText className='_3fPiC9QRyT5oJ6xePCVYz8'>Millennium found the following updates on your themes.</DialogBodyText>

        {updates.map((update: UpdateItemType, index: number) => (
            <div className="S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" key={index}>
                <div className={classMap.FieldLabelRow}>
                    <div className="update-item-type" style={{color: "white", fontSize: "12px", padding: "4px", background: "#007eff", borderRadius: "6px"}}>Theme</div>
                    <div className="_3b0U-QDD-uhFpw6xM716fw">{update.name}</div>
                    <div className={classMap.FieldChildrenWithIcon}>
                        <div className="_3N47t_-VlHS8JAEptE5rlR" style={{gap: "10px", width: "200px"}}>

                            <button 
                                onClick={() => viewMoreClick(update)} 
                                className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable">
                                    View More
                            </button>
                            <button 
                                onClick={() => updateItemMessage(update, index)} 
                                className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable">
                                    {updating[index] ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={classMap.FieldDescription}><b>Released:</b> {update?.date}</div>
                <div className={classMap.FieldDescription}><b>Patch Notes:</b> {update?.message}</div>
            </div>
        ))}
        </>
    )
} 

const UpdatesViewModal: React.FC = () => {

    const [updates, setUpdates] = useState<Array<UpdateItemType>>(null)
    const [checkingForUpdates, setCheckingForUpdates] = useState<boolean>(false)
    
    useEffect(() => {
        Millennium.callServerMethod("get_cached_updates").then((result: any) => {
            console.log(result)
            setUpdates(JSON.parse(result))
        })
    }, [])

    const checkForUpdates = async () => {
        if (checkingForUpdates) return 
        
        setCheckingForUpdates(true)
        await Millennium.callServerMethod("initialize_repositories")

        Millennium.callServerMethod("get_cached_updates").then((result: any) => {
            setUpdates(JSON.parse(result))
            setCheckingForUpdates(false)
        })
    }

    const DialogHeaderStyles: any = {
        display: "flex", alignItems: "center", gap: "15px"
    }

    return (
        <>
            <DialogHeader style={DialogHeaderStyles}>
                Updates
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
                {updates && (!updates.length ? <UpToDateModal/> : <RenderAvailableUpdates updates={updates} setUpdates={setUpdates}/>)}   
            </DialogBody>
        </>
    )
}

export { UpdatesViewModal }