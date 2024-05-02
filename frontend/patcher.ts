import { pluginSelf } from "./millennium";
import { CommonPatchTypes, ConditionalControlFlow, ConditionalControlFlowType, ConditionalPatch, Conditions, ConditionsStore, Patch, Theme, ThemeItem } from "./types/theme";

const DOMModifier = {
    /**
     * Append a StyleSheet to DOM from raw text
     * @param document Target document to append StyleSheet to
     * @param innerStyle string encoded CSS
     * @param id HTMLElement id
     */
    AddStyleSheetFromText: (document: Document, innerStyle: string, id: string) => {
        document.head.appendChild(Object.assign(document.createElement('style'), { id: id })).innerText = innerStyle
    },
    /**
     * Append a StyleSheet to DOM from loopbackhost or absolute URI
     * @param document Target document to append StyleSheet to
     * @param localPath relative/absolute path to CSS module
     */
    AddStyleSheet: (document: Document, localPath: string) => {
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
function parseTheme(incomingPatches: Patch[]) {

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

function constructThemePath(nativeName: string, relativePath: string) {
    return `skins/${nativeName}/${relativePath}`
}

const evaluatePatch = (type: ConditionalControlFlowType, modulePatch: ConditionalControlFlow, documentTitle: string, classList: string[], document: Document) => {

    if ((modulePatch as any)[CommonPatchTypes[type]] === undefined) {
        return 
    }

    ((modulePatch as any)[CommonPatchTypes[type]] as ConditionalPatch).affects.forEach((affectee: string) => {

        if (!documentTitle.match(affectee) && !classList.includes(affectee)) {
            return 
        }

        switch (type) {
            case ConditionalControlFlowType.TargetCss: {
                DOMModifier.AddStyleSheet(document, constructThemePath(pluginSelf.activeTheme.native, (modulePatch as any)[CommonPatchTypes[type]].src))  
            }   
            case ConditionalControlFlowType.TargetJs: {
                DOMModifier.AddJavaScript(document, constructThemePath(pluginSelf.activeTheme.native, (modulePatch as any)[CommonPatchTypes[type]].src))
            }     
        }  
    });
}

const evaluateConditions = (theme: ThemeItem, title: string, classes: string[], document: Document): void => {

    const themeConditions: Conditions = theme.data.Conditions
    const savedConditions: ConditionsStore = pluginSelf.conditionals[theme.native]

    for (const condition in themeConditions) {

        if (!themeConditions.hasOwnProperty(condition)) {
            return 
        }

        if (condition in savedConditions) {
            const patch = themeConditions[condition].values[savedConditions[condition]]

            evaluatePatch(ConditionalControlFlowType.TargetCss, patch, title, classes, document)
            evaluatePatch(ConditionalControlFlowType.TargetJs, patch, title, classes, document)
        }
    }
}

const evaluatePatches = (activeTheme: ThemeItem, documentTitle: string, classList: string[], document: Document, context: any) => {
    activeTheme.data.Patches.forEach((patch: Patch) => {

        context.m_popup.window.HAS_INJECTED_THEME = documentTitle === "Steam"
        if (!documentTitle.match(patch.MatchRegexString) && !classList.includes(patch.MatchRegexString)) {
            return 
        }
        
        patch?.TargetCss !== undefined && DOMModifier.AddStyleSheet(document, constructThemePath(activeTheme.native, patch.TargetCss))
        patch?.TargetJs !== undefined && DOMModifier.AddJavaScript(document, constructThemePath(activeTheme.native, patch.TargetJs))
    });
}

const getDocumentClassList = (context: any): string[] => {
    return (context.m_rgParams.html_class || context.m_rgParams.body_class || '').split(' ').map((className: string) => '.' + className)
}

function patchDocumentContext(windowContext: any) 
{
    if (pluginSelf.isDefaultTheme) {
        return
    }

    const activeTheme: ThemeItem = pluginSelf.activeTheme
    const document: Document     = windowContext.m_popup.document    
    const classList: string[]    = getDocumentClassList(windowContext);
    const documentTitle: string  = windowContext.m_strTitle

    // Append System Accent Colors to global document (publically shared)
    DOMModifier.AddStyleSheetFromText(document, pluginSelf.systemColor, "SystemAccentColorInject")

    activeTheme.data.hasOwnProperty("Patches") && evaluatePatches(activeTheme, documentTitle, classList, document, windowContext)
    activeTheme.data.hasOwnProperty("Conditions") && evaluateConditions(activeTheme, documentTitle, classList, document)
}

export { parseTheme, patchDocumentContext }