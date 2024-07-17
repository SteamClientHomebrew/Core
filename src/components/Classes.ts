import { findClassModule } from "@millennium/ui"

export const FieldClasses = findClassModule(m => m.FieldLabel && !m.GyroButtonPickerDialog && !m.ControllerOutline && !m.AwaitingEmailConfIcon) as any
