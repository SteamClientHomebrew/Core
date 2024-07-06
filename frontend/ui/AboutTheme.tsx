import { Millennium, pluginSelf } from "@millennium/ui"
import { ThemeItem } from "../components/types"
import { CreatePopup } from "../components/Popups"
import React from "react"
import { locale } from "../locales";

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

        return (
            <>
            <style>
                {`
                ._3oeHwxQTKDkPcxDhz8jbhM.online:hover {
                    cursor: pointer !important;
                }
                
                ._1YGAHSfGavQI6MODJq-pJB.avatarHolder.no-drag.Medium.online,
                .online._2317WeOq8zJVeOi6ILQbF8._27M2GicEvwcoEI5R0FSKi9 {
                    pointer-events: none;
                }`}
            </style>

            <div className="_3oeHwxQTKDkPcxDhz8jbhM online" onClick={OpenDeveloperProfile}>
                <div className="_1YGAHSfGavQI6MODJq-pJB avatarHolder no-drag Medium online">
                    <div className="_1yIzy56YfJIliF6ykwhP2r avatarStatus right" />
                    <img src={
                        this.activeTheme?.data?.github?.owner ? 
                        `https://github.com/${this.activeTheme?.data?.github?.owner}.png`: 
                        'https://i.pinimg.com/736x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg'       
                    } className="_1p_QrI3ixF-RAwnxad9pEm avatar" draggable="false" />
                </div>
                <div className="online _2317WeOq8zJVeOi6ILQbF8 _27M2GicEvwcoEI5R0FSKi9">
                    <div className="_3n8q82Bm3oNKRPFbrZOlo8">
                        <div className="r62qzcdJQ0qezZglOtiUX">{this.activeTheme?.data?.github?.owner ?? this.activeTheme?.data?.author ?? locale.aboutThemeAnonymous}
                            {/* <span className="_3T-9PkwXmTHyFu3b1pAn2O">(Author)</span> */}
                        </div>
                    </div>
                    <div className="_2nrSdZqzl3e01VZleoVaWp" style={{ width: "100%" }}>
                        <div className="_2wpaptjZY-3Gn1HOPlL85O _1k82NiWym4STegDGxRBHz2 no-drag">✅ {locale.aboutThemeVerifiedDev}</div>
                    </div>
                </div>
            </div>
            </>
        )
    }

    RenderDescription = () => {
        return (
            <>
                <div className="DialogSubHeader _2rK4YqGvSzXLj1bPZL8xMJ">{locale.aboutThemeTitle}</div>
                <div className="DialogBodyText _3fPiC9QRyT5oJ6xePCVYz8">{this.activeTheme?.data?.description ?? locale.itemNoDescription}</div>
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
            Millennium.callServerMethod("Millennium.steam_path").then((path: string) => {
                console.log(path)
                SteamClient.System.OpenLocalDirectoryInSystemExplorer(`${path}/steamui/skins/${this.activeTheme.native}`)
            })
        }

        const UninstallTheme = () => {
            Millennium.callServerMethod("uninstall_theme", {
                owner: this.activeTheme?.data?.github?.owner,
                repo: this.activeTheme?.data?.github?.repo_name
            })
            .then((raw: string) => {

                const message = JSON.parse(raw)
                console.log(message)

                SteamClient.Browser.RestartJSContext()
            })
        }

        return (
            <>
                {themeOwner && themeRepo && <button type="button" style={{width: "unset"}} className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" onClick={ShowSource}>{locale.viewSourceCode}</button>}
                {/* {kofiDonate && <button type="button" style={{width: "unset"}} className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" onClick={OpenDonateDefault}>Donate</button>} */}

                <div className=".flex-btn-container" style={{display: "flex", gap: "5px"}}>
                    <button type="button" style={{width: "50%", }} className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" onClick={ShowInFolder}>{locale.showInFolder}</button>
                    <button type="button" style={{width: "50%"}} className="_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" onClick={UninstallTheme}>{locale.uninstall}</button> 
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