const pluginName = "millennium__internal";
function bootstrap() {
	!window.PLUGIN_LIST && (window.PLUGIN_LIST = {});

	if (!window.PLUGIN_LIST[pluginName]) {
		window.PLUGIN_LIST[pluginName] = {};
	}
}
bootstrap()
async function csm(m, _kw) {
	const res = await Millennium.callServerMethod(pluginName, m, _kw);
	return res
}
var millennium_main = (function (exports, ReactDOM) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

    /*
    pluginSelf is a sandbox for data specific to your plugin.
    You can't access other plugins sandboxes and they can't access yours

    ex:
        pluginSelf.var = "Hello"
        console.log(pluginSelf.var) -> Hello
        
    notes:
        pluginSelf can be refrenced from any js/ts file and its guaranteed to be the same object
    */
    const pluginSelf = window.PLUGIN_LIST[pluginName];
    const Millennium = window.Millennium;
    Millennium.exposeObj = function (obj) {
        for (const key in obj) {
            exports[key] = obj[key];
        }
    };

    function parseTheme(incomingPatches) {
        let patches = {
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
        let newMatchRegexStrings = new Set(incomingPatches.map((patch) => patch.MatchRegexString));
        let filteredPatches = patches.Patches.filter((patch) => !newMatchRegexStrings.has(patch.MatchRegexString));
        let updatedPatches = filteredPatches.concat(incomingPatches);
        return updatedPatches;
    }
    function get_path(nativeName, relativePath) {
        return `skins/${nativeName}/${relativePath}`;
    }
    function patch_context(_context) {
        const theme = pluginSelf.activeTheme;
        const m_doc = _context.m_popup.document;
        const classes = (_context.m_rgParams.html_class || _context.m_rgParams.body_class || '').split(' ').map((className) => '.' + className);
        const title = _context.m_strTitle;
        m_doc.head.appendChild(Object.assign(m_doc.createElement('style'), {
            id: 'SystemAccentColorInject'
        })).innerText = pluginSelf.systemColor.replace(/\s/g, ''); // append system colors to the DOM
        if (theme.data.hasOwnProperty("Patches")) {
            theme.data.Patches.forEach((patch) => {
                const match = title.match(patch.MatchRegexString) || classes.includes(patch.MatchRegexString);
                if (title == "Steam") {
                    _context.m_popup.window.HAS_INJECTED_THEME = true;
                }
                if (match) {
                    console.log("patched", title);
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
            const conditionals_t = theme.data.Conditions;
            const saved = pluginSelf.conditionals[theme["native-name"]];
            for (const key in conditionals_t) {
                if (conditionals_t.hasOwnProperty(key)) {
                    if (key in saved) {
                        const patch = conditionals_t[key].values[saved[key]];
                        if ("TargetCss" in patch) {
                            const css = patch.TargetCss;
                            css.affects.forEach((affectee) => {
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
                            const js = patch.TargetJs;
                            js.affects.forEach((affectee) => {
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

    const PluginComponent = () => {
        console.log("SETTINGS PANEL DETECTED");
        // Return JSX for the component
        return (window.SP_REACT.createElement("div", null, "This is an example element"));
    };
    function RenderSettingsModal(_context) {
        console.log("SETTINGS PANEL DETECTED");
        Millennium.findElement(_context.m_popup.document, "._EebF_xe4DGRZ9a0XkyDj.Panel").then(element => {
            console.log(element);
            ReactDOM__default["default"].render(window.SP_REACT.createElement(PluginComponent, null), element[0]);
        });
    }

    async function getThemes() {
        return new Promise(async (resolve, _reject) => {
            const result = await csm("find_all_themes");
            resolve(JSON.parse(result));
        });
    }
    async function getConditionals() {
        return new Promise(async (resolve, _reject) => {
            const result = await csm("get_conditionals");
            resolve(JSON.parse(result));
        });
    }
    async function getSystemColor() {
        return new Promise(async (resolve, _reject) => {
            const result = await csm("get_accent_color");
            resolve(JSON.parse(result));
        });
    }
    async function getActive() {
        return new Promise(async (resolve, _) => {
            const themes = await getThemes();
            themes.forEach((theme) => {
                if (theme["native-name"] == "Fluenty") {
                    if ("Patches" in theme.data) {
                        theme.data.Patches = parseTheme(theme.data.Patches);
                    }
                    resolve(theme);
                }
            });
        });
    }
    function windowCreated(_context) {
        const title = _context.m_strTitle;
        // @ts-ignore
        if (title == LocalizationManager.LocalizeString("#Settings_Title")) {
            RenderSettingsModal(_context);
        }
        // @ts-ignore
        g_PopupManager.m_mapPopups.data_.forEach((element) => {
            if (element.value_.m_strName == 'SP Desktop_uid0') {
                // main steam window popup sometimes doesn't get hooked. steam bug
                if (element.value_.m_popup.window.HAS_INJECTED_THEME === undefined) {
                    console.log("patching Steam window because it wasn't already");
                    patch_context(element.value_);
                }
            }
        });
        patch_context(_context);
    }
    // Entry point on the front end of your plugin
    async function PluginMain() {
        const current = await getActive();
        const conditionals = await getConditionals();
        const col = await getSystemColor();
        console.log('loaded with', current, "conditionals", conditionals);
        console.log("system colors ->", col);
        pluginSelf.systemColor = `
    :root {
        --SystemAccentColor: ${col.accent};
        --SystemAccentColorLight1: ${col.light1};
        --SystemAccentColorLight2: ${col.light2};
        --SystemAccentColorLight3: ${col.light3};
        --SystemAccentColorDark1: ${col.dark1};
        --SystemAccentColorDark2: ${col.dark2};
        --SystemAccentColorDark3: ${col.dark3};
    }`;
        pluginSelf.activeTheme = current;
        pluginSelf.conditionals = conditionals;
        Millennium.AddWindowCreateHook(windowCreated);
    }

    exports["default"] = PluginMain;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, window.SP_REACTDOM);

function globalize() {
	Object.assign(window.PLUGIN_LIST[pluginName], millennium_main);
	millennium_main["default"]();
	MILLENNIUM_BACKEND_IPC.postMessage(1, { pluginName: pluginName });
}
globalize()