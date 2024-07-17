import { Classes, findClassModule, Millennium, pluginSelf } from "@millennium/ui"
import { ThemeItem } from "../components/types"
import { CreatePopup } from "../components/Popups"
import React from "react"
import { locale } from "../locales";

const settingsClasses = findClassModule(m => m.SettingsDialogFatButton) as any

class AboutThemeRenderer extends React.Component<any> {
    
    activeTheme: ThemeItem;

    constructor(props: any) {
        super(props)

        this.activeTheme = pluginSelf.activeTheme
    }

    RenderDeveloperProfile = () => {

        const OpenDeveloperProfile = () => {
            this.activeTheme?.data?.github?.owner 
            && SteamClient.System.OpenInSystemBrowser(`https://github.com/${this.activeTheme?.data?.github?.owner}/`)
        }

        const devClasses = findClassModule(m => m.richPresenceLabel && m.blocked) as any

        return (
            <>
            <style>
                {`
                .${Classes.FakeFriend}.online:hover {
                    cursor: pointer !important;
                }
                
                .${Classes.avatarHolder}.avatarHolder.no-drag.Medium.online,
                .online.${devClasses.noContextMenu}.${devClasses.twoLine} {
                    pointer-events: none;
                }`}
            </style>

            <div className={`${Classes.FakeFriend} online`} onClick={OpenDeveloperProfile}>
                <div className={`${Classes.avatarHolder} avatarHolder no-drag Medium online`}>
                    <div className={`${Classes.avatarStatus} avatarStatus right`} />
                    <img src={
                        this.activeTheme?.data?.github?.owner ? 
                        `https://github.com/${this.activeTheme?.data?.github?.owner}.png`: 
                        'https://i.pinimg.com/736x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg'       
                    } className={`${Classes.avatar} avatar`} draggable="false" />
                </div>
                <div className={`online ${Classes.noContextMenu} ${Classes.twoLine}`}>
                    <div className={Classes.statusAndName}>
                        <div className={Classes.playerName}>{this.activeTheme?.data?.github?.owner ?? this.activeTheme?.data?.author ?? locale.aboutThemeAnonymous}
                            {/* <span className="_3T-9PkwXmTHyFu3b1pAn2O">(Author)</span> */}
                        </div>
                    </div>
                    <div className={Classes.richPresenceContainer} style={{ width: "100%" }}>
                        <div className={`${Classes.gameName} ${Classes.richPresenceLabel} no-drag`}>✅ {locale.aboutThemeVerifiedDev}</div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    RenderDescription = () => {
        return (
            <>
                <div className={`DialogSubHeader ${settingsClasses.SettingsDialogSubHeader}`}>{locale.aboutThemeTitle}</div>
                <div className={`DialogBodyText ${Classes.FriendsDescription}`}>{this.activeTheme?.data?.description ?? locale.itemNoDescription}</div>
            </>
        )
    }

    RenderInfoRow = () => {

        const themeOwner = this.activeTheme?.data?.github?.owner
        const themeRepo = this.activeTheme?.data?.github?.repo_name
        const kofiDonate = this.activeTheme?.data?.funding?.kofi

        const ShowSource = () => {
            SteamClient.System.OpenInSystemBrowser(`https://github.com/${themeOwner}/${themeRepo}`)
        }

        const OpenDonateDefault = () => {
            SteamClient.System.OpenInSystemBrowser(`https://ko-fi.com/${kofiDonate}`)
        }

        const ShowInFolder = () => {
            Millennium.callServerMethod("Millennium.steam_path")
            .then((result: any) => {
                pluginSelf.connectionFailed = false
                return result
            })
            .then((path: string) => {
                console.log(path)
                SteamClient.System.OpenLocalDirectoryInSystemExplorer(`${path}/steamui/skins/${this.activeTheme.native}`)
            })
        }

        const UninstallTheme = () => {
            Millennium.callServerMethod("uninstall_theme", {
                owner: this.activeTheme?.data?.github?.owner,
                repo: this.activeTheme?.data?.github?.repo_name
            })
            .then((result: any) => {
                pluginSelf.connectionFailed = false
                return result
            })
            .then((raw: string) => {

                const message = JSON.parse(raw)
                console.log(message)

                SteamClient.Browser.RestartJSContext()
            })
        }

        return (
            <>
                {themeOwner && themeRepo && <button type="button" style={{width: "unset"}} className={`${settingsClasses.SettingsDialogButton} DialogButton _DialogLayout Secondary Focusable`} onClick={ShowSource}>{locale.viewSourceCode}</button>}
                {/* {kofiDonate && <button type="button" style={{width: "unset"}} className={`${settingsClasses.SettingsDialogButton} DialogButton _DialogLayout Secondary Focusable`} onClick={OpenDonateDefault}>Donate</button>} */}

                <div className=".flex-btn-container" style={{display: "flex", gap: "5px"}}>
                    <button type="button" style={{width: "50%", }} className={`${settingsClasses.SettingsDialogButton} DialogButton _DialogLayout Secondary Focusable`} onClick={ShowInFolder}>{locale.showInFolder}</button>
                    <button type="button" style={{width: "50%"}} className={`${settingsClasses.SettingsDialogButton} DialogButton _DialogLayout Secondary Focusable`} onClick={UninstallTheme}>{locale.uninstall}</button> 
                </div>
            </>
        )
    }

    CreateModalBody = () => {
        return (
            <div className="ModalPosition" tabIndex={0}>
                <div className="ModalPosition_Content" style={{width: "100vw", height: "100vh"}}>
                    <div className="DialogContent _DialogLayout GenericConfirmDialog _DialogCenterVertically">
                        <div className="DialogContent_InnerWidth" style={{flex: "unset"}}>
                            <div className="DialogHeader">{this.activeTheme?.data?.name ?? this.activeTheme?.native}</div>
                            <div className="DialogBody Panel Focusable" style={{flex: "unset"}}>
                                <this.RenderDeveloperProfile/>
                                <this.RenderDescription/>
                                <this.RenderInfoRow/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <this.CreateModalBody/>
        )
    }
}


export const SetupAboutRenderer = (active: string) => {
    const params: any = {
        title: locale.aboutThemeTitle + " " + active,
        popup_class: "fullheight",
        body_class: "fullheight ModalDialogBody DesktopUI ",
        html_class: "client_chat_frame fullheight ModalDialogPopup ",
        eCreationFlags: 274,
        window_opener_id: 1,
        dimensions: {width: 450, height: 375},
        replace_existing_popup: false,
    }

    const popupWND = new CreatePopup(AboutThemeRenderer, "about_theme", params)
    popupWND.Show()
}