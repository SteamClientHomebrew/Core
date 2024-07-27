import { findClassModule } from "@millennium/ui"

export const pagedSettingsClasses = findClassModule(m => m.PagedSettingsDialog_PageList) as any
export const settingsClasses = findClassModule(m => m.SettingsTitleBar && m.SettingsDialogButton) as any
