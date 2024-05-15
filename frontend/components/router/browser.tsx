import { CommonUIModule, ConfirmModal, findAllModules, findModuleChild } from "millennium-lib";
import ReactDOM from "react-dom";
import { RenderThemeEditor } from "./themeEditor";
import { ReactNode } from "react";

export const CreatePopupBase: any = findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) {
      if (typeof m[prop] === 'function' && m[prop].toString().includes('CreatePopup(this.m_strName,this.m_rgParams))')) {
        //console.log(m[prop].toString())
        return m[prop]
      }
    }
});

// findModuleChild((m) => {
//     if (typeof m !== 'object') return undefined;
//     for (let prop in m) {
//       if (typeof m[prop] === 'function'
//     ) {
//         console.log(m[prop].toString())
//       }
//     }
// })

// findAllModules((m) => {
//     if (typeof m !== 'object') return undefined;
//     for (let prop in m) {
//         try {
//             console.log(m[prop]?.toString())
//         }
//         catch (e) {}
//     }
// })


export const ShowLegacyPopupModal = findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) {
      if (typeof m[prop] === 'function' 
      && m[prop].toString().includes('this.m_OnLegacyPopupModalCountChanged')
      && m[prop].toString().includes('this.m_rgLegacyPopupModals')
    ) {
        //console.log(m[prop].toString())
        return m[prop]
      }
    }
})

findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) {
      if (typeof m[prop] === 'function' &&
      m[prop].toString().includes("UpdateParamsBeforeShow") &&
      m[prop].toString().includes("this.browser_info.m_eBrowserType")
    ) {
        console.log(m[prop])
        console.log(m[prop].toString())
      }
    }
})

const TitleBarControls: any = findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) { if (typeof m[prop] === 'function' && m[prop].toString().includes('className:"title-area-highlight"')) { return m[prop] } }
});

const NotSureWhatThisIs: any = findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) { if (typeof m[prop] === 'function' 
    && m[prop].toString().includes('BShouldRenderMouseOverlay')
    && m[prop].toString().includes('OnMenusChanged')
    && m[prop].toString().includes('bSuppressMouseOverlay')
    && m[prop].toString().includes('elRoot')
)      
    { return m[prop] } }
});

const ContextMenuHandler: any = findModuleChild((m) => {
    if (typeof m !== 'object') return undefined;
    for (let prop in m) { if (typeof m[prop] === 'function' 
    && m[prop].toString().includes('m_rgActiveSubmenus')
    && m[prop].toString().includes('CreateContextMenuInstance')
    && m[prop].toString().includes('OnMenusChanged')
)      
    { return m[prop] } }
});

interface RenderProps {
    _window: Window
}

/**
 * INVESTIGATE FullModalOverlay, related to ShowLegacyPopupModal
 */

export class CreatePopup extends CreatePopupBase {

    constructor(component: ReactNode, strPopupName: string, options: any) {
        super(strPopupName, options) as any

        this.component = component
        this.contextMenuHandler = new ContextMenuHandler()
    }

    Show() {
        super.Show()
        const RenderComponent: React.FC<RenderProps> = ({_window}) => {

            return (
                <>
                    <NotSureWhatThisIs
                        ownerWindow={_window}
                        manager={this.contextMenuHandler}
                    />
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
                            style={{}}
                            />
                        {/* <ShowLegacyPopupModal
                            browserInfo={null}
                            bCenterPopupsOnWindow={false}
                            >
                            
                        </ShowLegacyPopupModal> */}
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

    Render(_window: Window, _element: HTMLElement) {
        //console.log("called render", _window, element)
    }

    OnClose() {

    }

    OnLoad()  {
        //console.log("window loaded...", this._createdWindow)

        const element: HTMLElement = (this.m_popup.document as Document).querySelector(".DialogContent_InnerWidth")
        const height = element?.getBoundingClientRect()?.height

        this.m_popup.SteamClient?.Window?.ResizeTo(450, height + 48, true)
        this.m_popup.SteamClient.Window.ShowWindow()

        // @ts-ignore
        // g_PopupManager.m_mapPopups.data_.forEach(popup => {
        //     if (popup.value_.m_strName == "SP Desktop_uid0" || popup.value_.m_strName == "Example Window_uid0") {
        //         console.log(popup.value_)
        //     }
        // })
    }
}