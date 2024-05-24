import { pluginSelf } from "millennium-lib";
import { CommonPatchTypes, ConditionalControlFlow, ConditionalPatch, Patch, Theme, ConditionalControlFlowType as ModuleType } from "../types/types";

export const DOMModifier = {
    /**
     * Append a StyleSheet to DOM from raw text
     * @param document Target document to append StyleSheet to
     * @param innerStyle string encoded CSS
     * @param id HTMLElement id
     */
    AddStyleSheetFromText: (document: Document, innerStyle: string, id?: string) => {
        if (document.querySelectorAll(`style[id='${id}']`).length) return 
        
        document.head.appendChild(Object.assign(document.createElement('style'), { id: id })).innerText = innerStyle
    },
    /**
     * Append a StyleSheet to DOM from loopbackhost or absolute URI
     * @param document Target document to append StyleSheet to
     * @param localPath relative/absolute path to CSS module
     */
    AddStyleSheet: (document: Document, localPath: string) => {   
        if (!pluginSelf.stylesAllowed) return 
        if (document.querySelectorAll(`link[href='${localPath}']`).length) return

        document.head.appendChild(Object.assign(document.createElement('link'), { 
            href: localPath, 
            rel: 'stylesheet', id: 'millennium-injected' 
        }));
    },
    /**
     * Append a JavaScript module to DOM from loopbackhost or absolute URI
     * @param document Target document to append JavaScript to
     * @param localPath relative/absolute path to CSS module
     */
    AddJavaScript: (document: Document, localPath: string) => {
        if (!pluginSelf.scriptsAllowed) return 
        if (document.querySelectorAll(`script[src='${localPath}'][type='module']`).length) return 
        
        document.head.appendChild(Object.assign(document.createElement('script'), { 
            src: localPath, 
            type: 'module', id: 'millennium-injected' 
        }));
    }
}

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

export function constructThemePath(nativeName: string, relativePath: string) {
    return ['skins', nativeName, relativePath].join('/');
}

export const classListMatch = (classList: string[], affectee: string) => {
    for (const classItem in classList) {
        if (classList[classItem].includes(affectee)) {
            return true
        }
    }
    return false
}

export const evaluatePatch = (type: ModuleType, modulePatch: ConditionalControlFlow, documentTitle: string, classList: string[], document: Document) => {

    if ((modulePatch as any)[CommonPatchTypes[type]] === undefined) {
        return 
    }

    ((modulePatch as any)[CommonPatchTypes[type]] as ConditionalPatch).affects.forEach((affectee: string) => {

        if (!documentTitle.match(affectee) && !classListMatch(classList, affectee)) {
            return 
        }

        switch (type) {
            case ModuleType.TargetCss: {
                DOMModifier.AddStyleSheet(document, constructThemePath(pluginSelf.activeTheme.native, (modulePatch as any)[CommonPatchTypes[type]].src))  
            }   
            case ModuleType.TargetJs: {
                DOMModifier.AddJavaScript(document, constructThemePath(pluginSelf.activeTheme.native, (modulePatch as any)[CommonPatchTypes[type]].src))
            }     
        }  
    });
}