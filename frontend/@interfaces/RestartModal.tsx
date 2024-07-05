import { ConfirmModalProps, MessageBoxResult, ShowMessageBox, ShowModalProps } from "@millennium/ui"
import { locale } from "../@localization"

export const PromptReload = async (message?: string) => {
    const windowOptions: ShowModalProps = {
        strTitle: locale.reloadRequired,
        bHideMainWindowForPopouts: false,
        popupHeight: 250,
        popupWidth: 425,
    }

    const modalProps: ConfirmModalProps = {
        strTitle: locale.reloadRequired,
        strDescription: message ?? locale.reloadRequiredBody,
        strOKButtonText: locale.optionReloadNow,
        strCancelButtonText: locale.optionReloadLater
    }

    return await ShowMessageBox(windowOptions, modalProps) as MessageBoxResult
}
