import React from "react"
import ReactDOM from "react-dom"
import {
    DialogBody,
    DialogBodyText,
    DialogButtonPrimary,
    DialogButtonSecondary,
    DialogFooter,
    DialogHeader,
    MessageBoxResult,
} from "@millennium/ui"
import { locale } from "../locales"
import { RenderProps } from "../components/CreatePopup"
import { CreatePopupBase } from "../components/CreatePopupBase";
import { TitleBar } from "../components/TitleBar"

export class RenderComfirmModal extends CreatePopupBase {

    constructor(strMessage: string, strPopupName: string, options: any) {
        super(strPopupName, options) as any
        this.strMessage = strMessage
    }

    waitForResult() { 
        return new Promise((resolve) => {
            this.onClickConfirm = () => {
                resolve(MessageBoxResult.okay)
            } 
            this.onClickCancel = () => {
                resolve(MessageBoxResult.close)
            }
        })
    }

    Show() {
        super.Show()
        const RenderComponent: React.FC<RenderProps> = ({_window}) => {
            return (
                <>
                    <div className="PopupFullWindow">
                        <TitleBar popup={_window} hideMin={true} hideMax={true} hideActions={false}/>
                        <div className="DialogContent _DialogLayout GenericConfirmDialog _DialogCenterVertically">
                            <div className="DialogContent_InnerWidth">
                            <form>
                                <DialogHeader> Reload Required </DialogHeader>
                                <DialogBody>
                                    <DialogBodyText> {this.strMessage ?? locale.reloadRequiredBody}</DialogBodyText>
                                    <DialogFooter>
                                        <div className="DialogTwoColLayout _DialogColLayout Panel Focusable">
                                            <DialogButtonPrimary onClick={this.onClickConfirm}>Confirm </DialogButtonPrimary>
                                            <DialogButtonSecondary onClick={this.onClickCancel}>Cancel</DialogButtonSecondary>
                                        </div>
                                    </DialogFooter>
                                </DialogBody>
                            </form>
                            </div>
                        </div>
                    </div>
                </> 
            )
        }
        ReactDOM.render(<RenderComponent _window={super.window}/>, super.root_element)
    }

    SetTitle() {
        if (this.m_popup && this.m_popup.document) {
            this.m_popup.document.title = "WINDOW"
        }
    }

    Render(_window: Window, _element: HTMLElement) { }

    OnClose() { }

    OnLoad()  {
        const element: HTMLElement = (this.m_popup.document as Document).querySelector(".DialogContent_InnerWidth")
        const height = element?.getBoundingClientRect()?.height

        this.m_popup.SteamClient?.Window?.ResizeTo(450, height + 48, true)

        this.m_popup.SteamClient.Window.GetDefaultMonitorDimensions().then((result: any) => {
            const screenWidth = result.nFullWidth
            const screenHeight = result.nFullHeight
            
            this.m_popup.SteamClient.Window.MoveTo(screenWidth / 2 - 450 / 2, screenHeight / 2 - (height + 48) / 2)

            this.m_popup.SteamClient.Window.ShowWindow()
            this.m_popup.SteamClient.Window.BringToFront()
            this.m_popup.SteamClient.Window.FlashWindow()
        })
    }
}

export const PromptReload = (message?: string) => {
    return new Promise((resolve) => {
        const params: any = {
            title: locale.reloadRequired,
            popup_class: "fullheight",
            body_class: "fullheight ModalDialogBody DesktopUI ",
            html_class: "client_chat_frame fullheight ModalDialogPopup ",
            eCreationFlags: 274,
            window_opener_id: 1,
            dimensions: { width: 450, height: 375 },
            replace_existing_popup: false,
        }
    
        try {
            const popupWND = new RenderComfirmModal(message, "Reload", params)
            popupWND.waitForResult().then((result) => {
                resolve(result)
                popupWND.Close()
            })
            popupWND.OnClose = () => {
                console.log("message box closed")
                resolve(MessageBoxResult.close)
            }
            popupWND.Show()
        }
        catch (e) { }
    })
}