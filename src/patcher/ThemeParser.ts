import { pluginSelf } from "@millennium/ui"
import { Conditions, Patch, Theme, ThemeItem } from "../components/types";

/**
 * Interpolates and overrides default patches on a theme. 
 * @param incomingPatches Preprocessed list of patches from a specific theme
 * @returns Processed patches, interpolated with default patches
 */
export function parseTheme(incomingPatches: Patch[]) {

    let patches: Theme = {
        Patches: [
            { MatchRegexString: "^Steam$",                  TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^OverlayBrowser_Browser$", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^SP Overlay:",             TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "Menu$",                    TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "Supernav$",                TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^notificationtoasts_",     TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^SteamBrowser_Find$",      TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^OverlayTab\\d+_Find$",    TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^Steam Big Picture Mode$", TargetCss: "bigpicture.custom.css",  TargetJs: "bigpicture.custom.js"  },
            { MatchRegexString: "^QuickAccess_",            TargetCss: "bigpicture.custom.css",  TargetJs: "bigpicture.custom.js"  },
            { MatchRegexString: "^MainMenu_",               TargetCss: "bigpicture.custom.css",  TargetJs: "bigpicture.custom.js"  },
            { MatchRegexString: ".friendsui-container",     TargetCss: "friends.custom.css",     TargetJs: "friends.custom.js"     },
            { MatchRegexString: ".ModalDialogPopup",        TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: ".FullModalOverlay",        TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" }
        ]
    };
    
    let newMatchRegexStrings: Set<string> = new Set(incomingPatches.map((patch: Patch) => patch.MatchRegexString));
    let filteredPatches: Patch[] = patches.Patches.filter((patch: Patch) => !newMatchRegexStrings.has(patch.MatchRegexString));

    return filteredPatches.concat(incomingPatches) as Patch[];
}

export const SanitizeCondition = (inputString: string): string => {
    /** Convert string to a compliant variable name */
    return inputString.replace(/ /g, '_').replace(/\W|^(?=\d)/g, '').toLowerCase();
}

export const SanitizeConditions = (conditions: Conditions) => { 
    // return Object.keys(conditions).reduce((acc: Conditions, key: string) => {
    //     acc[key] = conditions[SanitizeCondition(key)];
    //     return acc;
    // }, {});
    console.log(conditions)

    for (let key in conditions) {
        conditions[SanitizeCondition(key)] = conditions[key];
        delete conditions[key];
    } 

    return conditions;
}

/**
 * parses a theme after it has been received from the backend.
 * - checks for failure in theme parse
 * - calculates what patches should be used relative to UseDefaultPatches
 * @param theme ThemeItem
 * @returns void
 */
export const ParseLocalTheme = (theme: ThemeItem) => {

    if (theme?.failed) {
        pluginSelf.isDefaultTheme = true
        return 
    }

    theme?.data?.UseDefaultPatches && (theme.data.Patches = parseTheme(theme?.data?.Patches ?? []))
    theme?.data?.Conditions && (theme.data.Conditions = SanitizeConditions(theme.data.Conditions))
    pluginSelf.activeTheme = theme as ThemeItem
}