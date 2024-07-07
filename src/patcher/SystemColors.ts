import { pluginSelf } from "@millennium/ui"
import { SystemAccentColor } from "../components/types"

/**
 * appends a virtual CSS script into self module
 * @param systemColors SystemAccentColors
 */
export const DispatchSystemColors = (systemColors: SystemAccentColor) => {
    pluginSelf.systemColor = `
    :root {
        --SystemAccentColor: ${systemColors.accent}; 
        --SystemAccentColorLight1: ${systemColors.light1}; --SystemAccentColorDark1: ${systemColors.dark1};
        --SystemAccentColorLight2: ${systemColors.light2}; --SystemAccentColorDark2: ${systemColors.dark2};
        --SystemAccentColorLight3: ${systemColors.light3}; --SystemAccentColorDark3: ${systemColors.dark3};
    }`
}