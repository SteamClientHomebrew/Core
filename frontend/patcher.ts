import { pluginSelf } from "./millennium";

function parseTheme(incomingPatches: any) {

    let patches: any = {
        Patches: [
            // { MatchRegexString: ".*http.*steam.*", TargetCss: "webkit.css", TargetJs: "webkit.js" },
            { MatchRegexString: "^Steam$", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^OverlayBrowser_Browser$", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^SP Overlay:", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "Menu$", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "Supernav$", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^notificationtoasts_", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^SteamBrowser_Find$", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^OverlayTab\\d+_Find$", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: "^Steam Big Picture Mode$", TargetCss: "bigpicture.custom.css", TargetJs: "bigpicture.custom.js" },
            { MatchRegexString: "^QuickAccess_", TargetCss: "bigpicture.custom.css", TargetJs: "bigpicture.custom.js" },
            { MatchRegexString: "^MainMenu_", TargetCss: "bigpicture.custom.css", TargetJs: "bigpicture.custom.js" },
            { MatchRegexString: ".friendsui-container", TargetCss: "friends.custom.css", TargetJs: "friends.custom.js" },
            { MatchRegexString: ".ModalDialogPopup", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" },
            { MatchRegexString: ".FullModalOverlay", TargetCss: "libraryroot.custom.css", TargetJs: "libraryroot.custom.js" }
        ]
    };
    
    let newMatchRegexStrings = new Set(incomingPatches.map((patch: any) => patch.MatchRegexString));
    let filteredPatches = patches.Patches.filter((patch: any) => !newMatchRegexStrings.has(patch.MatchRegexString));
    let updatedPatches = filteredPatches.concat(incomingPatches);

    return updatedPatches;
}

function get_path(nativeName: string, relativePath: string) {
    return `skins/${nativeName}/${relativePath}`
}

function patch_context(_context: any) 
{
    const theme = pluginSelf.activeTheme
    const m_doc = _context.m_popup.document    
    const classes = (_context.m_rgParams.html_class || _context.m_rgParams.body_class || '').split(' ').map((className: string) => '.' + className);
    const title = _context.m_strTitle

    m_doc.head.appendChild(Object.assign(m_doc.createElement('style'), { 
        id: 'SystemAccentColorInject' 
    })).innerText = pluginSelf.systemColor.replace(/\s/g, ''); // append system colors to the DOM

    if (theme.data.hasOwnProperty("Patches")) {
        theme.data.Patches.forEach((patch: any) => {
            const match = title.match(patch.MatchRegexString) || classes.includes(patch.MatchRegexString)

            if (title == "Steam") {
                _context.m_popup.window.HAS_INJECTED_THEME = true
            }

            if (match) {
                console.log("patched", title)

                if ("TargetCss" in patch) {
                    m_doc.head.appendChild(Object.assign(m_doc.createElement('link'), { 
                        href: get_path(theme["native-name"], patch.TargetCss), 
                        rel: 'stylesheet', id: 'millennium-injected' 
                    }));
                }
                if ("TargetJs" in patch) {
                    m_doc.head.appendChild(Object.assign(m_doc.createElement('script'), { 
                        src: get_path(theme["native-name"], patch.TargetJs), 
                        type: 'module', id: 'millennium-injected' 
                    }));
                }
            }
        });
    }

    // console.log(pluginSelf.conditionals)

    if (theme.data.hasOwnProperty("Conditions")) { 

        const conditionals_t = theme.data.Conditions
        const saved = pluginSelf.conditionals[theme["native-name"]]

        for (const key in conditionals_t) {
            if (conditionals_t.hasOwnProperty(key)) {
                if (key in saved) {
                    const patch = conditionals_t[key].values[saved[key]]
                    if ("TargetCss" in patch) {

                        const css = patch.TargetCss
                        css.affects.forEach((affectee: any) => {
                            if (title.match(affectee) || classes.includes(affectee)) {
                                // console.log("INJECTING", css.src, "INTO", title)
                                m_doc.head.appendChild(Object.assign(m_doc.createElement('link'), { 
                                    href: get_path(theme["native-name"], css.src), 
                                    rel: 'stylesheet', id: 'millennium-injected' 
                                }));
                            }
                        });
                    }
                    if ("TargetJs" in patch) {

                        const js = patch.TargetJs
                        js.affects.forEach((affectee: any) => {
                            if (title.match(affectee) || classes.includes(affectee)) {
                                // console.log("INJECTING", js.src, "INTO", title)
                                m_doc.head.appendChild(Object.assign(m_doc.createElement('script'), { 
                                    src: get_path(theme["native-name"], js.src), 
                                    type: 'module', id: 'millennium-injected' 
                                }));
                            }
                        });
                    }
                }
            }
        }
    }
}

export { parseTheme, patch_context }