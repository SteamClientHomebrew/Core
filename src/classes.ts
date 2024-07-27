import { Classes, findClassModule } from "@millennium/ui"

export const fieldClasses = findClassModule(m => m.FieldLabel && !m.GyroButtonPickerDialog && !m.ControllerOutline && !m.AwaitingEmailConfIcon) as any
export const pagedSettingsClasses = findClassModule(m => m.PagedSettingsDialog_PageList) as any
export const settingsClasses = findClassModule(m => m.SettingsTitleBar && m.SettingsDialogButton) as any

export const containerClasses = [
	Classes.Field,
	Classes.WithFirstRow,
	Classes.VerticalAlignCenter,
	Classes.WithDescription,
	Classes.WithBottomSeparatorStandard,
	Classes.ChildrenWidthFixed,
	Classes.ExtraPaddingOnChildrenBelow,
	Classes.StandardPadding,
	Classes.HighlightOnFocus,
	"Panel",
].join(" ");