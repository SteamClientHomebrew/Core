import { ConfirmModalProps, MessageBoxResult, ShowMessageBox, ShowModalProps } from "millennium-lib"

export const PromptReload = async (message?: string) => {
    const windowOptions: ShowModalProps = {
        strTitle: "Reload Required",
        bHideMainWindowForPopouts: false,
        popupHeight: 250,
        popupWidth: 425,
    }

    const modalProps: ConfirmModalProps = {
        strTitle: "Reload Required",
        strDescription: message ?? "Selected changes need a reload in order to take affect. Should we reload right now?",
        strOKButtonText: "Reload Now",
        strCancelButtonText: "Reload Later"
    }

    return await ShowMessageBox(windowOptions, modalProps) as MessageBoxResult
}
