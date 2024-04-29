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
var millennium_main = (function (exports, ReactDOM, react) {
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

    const PluginViewModal = () => {
        const [plugins, setPlugins] = react.useState([]);
        const [checkedItems, setCheckedItems] = react.useState({});
        const indent = { "--indent-level": 0 };
        react.useEffect(() => {
            csm("find_all_plugins").then((value) => {
                const json = JSON.parse(value);
                console.log(json);
                json.forEach((plugin, index) => {
                    if (plugin.enabled) {
                        setCheckedItems({
                            ...checkedItems,
                            [index]: true
                        });
                    }
                });
                setPlugins(json);
            });
        }, []);
        const handleCheckboxChange = (index) => {
            const updated = !checkedItems[index];
            if (plugins[index]?.data?.name == "millennium__internal") {
                return;
            }
            setCheckedItems({
                ...checkedItems,
                [index]: updated
            });
            csm("update_plugin_status", {
                plugin_name: plugins[index]?.data?.name,
                enabled: updated
            });
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("div", { className: "DialogHeader" }, "Plugins"),
            window.SP_REACT.createElement("div", { className: "DialogBody aFxOaYcllWYkCfVYQJFs0" }, plugins.map((value, _index) => (window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel", style: indent, key: _index },
                window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                    window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, value?.data?.common_name),
                    window.SP_REACT.createElement("div", { className: "_2ZQ9wHACVFqZcufK_WRGPM" },
                        window.SP_REACT.createElement("div", { className: "_3N47t_-VlHS8JAEptE5rlR" },
                            window.SP_REACT.createElement("div", { className: `_24G4gV0rYtRbebXM44GkKk ${checkedItems[_index] ? '_3ld7THBuSMiFtcB_Wo165i' : ''} Focusable`, onClick: () => handleCheckboxChange(_index), tabIndex: 0 },
                                window.SP_REACT.createElement("div", { className: "_2JtC3JSLKaOtdpAVEACsG1" }),
                                window.SP_REACT.createElement("div", { className: "_3__ODLQXuoDAX41pQbgHf9" }))))),
                window.SP_REACT.createElement("div", { className: "_2OJfkxlD3X9p8Ygu1vR7Lr" }, value?.data?.description ?? "No description yet.")))))));
    };

    let webpackCache = {};
    let hasWebpack5 = false;
    if (window.webpackJsonp && !window.webpackJsonp.deckyShimmed) {
        // Webpack 4, currently on stable
        const wpRequire = window.webpackJsonp.push([
            [],
            { get_require: (mod, _exports, wpRequire) => (mod.exports = wpRequire) },
            [['get_require']],
        ]);
        delete wpRequire.m.get_require;
        delete wpRequire.c.get_require;
        webpackCache = wpRequire.c;
    }
    else {
        // Webpack 5, currently on beta
        hasWebpack5 = true;
        const id = Math.random();
        let initReq;
        window.webpackChunksteamui.push([
            [id],
            {},
            (r) => {
                initReq = r;
            },
        ]);
        for (let i of Object.keys(initReq.m)) {
            try {
                webpackCache[i] = initReq(i);
            }
            catch (e) {
                console.debug("[DFL:Webpack]: Ignoring require error for module", i, e);
            }
        }
    }
    const allModules = hasWebpack5
        ? Object.values(webpackCache).filter((x) => x)
        : Object.keys(webpackCache)
            .map((x) => webpackCache[x].exports)
            .filter((x) => x);
    const findModule = (filter) => {
        for (const m of allModules) {
            if (m.default && filter(m.default))
                return m.default;
            if (filter(m))
                return m;
        }
    };
    const CommonUIModule = allModules.find((m) => {
        if (typeof m !== 'object')
            return false;
        for (let prop in m) {
            if (m[prop]?.contextType?._currentValue && Object.keys(m).length > 60)
                return true;
        }
        return false;
    });
    findModule((m) => {
        if (typeof m !== 'object')
            return false;
        for (let prop in m) {
            if (m[prop]?.toString && /Spinner\)}\),.\.createElement\(\"path\",{d:\"M18 /.test(m[prop].toString()))
                return true;
        }
        return false;
    });
    allModules.find((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (m[prop]?.computeRootMatch)
                return true;
        }
        return false;
    });

    const Dropdown = Object.values(CommonUIModule).find((mod) => mod?.prototype?.SetSelectedOption && mod?.prototype?.BuildMenu);
    Object.values(CommonUIModule).find((mod) => console.log(mod?.toString()));
    Object.values(CommonUIModule).find((mod) => mod?.toString()?.includes('"dropDownControlRef","description"'));

    // import React, { useEffect, useState } from 'react';
    const ThemeViewModal = () => {
        const [themes, setThemes] = react.useState();
        const [active, setActive] = react.useState();
        const updateThemeCallback = (_data) => {
            //setSelected(_data)
            console.log(_data.theme["native-name"]);
            csm("change_theme", { plugin_name: _data.theme["native-name"] });
            window.location.reload();
        };
        react.useEffect(() => {
            csm("find_all_themes").then((value) => {
                const json = JSON.parse(value);
                let themeBuffer = [];
                json.forEach((theme, index) => {
                    themeBuffer.push({
                        label: theme?.data?.name ?? theme["native-name"], data: `theme_${index}`, theme: theme
                    });
                });
                setThemes(themeBuffer);
            });
            csm("get_active_theme").then((value) => {
                const json = JSON.parse(value);
                setActive(json?.data?.name ?? json["native-name"]);
            });
        }, []);
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("div", { className: "DialogHeader" }, "Themes"),
            window.SP_REACT.createElement("div", { className: "DialogBody aFxOaYcllWYkCfVYQJFs0" },
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, "Client Theme"),
                        window.SP_REACT.createElement("div", { className: "_2ZQ9wHACVFqZcufK_WRGPM" },
                            window.SP_REACT.createElement(Dropdown, { rgOptions: themes, selectedOption: 1, strDefaultLabel: active, contextMenuPositionOptions: "Left", onChange: updateThemeCallback }))),
                    window.SP_REACT.createElement("div", { className: "_2OJfkxlD3X9p8Ygu1vR7Lr" }, "Select the theme you want Steam to use (requires reload)")))));
    };

    var Renderer;
    (function (Renderer) {
        Renderer[Renderer["Plugins"] = 0] = "Plugins";
        Renderer[Renderer["Themes"] = 1] = "Themes";
    })(Renderer || (Renderer = {}));
    const RenderViewComponent = (componentType) => {
        Millennium.findElement(pluginSelf.settingsDoc, ".DialogContent_InnerWidth").then(element => {
            switch (componentType) {
                case Renderer.Plugins:
                    ReactDOM__default["default"].render(window.SP_REACT.createElement(PluginViewModal, null), element[0]);
                    break;
                case Renderer.Themes:
                    ReactDOM__default["default"].render(window.SP_REACT.createElement(ThemeViewModal, null), element[0]);
                    break;
            }
        });
    };
    const PluginComponent = () => {
        console.log("SETTINGS PANEL DETECTED");
        const pluginClick = () => {
            RenderViewComponent(Renderer.Plugins);
        };
        const themeClick = () => {
            RenderViewComponent(Renderer.Themes);
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("div", { className: "bkfjn0yka2uHNqEvWZaTJ", onClick: pluginClick },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 36 36", fill: "none" },
                        window.SP_REACT.createElement("path", { d: "M18 26V31H2V26C2 23.8783 2.84285 21.8434 4.34315 20.3431C5.84344 18.8429 7.87827 18 10 18C12.1217 18 14.1566 18.8429 15.6569 20.3431C17.1571 21.8434 18 23.8783 18 26ZM10 15C10.89 15 11.76 14.7361 12.5001 14.2416C13.2401 13.7471 13.8169 13.0443 14.1575 12.2221C14.4981 11.3998 14.5872 10.495 14.4135 9.6221C14.2399 8.74918 13.8113 7.94736 13.182 7.31802C12.5526 6.68868 11.7508 6.2601 10.8779 6.08647C10.005 5.91283 9.10019 6.00195 8.27792 6.34254C7.45566 6.68314 6.75285 7.25991 6.25839 7.99994C5.76392 8.73996 5.5 9.60999 5.5 10.5C5.49868 11.0913 5.61418 11.6771 5.83986 12.2236C6.06554 12.7702 6.39695 13.2668 6.81508 13.6849C7.23321 14.103 7.72981 14.4345 8.27637 14.6601C8.82293 14.8858 9.40868 15.0013 10 15ZM31.66 18.34C30.8643 17.5434 29.9094 16.9238 28.8578 16.5216C27.8062 16.1194 26.6815 15.9437 25.5574 16.006C24.4332 16.0683 23.3348 16.3672 22.3341 16.8831C21.3334 17.399 20.4528 18.1204 19.75 19C21.2201 21.0373 22.0077 23.4877 22 26V29H34V24C34.0008 22.9491 33.7946 21.9084 33.3931 20.9372C32.9916 19.966 32.4027 19.0835 31.66 18.34ZM26 13C26.89 13 27.76 12.7361 28.5001 12.2416C29.2401 11.7471 29.8169 11.0443 30.1575 10.2221C30.4981 9.39981 30.5872 8.49501 30.4135 7.6221C30.2399 6.74918 29.8113 5.94736 29.182 5.31802C28.5526 4.68868 27.7508 4.2601 26.8779 4.08647C26.005 3.91283 25.1002 4.00195 24.2779 4.34254C23.4557 4.68314 22.7529 5.25991 22.2584 5.99994C21.7639 6.73996 21.5 7.60999 21.5 8.5C21.4987 9.09132 21.6142 9.67708 21.8399 10.2236C22.0655 10.7702 22.397 11.2668 22.8151 11.6849C23.2332 12.103 23.7298 12.4345 24.2764 12.6601C24.8229 12.8858 25.4087 13.0013 26 13Z", fill: "currentColor" }))),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, "Plugins")),
            window.SP_REACT.createElement("div", { className: "bkfjn0yka2uHNqEvWZaTJ ", onClick: themeClick },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 36 36", fill: "none" },
                        window.SP_REACT.createElement("path", { d: "M18 26V31H2V26C2 23.8783 2.84285 21.8434 4.34315 20.3431C5.84344 18.8429 7.87827 18 10 18C12.1217 18 14.1566 18.8429 15.6569 20.3431C17.1571 21.8434 18 23.8783 18 26ZM10 15C10.89 15 11.76 14.7361 12.5001 14.2416C13.2401 13.7471 13.8169 13.0443 14.1575 12.2221C14.4981 11.3998 14.5872 10.495 14.4135 9.6221C14.2399 8.74918 13.8113 7.94736 13.182 7.31802C12.5526 6.68868 11.7508 6.2601 10.8779 6.08647C10.005 5.91283 9.10019 6.00195 8.27792 6.34254C7.45566 6.68314 6.75285 7.25991 6.25839 7.99994C5.76392 8.73996 5.5 9.60999 5.5 10.5C5.49868 11.0913 5.61418 11.6771 5.83986 12.2236C6.06554 12.7702 6.39695 13.2668 6.81508 13.6849C7.23321 14.103 7.72981 14.4345 8.27637 14.6601C8.82293 14.8858 9.40868 15.0013 10 15ZM31.66 18.34C30.8643 17.5434 29.9094 16.9238 28.8578 16.5216C27.8062 16.1194 26.6815 15.9437 25.5574 16.006C24.4332 16.0683 23.3348 16.3672 22.3341 16.8831C21.3334 17.399 20.4528 18.1204 19.75 19C21.2201 21.0373 22.0077 23.4877 22 26V29H34V24C34.0008 22.9491 33.7946 21.9084 33.3931 20.9372C32.9916 19.966 32.4027 19.0835 31.66 18.34ZM26 13C26.89 13 27.76 12.7361 28.5001 12.2416C29.2401 11.7471 29.8169 11.0443 30.1575 10.2221C30.4981 9.39981 30.5872 8.49501 30.4135 7.6221C30.2399 6.74918 29.8113 5.94736 29.182 5.31802C28.5526 4.68868 27.7508 4.2601 26.8779 4.08647C26.005 3.91283 25.1002 4.00195 24.2779 4.34254C23.4557 4.68314 22.7529 5.25991 22.2584 5.99994C21.7639 6.73996 21.5 7.60999 21.5 8.5C21.4987 9.09132 21.6142 9.67708 21.8399 10.2236C22.0655 10.7702 22.397 11.2668 22.8151 11.6849C23.2332 12.103 23.7298 12.4345 24.2764 12.6601C24.8229 12.8858 25.4087 13.0013 26 13Z", fill: "currentColor" }))),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, "Themes"))));
    };
    function RenderSettingsModal(_context) {
        pluginSelf.settingsDoc = _context.m_popup.document;
        console.log("SETTINGS PANEL DETECTED");
        Millennium.findElement(_context.m_popup.document, "._EebF_xe4DGRZ9a0XkyDj.Panel").then(element => {
            console.log(element);
            // Create a new div element
            var newDiv = document.createElement("div");
            // Prepend the new div to the element
            element[0].prepend(newDiv);
            ReactDOM__default["default"].render(window.SP_REACT.createElement(PluginComponent, null), newDiv);
        });
    }

    async function getTheme() {
        return new Promise(async (resolve, _reject) => {
            const result = await csm("get_active_theme");
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
            const theme = await getTheme();
            console.log(theme);
            if (theme?.success == false) {
                return;
            }
            if ("Patches" in theme.data) {
                theme.data.Patches = parseTheme(theme.data.Patches);
            }
            resolve(theme);
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

})({}, window.SP_REACTDOM, window.SP_REACT);

function globalize() {
	Object.assign(window.PLUGIN_LIST[pluginName], millennium_main);
	millennium_main["default"]();
	MILLENNIUM_BACKEND_IPC.postMessage(1, { pluginName: pluginName });
}
globalize()