import { SingleDropdownOption } from '@millennium/ui'

export interface Patch {
    MatchRegexString: string, 
    TargetCss?: string | Array<string>, 
    TargetJs?: string | Array<string>
}

export interface FundingTypes {
    kofi: string
}

export interface GitInfo {
    owner: string,
    repo_name: string
}

export interface ConditionalPatch {
    /**
     * A list of regex strings to match against the current window. 
     * ex: ["^Steam$", ".*"]
     */
    affects: string[];
    src: string;
}

export const CommonPatchTypes = [
    "TargetCss", "TargetJs"
]

export enum ConditionalControlFlowType {
    TargetCss,
    TargetJs
}

export interface ConditionalControlFlow {
    TargetCss?: ConditionalPatch;
    TargetJs?: ConditionalPatch;
}

export interface Conditions {
    [settingName: string]: ICondition;
}

export interface ICondition {
    default?: string;
    description?: string;
    values: {
        [condition: string]: ConditionalControlFlow
    };
}

export interface ConditionsStore {
    [settingName: string]: string
}

/**
 * High-level abstraction derived from the backend.
 * There is no garuntee a given Theme contains any elements
 */
export interface Theme {
    Patches?: Patch[],
    UseDefaultPatches?: boolean,
    Conditions?: Conditions,
    author?: string, 
    description?: string, 
    funding?: FundingTypes,
    github?: GitInfo,
    header_image?: URL,
    splash_image?: URL,
    name?: string, 
    source?: string, 
    tags?: string[]
}

/**
 * Wrapped return from backend to interpolate foldername, and theme config
 */
export interface ThemeItem {
    data: Theme,
    native: string, 
    // failed to parse the current theme
    failed: boolean
}

/**
 * MultiDropdownOption extended to hold theme data
 */
export interface ComboItem extends SingleDropdownOption {
    theme: ThemeItem
}

export interface Plugin {
    common_name?: string, 
    name: string,
    description?: string,
    venv?: string
}

export interface PluginComponent {
    path: string,
    enabled: boolean,
    data: Plugin
}

/**
 * SystemAccentColor, High-level abstraction derived from the backend. 
 */
export interface SystemAccentColor {
    accent: string, 
    light1: string, 
    light2: string, 
    light3: string, 
    dark1: string, 
    dark2: string, 
    dark3: string, 
}

export interface UpdateItem {
    message: string, 
    date: string,
    commit: string,
    native: string,
    name: string
}

export interface Settings {
    active: string,
    scripts: boolean,
    styles: boolean,
    updateNotifications: boolean
}

export interface SettingsProps {
    accent_color: SystemAccentColor,
    active_theme: ThemeItem,
    conditions: ConditionsStore,
    settings: Settings
}

export interface ColorProp {
    ColorName: string, 
    Description: string, 
    HexColorCode: string, 
    OriginalColorCode: string
}

export interface ThemeItemV1 extends Theme {
    GlobalsColors: ColorProp[]
}
