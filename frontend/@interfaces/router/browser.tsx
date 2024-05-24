import { findModuleChild } from "millennium-lib";
import ReactDOM from "react-dom";
import { RenderThemeEditor } from "./ThemeEditor";
import { ReactNode } from "react";

export const CreatePopupBase: any = findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) {
      if (typeof m[prop] === 'function' && m[prop].toString().includes('CreatePopup(this.m_strName,this.m_rgParams))')) {
        return m[prop]
      }
    }
});

const TitleBarControls: any = findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) { if (typeof m[prop] === 'function' && m[prop].toString().includes('className:"title-area-highlight"')) { return m[prop] } }
});

interface RenderProps {
    _window: Window
}

export class CreatePopup extends CreatePopupBase {

    constructor(component: ReactNode, strPopupName: string, options: any) {
        super(strPopupName, options) as any
        this.component = component
    }

    Show() {
        super.Show()
        const RenderComponent: React.FC<RenderProps> = ({_window}) => {

            return (
                <>
                    <div 
                        className="PopupFullWindow"
                        onContextMenu={((_e) => {
                            // console.log('CONTEXT MENU OPEN')
                            // _e.preventDefault()

                            // this.contextMenuHandler.CreateContextMenuInstance(_e)
                        })}
                        >
                        <TitleBarControls
                            popup={_window}
                            hideMin={false}
                            hideMax={false}
                            hideActions={false}
                        />
                        <this.component/>
        
                    </div>
                </>
        
            )
        }

        console.log(super.root_element)
        ReactDOM.render(<RenderComponent _window={super.window}/>, super.root_element)
    }

    SetTitle() {
        console.log("[internal] setting title ->", this)

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
        this.m_popup.SteamClient.Window.ShowWindow()
    }
}