const pluginName = "millennium__internal";
function bootstrap() {
	/** 
	 * This function is called n times depending on n plugin count,
	 * Create the plugin list if it wasn't already created 
	 */
	!window.PLUGIN_LIST && (window.PLUGIN_LIST = {});

	// initialize a container for the plugin
	if (!window.PLUGIN_LIST[pluginName]) {
		window.PLUGIN_LIST[pluginName] = {};
	}
}
bootstrap()
async function wrappedCallServerMethod(methodName, kwargs) {
	return await Millennium.callServerMethod(pluginName, methodName, kwargs);
}
var millennium_main = (function (exports, React, ReactDOM) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
    var ReactDOM__default = /*#__PURE__*/_interopDefaultLegacy(ReactDOM);

    let webpackCache = {};
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
    const allModules = Object.values(webpackCache).filter((x) => x);
    const findModule = (filter) => {
        for (const m of allModules) {
            if (m.default && filter(m.default))
                return m.default;
            if (filter(m))
                return m;
        }
    };
    const findModuleChild = (filter) => {
        for (const m of allModules) {
            for (const mod of [m.default, m]) {
                const filterRes = filter(mod);
                if (filterRes) {
                    return filterRes;
                }
                else {
                    continue;
                }
            }
        }
    };
    const findAllModules = (filter) => {
        const out = [];
        for (const m of allModules) {
            if (m.default && filter(m.default))
                out.push(m.default);
            if (filter(m))
                out.push(m);
        }
        return out;
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
    const IconsModule = findModule((m) => {
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

    const CommonDialogDivs = Object.values(CommonUIModule).filter((m) => typeof m === 'object' && m?.render?.toString().includes('"div",Object.assign({},'));
    const MappedDialogDivs = new Map(Object.values(CommonDialogDivs).map((m) => {
        const renderedDiv = m.render({});
        // Take only the first class name segment as it identifies the element we want
        return [renderedDiv.props.className.split(' ')[0], m];
    }));
    const DialogHeader = MappedDialogDivs.get('DialogHeader');
    const DialogSubHeader = MappedDialogDivs.get('DialogSubHeader');
    MappedDialogDivs.get('DialogFooter');
    MappedDialogDivs.get('DialogLabel');
    const DialogBodyText = MappedDialogDivs.get('DialogBodyText');
    const DialogBody = MappedDialogDivs.get('DialogBody');
    MappedDialogDivs.get('DialogControlsSection');
    MappedDialogDivs.get('DialogControlsSectionHeader');
    Object.values(CommonUIModule).find((mod) => mod?.render?.toString()?.includes('DialogButton') && mod?.render?.toString()?.includes('Primary'));
    Object.values(CommonUIModule).find((mod) => mod?.render?.toString()?.includes('Object.assign({type:"button"') &&
        mod?.render?.toString()?.includes('DialogButton') &&
        mod?.render?.toString()?.includes('Secondary'));

    const Dropdown = Object.values(CommonUIModule).find((mod) => mod?.prototype?.SetSelectedOption && mod?.prototype?.BuildMenu);
    Object.values(CommonUIModule).find((mod) => mod?.toString()?.includes('"dropDownControlRef","description"'));

    /**
     * Finds the SP window, since it is a render target as of 10-19-2022's beta
     */
    function findSP() {
        // old (SP as host)
        if (document.title == 'SP')
            return window;
        // new (SP as popup)
        const navTrees = getGamepadNavigationTrees();
        return navTrees?.find((x) => x.m_ID == 'root_1_').Root.Element.ownerDocument.defaultView;
    }
    /**
     * Gets the correct FocusNavController, as the Feb 22 2023 beta has two for some reason.
     */
    function getFocusNavController() {
        return window.GamepadNavTree?.m_context?.m_controller || window.FocusNavController;
    }
    /**
     * Gets the gamepad navigation trees as Valve seems to be moving them.
     */
    function getGamepadNavigationTrees() {
        const focusNav = getFocusNavController();
        const context = focusNav.m_ActiveContext || focusNav.m_LastActiveContext;
        return context?.m_rgGamepadNavigationTrees;
    }

    const showModalRaw = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function' &&
                m[prop].toString().includes('props.bDisableBackgroundDismiss') &&
                !m[prop]?.prototype?.Cancel) {
                return m[prop];
            }
        }
    });
    const oldShowModalRaw = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function' && m[prop].toString().includes('bHideMainWindowForPopouts:!0')) {
                return m[prop];
            }
        }
    });
    const showModal = (modal, parent, props = {
        strTitle: 'Decky Dialog',
        bHideMainWindowForPopouts: false,
    }) => {
        if (showModalRaw) {
            return showModalRaw(modal, parent || findSP(), props.strTitle, props, undefined, {
                bHideActions: props.bHideActionIcons,
            });
        }
        else if (oldShowModalRaw) {
            return oldShowModalRaw(modal, parent || findSP(), props);
        }
        else {
            throw new Error('[DFL:Modals]: Cannot find showModal function');
        }
    };
    const ConfirmModal = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (!m[prop]?.prototype?.OK && m[prop]?.prototype?.Cancel && m[prop]?.prototype?.render) {
                return m[prop];
            }
        }
    });
    // new as of december 2022 on beta
    (Object.values(findModule((m) => {
        if (typeof m !== 'object')
            return false;
        for (let prop in m) {
            if (m[prop]?.m_mapModalManager && Object.values(m)?.find((x) => x?.type)) {
                return true;
            }
        }
        return false;
    }) || {})?.find((x) => x?.type?.toString()?.includes('((function(){')) ||
        // before december 2022 beta
        Object.values(findModule((m) => {
            if (typeof m !== 'object')
                return false;
            for (let prop in m) {
                if (m[prop]?.toString()?.includes('"ModalManager","DialogWrapper"')) {
                    return true;
                }
            }
            return false;
        }) || {})?.find((x) => x?.type?.toString()?.includes('((function(){')) ||
        // old
        findModuleChild((m) => {
            if (typeof m !== 'object')
                return undefined;
            for (let prop in m) {
                if (m[prop]?.prototype?.OK && m[prop]?.prototype?.Cancel && m[prop]?.prototype?.render) {
                    return m[prop];
                }
            }
        }));
    const ModalModule = findModule((mod) => {
        if (typeof mod !== 'object')
            return false;
        for (let prop in mod) {
            if (Object.keys(mod).length > 4 && mod[prop]?.toString().includes('.ModalPosition,fallback:'))
                return true;
        }
        return false;
    });
    const ModalModuleProps = ModalModule ? Object.values(ModalModule) : [];
    ModalModuleProps.find(prop => {
        const string = prop?.toString();
        return string?.includes(".ShowPortalModal()") && string?.includes(".OnElementReadyCallbacks.Register(");
    });
    ModalModuleProps.find(prop => prop?.toString().includes(".ModalPosition,fallback:"));
    var MessageBoxResult;
    (function (MessageBoxResult) {
        MessageBoxResult[MessageBoxResult["close"] = 0] = "close";
        MessageBoxResult[MessageBoxResult["okay"] = 1] = "okay";
    })(MessageBoxResult || (MessageBoxResult = {}));
    const RenderMessageBox = ({ props, close }) => {
        return (window.SP_REACT.createElement(ConfirmModal, { onCancel: () => close(MessageBoxResult.close), onOK: () => close(MessageBoxResult.okay), ...props }));
    };
    const ShowMessageBox = (modalProps, messageProps) => {
        const windowOptions = modalProps;
        return new Promise((resolve, _) => {
            const modal = showModal(window.SP_REACT.createElement(RenderMessageBox, { props: messageProps, close: (type) => { resolve(type); modal.Close(); } }), window, windowOptions);
        });
    };

    const Toggle = Object.values(CommonUIModule).find((mod) => mod?.render?.toString()?.includes('.ToggleOff)'));

    const classMapList = findAllModules((m) => {
        if (typeof m == "object" && !m.__esModule) {
            const keys = Object.keys(m);
            // special case some libraries
            if (keys.length == 1 && m.version)
                return false;
            // special case localization
            if (keys.length > 1000 && m.AboutSettings)
                return false;
            return keys.length > 0 && keys.every(k => !Object.getOwnPropertyDescriptor(m, k)?.get && typeof m[k] == "string");
        }
        return false;
    });
    const classMap = Object.assign({}, ...classMapList.map(obj => Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value]))));

    // Control what window controls are exposed. 
    var WindowControls;
    (function (WindowControls) {
        WindowControls[WindowControls["Minimize"] = 1] = "Minimize";
        WindowControls[WindowControls["Maximize"] = 2] = "Maximize";
        WindowControls[WindowControls["Close"] = 4] = "Close";
    })(WindowControls || (WindowControls = {}));
    /**
     * pluginSelf is a sandbox for data specific to your plugin.
     * You can't access other plugins sandboxes and they can't access yours
     *
     * example:
     * | pluginSelf.var = "Hello"
     * | console.log(pluginSelf.var) -> Hello
     */
    const pluginSelf = window.PLUGIN_LIST[pluginName];
    const Millennium = window.Millennium;
    Millennium.exposeObj = function (obj) {
        for (const key in obj) {
            exports[key] = obj[key];
        }
    };

    const CommonPatchTypes = [
        "TargetCss", "TargetJs"
    ];
    var ConditionalControlFlowType;
    (function (ConditionalControlFlowType) {
        ConditionalControlFlowType[ConditionalControlFlowType["TargetCss"] = 0] = "TargetCss";
        ConditionalControlFlowType[ConditionalControlFlowType["TargetJs"] = 1] = "TargetJs";
    })(ConditionalControlFlowType || (ConditionalControlFlowType = {}));

    const DOMModifier = {
        /**
         * Append a StyleSheet to DOM from raw text
         * @param document Target document to append StyleSheet to
         * @param innerStyle string encoded CSS
         * @param id HTMLElement id
         */
        AddStyleSheetFromText: (document, innerStyle, id) => {
            if (document.querySelectorAll(`style[id='${id}']`).length)
                return;
            document.head.appendChild(Object.assign(document.createElement('style'), { id: id })).innerText = innerStyle;
        },
        /**
         * Append a StyleSheet to DOM from loopbackhost or absolute URI
         * @param document Target document to append StyleSheet to
         * @param localPath relative/absolute path to CSS module
         */
        AddStyleSheet: (document, localPath) => {
            if (!pluginSelf.stylesAllowed)
                return;
            if (document.querySelectorAll(`link[href='${localPath}']`).length)
                return;
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
        AddJavaScript: (document, localPath) => {
            if (!pluginSelf.scriptsAllowed)
                return;
            if (document.querySelectorAll(`script[src='${localPath}'][type='module']`).length)
                return;
            document.head.appendChild(Object.assign(document.createElement('script'), {
                src: localPath,
                type: 'module', id: 'millennium-injected'
            }));
        }
    };
    /**
     * Interpolates and overrides default patches on a theme.
     * @param incomingPatches Preprocessed list of patches from a specific theme
     * @returns Processed patches, interpolated with default patches
     */
    function parseTheme(incomingPatches) {
        let patches = {
            Patches: [
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
        return filteredPatches.concat(incomingPatches);
    }
    function constructThemePath(nativeName, relativePath) {
        return `skins/${nativeName}/${relativePath}`;
    }
    const evaluatePatch = (type, modulePatch, documentTitle, classList, document) => {
        if (modulePatch[CommonPatchTypes[type]] === undefined) {
            return;
        }
        modulePatch[CommonPatchTypes[type]].affects.forEach((affectee) => {
            if (!documentTitle.match(affectee) && !classList.includes(affectee)) {
                return;
            }
            switch (type) {
                case ConditionalControlFlowType.TargetCss: {
                    DOMModifier.AddStyleSheet(document, constructThemePath(pluginSelf.activeTheme.native, modulePatch[CommonPatchTypes[type]].src));
                }
                case ConditionalControlFlowType.TargetJs: {
                    DOMModifier.AddJavaScript(document, constructThemePath(pluginSelf.activeTheme.native, modulePatch[CommonPatchTypes[type]].src));
                }
            }
        });
    };
    const evaluateConditions = (theme, title, classes, document) => {
        const themeConditions = theme.data.Conditions;
        const savedConditions = pluginSelf.conditionals[theme.native];
        for (const condition in themeConditions) {
            if (!themeConditions.hasOwnProperty(condition)) {
                return;
            }
            if (condition in savedConditions) {
                const patch = themeConditions[condition].values[savedConditions[condition]];
                evaluatePatch(ConditionalControlFlowType.TargetCss, patch, title, classes, document);
                evaluatePatch(ConditionalControlFlowType.TargetJs, patch, title, classes, document);
            }
        }
    };
    const evaluatePatches = (activeTheme, documentTitle, classList, document, context) => {
        activeTheme.data.Patches.forEach((patch) => {
            context.m_popup.window.HAS_INJECTED_THEME = documentTitle === "Steam";
            if (!documentTitle.match(patch.MatchRegexString) && !classList.includes(patch.MatchRegexString)) {
                return;
            }
            const evaluateTargetModule = (module, type) => {
                const nodeHandler = type == ConditionalControlFlowType.TargetCss ? DOMModifier.AddStyleSheet : DOMModifier.AddJavaScript;
                if (module === undefined)
                    return;
                if (typeof module === 'string') {
                    nodeHandler(document, constructThemePath(activeTheme.native, module));
                }
                else if (Array.isArray(module)) {
                    module.forEach(css => nodeHandler(document, constructThemePath(activeTheme.native, css)));
                }
            };
            evaluateTargetModule(patch?.TargetCss, ConditionalControlFlowType.TargetCss);
            evaluateTargetModule(patch?.TargetJs, ConditionalControlFlowType.TargetJs);
        });
    };
    const getDocumentClassList = (context) => {
        return (context.m_rgParams.html_class || context.m_rgParams.body_class || '').split(' ').map((className) => '.' + className);
    };
    function patchDocumentContext(windowContext) {
        if (pluginSelf.isDefaultTheme) {
            return;
        }
        const activeTheme = pluginSelf.activeTheme;
        const document = windowContext.m_popup.document;
        const classList = getDocumentClassList(windowContext);
        const documentTitle = windowContext.m_strTitle;
        // Append System Accent Colors to global document (publically shared)
        DOMModifier.AddStyleSheetFromText(document, pluginSelf.systemColor, "SystemAccentColorInject");
        activeTheme?.data?.hasOwnProperty("Patches") && evaluatePatches(activeTheme, documentTitle, classList, document, windowContext);
        activeTheme?.data?.hasOwnProperty("Conditions") && evaluateConditions(activeTheme, documentTitle, classList, document);
    }

    const isEditablePlugin = (plugin_name) => {
        return window.PLUGIN_LIST && window.PLUGIN_LIST[plugin_name]
            && typeof window.PLUGIN_LIST[plugin_name].renderPluginSettings === 'function' ? true : false;
    };
    const EditPlugin = ({ plugin }) => {
        if (!isEditablePlugin(plugin?.data?.name)) {
            return window.SP_REACT.createElement(window.SP_REACT.Fragment, null);
        }
        return (window.SP_REACT.createElement("div", { className: "_1WKUOT3FdB9-48MMP0Tz9l Focusable", style: { marginTop: 0, marginLeft: 0, marginRight: 15 }, tabIndex: 0 },
            window.SP_REACT.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 36 36", fill: "none" },
                window.SP_REACT.createElement("path", { d: "M21.75 18C21.75 18.7417 21.5301 19.4667 21.118 20.0834C20.706 20.7001 20.1203 21.1807 19.4351 21.4645C18.7498 21.7484 17.9958 21.8226 17.2684 21.6779C16.541 21.5332 15.8728 21.1761 15.3484 20.6517C14.8239 20.1272 14.4668 19.459 14.3221 18.7316C14.1774 18.0042 14.2516 17.2502 14.5355 16.5649C14.8193 15.8797 15.2999 15.294 15.9166 14.882C16.5333 14.4699 17.2583 14.25 18 14.25C18.9946 14.25 19.9484 14.6451 20.6517 15.3483C21.3549 16.0516 21.75 17.0054 21.75 18ZM6 14.25C5.25832 14.25 4.5333 14.4699 3.91661 14.882C3.29993 15.294 2.81928 15.8797 2.53545 16.5649C2.25162 17.2502 2.17736 18.0042 2.32206 18.7316C2.46675 19.459 2.8239 20.1272 3.34835 20.6517C3.8728 21.1761 4.54098 21.5332 5.26841 21.6779C5.99584 21.8226 6.74984 21.7484 7.43506 21.4645C8.12029 21.1807 8.70596 20.7001 9.11801 20.0834C9.53007 19.4667 9.75 18.7417 9.75 18C9.75 17.0054 9.35491 16.0516 8.65165 15.3483C7.94839 14.6451 6.99456 14.25 6 14.25ZM30 14.25C29.2583 14.25 28.5333 14.4699 27.9166 14.882C27.2999 15.294 26.8193 15.8797 26.5355 16.5649C26.2516 17.2502 26.1774 18.0042 26.3221 18.7316C26.4668 19.459 26.8239 20.1272 27.3484 20.6517C27.8728 21.1761 28.541 21.5332 29.2684 21.6779C29.9958 21.8226 30.7498 21.7484 31.4351 21.4645C32.1203 21.1807 32.706 20.7001 33.118 20.0834C33.5301 19.4667 33.75 18.7417 33.75 18C33.75 17.0054 33.3549 16.0516 32.6517 15.3483C31.9484 14.6451 30.9946 14.25 30 14.25Z", fill: "currentColor" }))));
    };
    const PluginViewModal = () => {
        const [plugins, setPlugins] = React.useState([]);
        const [checkedItems, setCheckedItems] = React.useState({});
        React.useEffect(() => {
            wrappedCallServerMethod("find_all_plugins").then((value) => {
                const json = JSON.parse(value);
                setCheckedItems(json.map((plugin, index) => ({ plugin, index })).filter(({ plugin }) => plugin.enabled)
                    .reduce((acc, { index }) => ({ ...acc, [index]: true }), {}));
                setPlugins(json);
            });
        }, []);
        const checkBoxChange = (index, checked) => {
            console.log(checked);
            setCheckedItems({ ...checkedItems, [index]: checked });
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement(DialogHeader, null, "Plugins"),
            window.SP_REACT.createElement(DialogBody, { className: classMap.SettingsDialogBodyFade }, plugins.map((plugin, index) => (window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel", key: index },
                window.SP_REACT.createElement("div", { className: classMap.FieldLabelRow },
                    window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, plugin?.data?.common_name),
                    window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon, style: { display: "flex", alignItems: "center" } },
                        window.SP_REACT.createElement(EditPlugin, { plugin: plugin }),
                        window.SP_REACT.createElement("div", { className: "_3N47t_-VlHS8JAEptE5rlR" },
                            window.SP_REACT.createElement(Toggle, { disabled: plugin?.data?.name == "millennium__internal", value: checkedItems[index], onChange: (checked) => checkBoxChange(index, checked) })))),
                window.SP_REACT.createElement("div", { className: classMap.FieldDescription }, plugin?.data?.description ?? "No description yet.")))))));
    };

    var ConditionType;
    (function (ConditionType) {
        ConditionType[ConditionType["Dropdown"] = 0] = "Dropdown";
        ConditionType[ConditionType["Toggle"] = 1] = "Toggle";
    })(ConditionType || (ConditionType = {}));
    class RenderThemeEditor extends React__default["default"].Component {
        constructor() {
            super(...arguments);
            this.GetConditionType = (value) => {
                if (Object.keys(value).every((element) => element === 'yes' || element === 'no')) {
                    return ConditionType.Toggle;
                }
                else {
                    return ConditionType.Dropdown;
                }
            };
            this.UpdateLocalCondition = (conditionName, newData) => {
                const activeTheme = pluginSelf.activeTheme;
                return new Promise((resolve) => {
                    wrappedCallServerMethod("cfg.change_condition", {
                        theme: activeTheme.native, newData: newData, condition: conditionName
                    })
                        .then((response) => {
                        const success = JSON.parse(response)?.success ?? false;
                        success && (pluginSelf.ConditionConfigHasChanged = true);
                        resolve(success);
                    });
                });
            };
            this.RenderComponentInterface = ({ conditionType, values, store, conditionName }) => {
                /** Dropdown items if given that the component is a dropdown */
                const items = values.map((value, index) => ({ label: value, data: "componentId" + index }));
                /** Checked status if given that the component is a toggle */
                const [checked, setChecked] = React.useState(store?.[conditionName] == "yes" ? true : false);
                // const [isHovered, setIsHovered] = useState({state: false, target: null});
                const onCheckChange = (enabled) => {
                    this.UpdateLocalCondition(conditionName, enabled ? "yes" : "no").then((success) => {
                        success && setChecked(enabled);
                    });
                };
                const onDropdownChange = (data) => {
                    this.UpdateLocalCondition(conditionName, data.label);
                };
                switch (conditionType) {
                    case ConditionType.Dropdown:
                        // @ts-ignore
                        return window.SP_REACT.createElement(Dropdown, { contextMenuPositionOptions: { bMatchWidth: false }, onChange: onDropdownChange, rgOptions: items, selectedOption: 1, strDefaultLabel: store[conditionName] });
                    case ConditionType.Toggle:
                        return window.SP_REACT.createElement(Toggle, { value: checked, onChange: onCheckChange });
                }
            };
            this.RenderComponent = ({ condition, value, store }) => {
                const conditionType = this.GetConditionType(value.values);
                return (window.SP_REACT.createElement("div", { key: condition, className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, condition),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon },
                            window.SP_REACT.createElement(this.RenderComponentInterface, { conditionType: conditionType, store: store, conditionName: condition, values: Object.keys(value?.values) }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription, dangerouslySetInnerHTML: { __html: value?.description ?? "No description yet." } })));
            };
        }
        render() {
            const activeTheme = pluginSelf.activeTheme;
            const themeConditions = activeTheme.data.Conditions;
            const savedConditions = pluginSelf?.conditionals?.[activeTheme.native];
            return (window.SP_REACT.createElement("div", { className: "ModalPosition", tabIndex: 0 },
                window.SP_REACT.createElement("style", null, `.DialogBody.aFxOaYcllWYkCfVYQJFs0:last-child { padding-bottom: 65px; }`),
                window.SP_REACT.createElement("div", { className: "ModalPosition_Content", style: { width: "100vw", height: "100vh" } },
                    window.SP_REACT.createElement("div", { className: "_3I6h_oySuLmmLY9TjIKT9s _3few7361SOf4k_YuKCmM62 MzjwfxXSiSauz8kyEuhYO Panel" },
                        window.SP_REACT.createElement("div", { className: "DialogContentTransition Panel", style: { minWidth: "100vw" } },
                            window.SP_REACT.createElement("div", { className: "DialogContent _DialogLayout _1I3NifxqTHCkE-2DeritAs " },
                                window.SP_REACT.createElement("div", { className: "DialogContent_InnerWidth" },
                                    window.SP_REACT.createElement("div", { className: "DialogHeader" },
                                        "Editing ",
                                        activeTheme?.data?.name ?? activeTheme.native),
                                    window.SP_REACT.createElement("div", { className: "DialogBody aFxOaYcllWYkCfVYQJFs0" }, Object.entries(themeConditions).map(([key, value]) => window.SP_REACT.createElement(this.RenderComponent, { condition: key, store: savedConditions, value: value }))))))))));
        }
    }

    const PromptReload = async (message) => {
        const windowOptions = {
            strTitle: "Reload Required",
            bHideMainWindowForPopouts: false,
            popupHeight: 250,
            popupWidth: 425,
        };
        const modalProps = {
            strTitle: "Reload Required",
            strDescription: message ?? "Selected changes need a reload in order to take affect. Should we reload right now?",
            strOKButtonText: "Reload Now",
            strCancelButtonText: "Reload Later"
        };
        return await ShowMessageBox(windowOptions, modalProps);
    };

    const CreatePopupBase = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function' && m[prop].toString().includes('CreatePopup(this.m_strName,this.m_rgParams))')) {
                //console.log(m[prop].toString())
                return m[prop];
            }
        }
    });
    // findModuleChild((m) => {
    //     if (typeof m !== 'object') return undefined;
    //     for (let prop in m) {
    //       if (typeof m[prop] === 'function'
    //     ) {
    //         console.log(m[prop].toString())
    //       }
    //     }
    // })
    // findAllModules((m) => {
    //     if (typeof m !== 'object') return undefined;
    //     for (let prop in m) {
    //         try {
    //             console.log(m[prop]?.toString())
    //         }
    //         catch (e) {}
    //     }
    // })
    findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function'
                && m[prop].toString().includes('this.m_OnLegacyPopupModalCountChanged')
                && m[prop].toString().includes('this.m_rgLegacyPopupModals')) {
                //console.log(m[prop].toString())
                return m[prop];
            }
        }
    });
    findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function' &&
                m[prop].toString().includes("UpdateParamsBeforeShow") &&
                m[prop].toString().includes("this.browser_info.m_eBrowserType")) {
                console.log(m[prop]);
                console.log(m[prop].toString());
            }
        }
    });
    const TitleBarControls = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function' && m[prop].toString().includes('className:"title-area-highlight"')) {
                return m[prop];
            }
        }
    });
    const NotSureWhatThisIs = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function'
                && m[prop].toString().includes('BShouldRenderMouseOverlay')
                && m[prop].toString().includes('OnMenusChanged')
                && m[prop].toString().includes('bSuppressMouseOverlay')
                && m[prop].toString().includes('elRoot')) {
                return m[prop];
            }
        }
    });
    const ContextMenuHandler = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function'
                && m[prop].toString().includes('m_rgActiveSubmenus')
                && m[prop].toString().includes('CreateContextMenuInstance')
                && m[prop].toString().includes('OnMenusChanged')) {
                return m[prop];
            }
        }
    });
    /**
     * INVESTIGATE FullModalOverlay, related to ShowLegacyPopupModal
     */
    class CreatePopup extends CreatePopupBase {
        constructor(component, strPopupName, options) {
            super(strPopupName, options);
            this.component = component;
            this.contextMenuHandler = new ContextMenuHandler();
        }
        Show() {
            super.Show();
            const RenderComponent = ({ _window }) => {
                return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                    window.SP_REACT.createElement(NotSureWhatThisIs, { ownerWindow: _window, manager: this.contextMenuHandler }),
                    window.SP_REACT.createElement("div", { className: "PopupFullWindow", onContextMenu: ((_e) => {
                            // console.log('CONTEXT MENU OPEN')
                            // _e.preventDefault()
                            // this.contextMenuHandler.CreateContextMenuInstance(_e)
                        }) },
                        window.SP_REACT.createElement(TitleBarControls, { popup: _window, hideMin: false, hideMax: false, hideActions: false, style: {} }),
                        window.SP_REACT.createElement(this.component, null))));
            };
            console.log(super.root_element);
            ReactDOM__default["default"].render(window.SP_REACT.createElement(RenderComponent, { _window: super.window }), super.root_element);
        }
        SetTitle() {
            console.log("[internal] setting title ->", this);
            if (this.m_popup && this.m_popup.document) {
                this.m_popup.document.title = "WINDOW";
            }
        }
        Render(_window, _element) {
            //console.log("called render", _window, element)
        }
        OnClose() {
        }
        OnLoad() {
            //console.log("window loaded...", this._createdWindow)
            const element = this.m_popup.document.querySelector(".DialogContent_InnerWidth");
            const height = element?.getBoundingClientRect()?.height;
            this.m_popup.SteamClient?.Window?.ResizeTo(450, height + 48, true);
            this.m_popup.SteamClient.Window.ShowWindow();
            // @ts-ignore
            // g_PopupManager.m_mapPopups.data_.forEach(popup => {
            //     if (popup.value_.m_strName == "SP Desktop_uid0" || popup.value_.m_strName == "Example Window_uid0") {
            //         console.log(popup.value_)
            //     }
            // })
        }
    }

    class AboutThemeRenderer extends React__default["default"].Component {
        constructor(props) {
            super(props);
            this.RenderDeveloperProfile = () => {
                const OpenDeveloperProfile = () => {
                    this.activeTheme?.data?.github?.owner
                        && SteamClient.System.OpenInSystemBrowser(`https://github.com/${this.activeTheme?.data?.github?.owner}/`);
                };
                return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                    window.SP_REACT.createElement("style", null, `
                ._3oeHwxQTKDkPcxDhz8jbhM.online:hover {
                    cursor: pointer !important;
                }
                
                ._1YGAHSfGavQI6MODJq-pJB.avatarHolder.no-drag.Medium.online,
                .online._2317WeOq8zJVeOi6ILQbF8._27M2GicEvwcoEI5R0FSKi9 {
                    pointer-events: none;
                }`),
                    window.SP_REACT.createElement("div", { className: "_3oeHwxQTKDkPcxDhz8jbhM online", onClick: OpenDeveloperProfile },
                        window.SP_REACT.createElement("div", { className: "_1YGAHSfGavQI6MODJq-pJB avatarHolder no-drag Medium online" },
                            window.SP_REACT.createElement("div", { className: "_1yIzy56YfJIliF6ykwhP2r avatarStatus right" }),
                            window.SP_REACT.createElement("img", { src: this.activeTheme?.data?.github?.owner ?
                                    `https://github.com/${this.activeTheme?.data?.github?.owner}.png` :
                                    'https://i.pinimg.com/736x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg', className: "_1p_QrI3ixF-RAwnxad9pEm avatar", draggable: "false" })),
                        window.SP_REACT.createElement("div", { className: "online _2317WeOq8zJVeOi6ILQbF8 _27M2GicEvwcoEI5R0FSKi9" },
                            window.SP_REACT.createElement("div", { className: "_3n8q82Bm3oNKRPFbrZOlo8" },
                                window.SP_REACT.createElement("div", { className: "r62qzcdJQ0qezZglOtiUX" }, this.activeTheme?.data?.github?.owner ?? this.activeTheme?.data?.author ?? "Anonymous")),
                            window.SP_REACT.createElement("div", { className: "_2nrSdZqzl3e01VZleoVaWp", style: { width: "100%" } },
                                window.SP_REACT.createElement("div", { className: "_2wpaptjZY-3Gn1HOPlL85O _1k82NiWym4STegDGxRBHz2 no-drag" }, "\u2705 Verified Developer"))))));
            };
            this.RenderDescription = () => {
                return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                    window.SP_REACT.createElement("div", { className: "DialogSubHeader _2rK4YqGvSzXLj1bPZL8xMJ" }, "About"),
                    window.SP_REACT.createElement("div", { className: "DialogBodyText _3fPiC9QRyT5oJ6xePCVYz8" }, this.activeTheme?.data?.description ?? "Nothing to see here yet :/")));
            };
            this.RenderInfoRow = () => {
                const themeOwner = this.activeTheme?.data?.github?.owner;
                const themeRepo = this.activeTheme?.data?.github?.repo_name;
                this.activeTheme?.data?.funding?.kofi;
                const ShowSource = () => {
                    SteamClient.System.OpenInSystemBrowser(`https://github.com/${themeOwner}/${themeRepo}`);
                };
                const ShowInFolder = () => {
                    wrappedCallServerMethod("get_steam_path").then((path) => {
                        console.log(path);
                        SteamClient.System.OpenLocalDirectoryInSystemExplorer(`${path}/steamui/skins/${this.activeTheme.native}`);
                    });
                };
                const UninstallTheme = () => {
                    wrappedCallServerMethod("uninstall_theme", {
                        owner: this.activeTheme?.data?.github?.owner,
                        repo: this.activeTheme?.data?.github?.repo_name
                    })
                        .then((raw) => {
                        const message = JSON.parse(raw);
                        console.log(message);
                        SteamClient.Browser.RestartJSContext();
                    });
                };
                return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                    themeOwner && themeRepo && window.SP_REACT.createElement("button", { type: "button", style: { width: "unset" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", onClick: ShowSource }, "View Source Code"),
                    window.SP_REACT.createElement("div", { className: ".flex-btn-container", style: { display: "flex", gap: "5px" } },
                        window.SP_REACT.createElement("button", { type: "button", style: { width: "50%", }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", onClick: ShowInFolder }, "Show in Folder"),
                        window.SP_REACT.createElement("button", { type: "button", style: { width: "50%" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", onClick: UninstallTheme }, "Uninstall"))));
            };
            this.CreateModalBody = () => {
                return (window.SP_REACT.createElement("div", { className: "ModalPosition", tabIndex: 0 },
                    window.SP_REACT.createElement("div", { className: "ModalPosition_Content", style: { width: "100vw", height: "100vh" } },
                        window.SP_REACT.createElement("div", { className: "DialogContent _DialogLayout GenericConfirmDialog _DialogCenterVertically" },
                            window.SP_REACT.createElement("div", { className: "DialogContent_InnerWidth", style: { flex: "unset" } },
                                window.SP_REACT.createElement("div", { className: "DialogHeader" }, this.activeTheme?.data?.name ?? this.activeTheme?.native),
                                window.SP_REACT.createElement("div", { className: "DialogBody Panel Focusable", style: { flex: "unset" } },
                                    window.SP_REACT.createElement(this.RenderDeveloperProfile, null),
                                    window.SP_REACT.createElement(this.RenderDescription, null),
                                    window.SP_REACT.createElement(this.RenderInfoRow, null)))))));
            };
            this.activeTheme = pluginSelf.activeTheme;
        }
        render() {
            return (window.SP_REACT.createElement(this.CreateModalBody, null));
        }
    }
    const SetupAboutRenderer = (active) => {
        const params = {
            title: "About " + active,
            popup_class: "fullheight",
            body_class: "fullheight ModalDialogBody DesktopUI ",
            html_class: "client_chat_frame fullheight ModalDialogPopup ",
            eCreationFlags: 274,
            window_opener_id: 1,
            dimensions: { width: 450, height: 375 },
            replace_existing_popup: false,
        };
        const popupWND = new CreatePopup(AboutThemeRenderer, "about_theme", params);
        popupWND.Show();
    };

    const ShowThemeSettings = async (activeTheme) => {
        const title = "Editing " + activeTheme;
        const OnClose = () => {
            if (!pluginSelf.ConditionConfigHasChanged) {
                return;
            }
            PromptReload().then((result) => {
                if (result === MessageBoxResult.okay) {
                    SteamClient.Browser.RestartJSContext();
                }
            });
            pluginSelf.ConditionConfigHasChanged = false;
        };
        const windowOptions = {
            strTitle: title,
            bHideMainWindowForPopouts: false,
            popupHeight: 675,
            popupWidth: 850,
            browserContext: 1,
            fnOnClose: OnClose
        };
        showModal(window.SP_REACT.createElement(RenderThemeEditor, null), window, windowOptions);
        /**
         * hacky solution to extending the restrcited showModal wrapper.
         * @todo fix with custom wrapper
         * @returns window details of open modal
         */
        const findWindow = () => {
            return new Promise((resolve, _reject) => {
                (function checkAgain() {
                    setTimeout(() => {
                        // @ts-ignore
                        const modalResult = Array.from(g_PopupManager.m_mapPopups.data_, ([key, value]) => ({ key, value })).find((value) => {
                            if (value.key === title)
                                return value.value;
                        });
                        !modalResult ? checkAgain() : resolve(modalResult);
                    }, 1);
                })();
            });
        };
        const window1 = await findWindow();
        const body = window1.value.value_.m_popup.document.body;
        body.classList.add("DesktopUI");
    };
    /**
     * Display the edit theme button on a theme if applicable
     * @param active the common name of a theme
     * @returns react component
     */
    const RenderEditTheme = ({ active }) => {
        /** Current theme is not editable */
        if (pluginSelf.isDefaultTheme || pluginSelf.activeTheme.data?.Conditions === undefined) {
            return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null));
        }
        return (window.SP_REACT.createElement("button", { onClick: () => ShowThemeSettings(active), style: { margin: "0", padding: "0px 10px", marginRight: "10px" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" },
            window.SP_REACT.createElement(IconsModule.Edit, { style: { height: "16px" } })));
    };
    const findAllThemes = async () => {
        const activeTheme = await wrappedCallServerMethod("cfg.get_active_theme");
        return new Promise(async (resolve) => {
            let buffer = JSON.parse(await wrappedCallServerMethod("find_all_themes"))
                /** Prevent the selected theme from appearing in combo box */
                .filter((theme) => !pluginSelf.isDefaultTheme ? theme.native !== activeTheme.native : true)
                .map((theme, index) => ({
                label: theme?.data?.name ?? theme.native, theme: theme, data: "theme" + index
            }));
            /** Add the default theme to list */
            !pluginSelf.isDefaultTheme && buffer.unshift({ label: "< Default >", data: "default", theme: null });
            resolve(buffer);
        });
    };
    const ThemeViewModal = () => {
        const [themes, setThemes] = React.useState();
        const [active, setActive] = React.useState();
        const [jsState, setJsState] = React.useState(undefined);
        const [cssState, setCssState] = React.useState(undefined);
        React.useEffect(() => {
            const activeTheme = pluginSelf.activeTheme;
            pluginSelf.isDefaultTheme ? setActive("Default") : setActive(activeTheme?.data?.name ?? activeTheme.native);
            findAllThemes().then((result) => setThemes(result));
            wrappedCallServerMethod("cfg.get_config_str").then((value) => {
                const json = JSON.parse(value);
                setJsState(json.scripts);
                setCssState(json.styles);
            });
        }, []);
        const onScriptToggle = (enabled) => {
            setJsState(enabled);
            PromptReload().then((selection) => {
                if (selection == MessageBoxResult.okay) {
                    wrappedCallServerMethod("cfg.set_config_keypair", { key: "scripts", value: enabled });
                    window.location.reload();
                }
            });
        };
        const onStyleToggle = (enabled) => {
            setCssState(enabled);
            PromptReload().then((selection) => {
                if (selection == MessageBoxResult.okay) {
                    wrappedCallServerMethod("cfg.set_config_keypair", { key: "styles", value: enabled });
                    SteamClient.Browser.RestartJSContext();
                }
            });
        };
        const updateThemeCallback = (item) => {
            const themeName = item.data === "default" ? "__default__" : item.theme.native;
            wrappedCallServerMethod("cfg.change_theme", { theme_name: themeName });
            findAllThemes().then((result) => setThemes(result));
            PromptReload().then((selection) => {
                if (selection == MessageBoxResult.okay) {
                    SteamClient.Browser.RestartJSContext();
                }
            });
        };
        const OpenThemeRepository = () => {
            SteamClient.System.OpenInSystemBrowser("https://steambrew.app/themes");
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("style", null, `.DialogDropDown._DialogInputContainer.Panel.Focusable {
                        min-width: max-content !important;
                    }`),
            window.SP_REACT.createElement(DialogHeader, null, "Themes"),
            window.SP_REACT.createElement(DialogBody, { className: classMap.SettingsDialogBodyFade },
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, "Client Theme"),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon },
                            window.SP_REACT.createElement(RenderEditTheme, { active: active }),
                            !pluginSelf.isDefaultTheme &&
                                window.SP_REACT.createElement("button", { onClick: () => SetupAboutRenderer(active), style: { margin: "0", padding: "0px 10px", marginRight: "10px" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" },
                                    window.SP_REACT.createElement(IconsModule.Information, { style: { height: "16px" } })),
                            window.SP_REACT.createElement(Dropdown, { contextMenuPositionOptions: { bMatchWidth: false }, rgOptions: themes, selectedOption: 1, strDefaultLabel: active, onChange: updateThemeCallback }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription },
                        window.SP_REACT.createElement("div", null, "Select the theme you want Steam to use (requires reload)"),
                        window.SP_REACT.createElement("a", { href: "#", onClick: OpenThemeRepository, className: "RmxP90Yut4EIwychIEg51", style: { display: "flex", gap: "5px" } },
                            window.SP_REACT.createElement(IconsModule.Hyperlink, { style: { width: "14px" } }),
                            "Get more themes"))),
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, "Inject Javascript"),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon }, jsState !== undefined && window.SP_REACT.createElement(Toggle, { value: jsState, onChange: onScriptToggle }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription }, "Decide whether themes are allowed to insert javascript into Steam. Disabling javascript may break Steam interface as a byproduct (requires reload)")),
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, "Inject StyleSheets"),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon }, cssState !== undefined && window.SP_REACT.createElement(Toggle, { value: cssState, onChange: onStyleToggle }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription }, "Decide whether themes are allowed to insert stylesheets into Steam. (requires reload)")))));
    };

    const UpToDateModal = () => {
        return (window.SP_REACT.createElement("div", { className: "__up-to-date-container", style: {
                display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", height: "100%", justifyContent: "center"
            } },
            window.SP_REACT.createElement("div", { className: "__up-to-date-header", style: { marginTop: "-120px", color: "white", fontWeight: "500", fontSize: "15px" } }, "No updates found. You're good to go!"),
            window.SP_REACT.createElement("svg", { viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { width: "40px" } },
                window.SP_REACT.createElement("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }),
                window.SP_REACT.createElement("g", { id: "SVGRepo_tracerCarrier", strokeLinecap: "round", strokeLinejoin: "round" }),
                window.SP_REACT.createElement("g", { id: "SVGRepo_iconCarrier" },
                    window.SP_REACT.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z", fill: "#55bd00" })))));
    };
    const RenderAvailableUpdates = ({ updates, setUpdates }) => {
        const [updating, setUpdating] = React.useState([]);
        const viewMoreClick = (props) => window.open(props?.commit, "_blank");
        const updateItemMessage = (updateObject, index) => {
            setUpdating({ ...updating, [index]: true });
            wrappedCallServerMethod("updater.update_theme", { native: updateObject.native }).then((success) => {
                /** @todo: prompt user an error occured. */
                if (!success)
                    return;
                wrappedCallServerMethod("updater.get_update_list").then((result) => {
                    setUpdates(JSON.parse(result).updates);
                });
            });
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement(DialogSubHeader, { className: '_2rK4YqGvSzXLj1bPZL8xMJ' }, "Updates Available!"),
            window.SP_REACT.createElement(DialogBodyText, { className: '_3fPiC9QRyT5oJ6xePCVYz8' }, "Millennium found the following updates on your themes."),
            updates.map((update, index) => (window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel", key: index },
                window.SP_REACT.createElement("div", { className: classMap.FieldLabelRow },
                    window.SP_REACT.createElement("div", { className: "update-item-type", style: { color: "white", fontSize: "12px", padding: "4px", background: "#007eff", borderRadius: "6px" } }, "Theme"),
                    window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, update.name),
                    window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon },
                        window.SP_REACT.createElement("div", { className: "_3N47t_-VlHS8JAEptE5rlR", style: { gap: "10px", width: "200px" } },
                            window.SP_REACT.createElement("button", { onClick: () => viewMoreClick(update), className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" }, "View More"),
                            window.SP_REACT.createElement("button", { onClick: () => updateItemMessage(update, index), className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" }, updating[index] ? "Updating..." : "Update")))),
                window.SP_REACT.createElement("div", { className: classMap.FieldDescription },
                    window.SP_REACT.createElement("b", null, "Released:"),
                    " ",
                    update?.date),
                window.SP_REACT.createElement("div", { className: classMap.FieldDescription },
                    window.SP_REACT.createElement("b", null, "Patch Notes:"),
                    " ",
                    update?.message))))));
    };
    const UpdatesViewModal = () => {
        const [updates, setUpdates] = React.useState(null);
        const [checkingForUpdates, setCheckingForUpdates] = React.useState(false);
        React.useEffect(() => {
            wrappedCallServerMethod("updater.get_update_list").then((result) => {
                console.log(result);
                setUpdates(JSON.parse(result).updates);
            });
        }, []);
        const checkForUpdates = async () => {
            if (checkingForUpdates)
                return;
            setCheckingForUpdates(true);
            await wrappedCallServerMethod("updater.re_initialize");
            wrappedCallServerMethod("updater.get_update_list").then((result) => {
                setUpdates(JSON.parse(result).updates);
                setCheckingForUpdates(false);
            });
        };
        const DialogHeaderStyles = {
            display: "flex", alignItems: "center", gap: "15px"
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement(DialogHeader, { style: DialogHeaderStyles },
                "Updates",
                !checkingForUpdates &&
                    window.SP_REACT.createElement("button", { onClick: checkForUpdates, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", style: { width: "16px", "-webkit-app-region": "no-drag", zIndex: "9999", padding: "4px 4px", display: "flex" } },
                        window.SP_REACT.createElement(IconsModule.Update, null))),
            window.SP_REACT.createElement(DialogBody, { className: classMap.SettingsDialogBodyFade }, updates && (!updates.length ? window.SP_REACT.createElement(UpToDateModal, null) : window.SP_REACT.createElement(RenderAvailableUpdates, { updates: updates, setUpdates: setUpdates })))));
    };

    var Renderer;
    (function (Renderer) {
        Renderer[Renderer["Plugins"] = 0] = "Plugins";
        Renderer[Renderer["Themes"] = 1] = "Themes";
        Renderer[Renderer["Updates"] = 2] = "Updates";
        Renderer[Renderer["Unset"] = 3] = "Unset";
    })(Renderer || (Renderer = {}));
    const RenderViewComponent = (componentType) => {
        Millennium.findElement(pluginSelf.settingsDoc, ".DialogContent_InnerWidth").then((element) => {
            switch (componentType) {
                case Renderer.Plugins:
                    ReactDOM__default["default"].render(window.SP_REACT.createElement(PluginViewModal, null), element[0]);
                    break;
                case Renderer.Themes:
                    ReactDOM__default["default"].render(window.SP_REACT.createElement(ThemeViewModal, null), element[0]);
                    break;
                case Renderer.Updates:
                    ReactDOM__default["default"].render(window.SP_REACT.createElement(UpdatesViewModal, null), element[0]);
                    break;
            }
        });
    };
    const PluginComponent = () => {
        const [selected, setSelected] = React.useState();
        const nativeTabs = pluginSelf.settingsDoc.querySelectorAll(".bkfjn0yka2uHNqEvWZaTJ:not(.MillenniumTab)");
        nativeTabs.forEach((element) => element.onclick = () => setSelected(Renderer.Unset));
        const componentUpdate = (type) => {
            RenderViewComponent(type);
            setSelected(type);
            nativeTabs.forEach((element) => {
                element.classList.remove("Myra7iGjzCdMPzitboVfh");
            });
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("div", { className: `MillenniumTab bkfjn0yka2uHNqEvWZaTJ ${selected == Renderer.Plugins ? "Myra7iGjzCdMPzitboVfh" : ""}`, onClick: () => componentUpdate(Renderer.Plugins) },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement("svg", { version: "1.1", id: "Icons", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 32 32", xmlSpace: "preserve" },
                        window.SP_REACT.createElement("g", null,
                            window.SP_REACT.createElement("path", { d: "M18.3,17.3L15,20.6L11.4,17l3.3-3.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L10,15.6l-1.3-1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4 L7.6,16l-2.8,2.8C3.6,19.9,3,21.4,3,23c0,1.3,0.4,2.4,1.1,3.5l-2.8,2.8c-0.4,0.4-0.4,1,0,1.4C1.5,30.9,1.7,31,2,31s0.5-0.1,0.7-0.3 l2.8-2.8C6.5,28.6,7.7,29,9,29c1.6,0,3.1-0.6,4.2-1.7l2.8-2.8l0.3,0.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L16.4,22l3.3-3.3c0.4-0.4,0.4-1,0-1.4S18.7,16.9,18.3,17.3z", fill: "currentColor" }),
                            window.SP_REACT.createElement("path", { d: "M30.7,1.3c-0.4-0.4-1-0.4-1.4,0l-2.8,2.8C25.5,3.4,24.3,3,23,3c-1.6,0-3.1,0.6-4.2,1.7l-3.5,3.5c-0.4,0.4-0.4,1,0,1.4l7,7 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3.5-3.5C28.4,12.1,29,10.6,29,9c0-1.3-0.4-2.4-1.1-3.5l2.8-2.8 C31.1,2.3,31.1,1.7,30.7,1.3z", fill: "currentColor" })))),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, "Plugins")),
            window.SP_REACT.createElement("div", { className: `MillenniumTab bkfjn0yka2uHNqEvWZaTJ ${selected == Renderer.Themes ? "Myra7iGjzCdMPzitboVfh" : ""}`, onClick: () => componentUpdate(Renderer.Themes) },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 48 48" },
                        window.SP_REACT.createElement("g", { id: "_21_-_30", "data-name": "21 - 30" },
                            window.SP_REACT.createElement("g", { id: "Art" },
                                window.SP_REACT.createElement("path", { d: "M45.936,18.9a23.027,23.027,0,0,0-1.082-2.1L39.748,30.67a4.783,4.783,0,0,1-.837,1.42,8.943,8.943,0,0,0,7.464-12.115C46.239,19.609,46.093,19.253,45.936,18.9Z", fill: "currentColor" }),
                                window.SP_REACT.createElement("path", { d: "M16.63,6.4A23.508,23.508,0,0,0,2.683,37.268c.031.063.052.125.083.188a8.935,8.935,0,0,0,15.662,1.526A16.713,16.713,0,0,1,26.165,32.7c.1-.04.2-.07.3-.107a6.186,6.186,0,0,1,3.859-3.453,4.865,4.865,0,0,1,.451-2.184l7.9-17.107A23.554,23.554,0,0,0,16.63,6.4ZM10.5,32.5a4,4,0,1,1,4-4A4,4,0,0,1,10.5,32.5Zm5-11.5a4,4,0,1,1,4-4A4,4,0,0,1,15.5,21Zm12-3.5a4,4,0,1,1,4-4A4,4,0,0,1,27.5,17.5Z", fill: "currentColor" }),
                                window.SP_REACT.createElement("path", { d: "M45.478,4.151a1.858,1.858,0,0,0-2.4.938L32.594,27.794a2.857,2.857,0,0,0,.535,3.18,4.224,4.224,0,0,0-4.865,2.491c-1.619,3.91.942,5.625-.678,9.535a10.526,10.526,0,0,0,8.5-6.3,4.219,4.219,0,0,0-1.25-4.887,2.85,2.85,0,0,0,3.037-1.837l8.64-23.471A1.859,1.859,0,0,0,45.478,4.151Z", fill: "currentColor" }))))),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, "Themes")),
            window.SP_REACT.createElement("div", { className: `MillenniumTab bkfjn0yka2uHNqEvWZaTJ ${selected == Renderer.Updates ? "Myra7iGjzCdMPzitboVfh" : ""}`, onClick: () => componentUpdate(Renderer.Updates) },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement(IconsModule.Update, null)),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, "Updates")),
            window.SP_REACT.createElement("div", { className: "_1UEEmNDZ7Ta3enwTf5T0O0" })));
    };
    /**
     * Hooks settings tabs components, and forces active overlayed panels to re-render
     * @todo A better, more integrated way of doing this, that doesn't involve runtime patching.
     */
    const hookSettingsComponent = () => {
        const elements = pluginSelf.settingsDoc.querySelectorAll('.bkfjn0yka2uHNqEvWZaTJ:not(.MillenniumTab)');
        let processingItem = false;
        elements.forEach((element, index) => {
            element.addEventListener('click', function (_) {
                if (processingItem)
                    return;
                pluginSelf.settingsDoc.querySelectorAll('._1UEEmNDZ7Ta3enwTf5T0O0').forEach((element) => element.classList.remove("SeoUZ6M01FoetLA2uCUtT"));
                const click = new MouseEvent("click", { view: pluginSelf.settingsWnd, bubbles: true, cancelable: true });
                try {
                    processingItem = true;
                    if (index + 1 <= elements.length)
                        elements[index + 1].dispatchEvent(click);
                    else
                        elements[index - 2].dispatchEvent(click);
                    elements[index].dispatchEvent(click);
                    processingItem = false;
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
    };
    function RenderSettingsModal(_context) {
        pluginSelf.settingsDoc = _context.m_popup.document;
        pluginSelf.settingsWnd = _context.m_popup.window;
        Millennium.findElement(_context.m_popup.document, "._EebF_xe4DGRZ9a0XkyDj.Panel").then(element => {
            hookSettingsComponent();
            // Create a new div element
            var bufferDiv = document.createElement("div");
            element[0].prepend(bufferDiv);
            ReactDOM__default["default"].render(window.SP_REACT.createElement(PluginComponent, null), bufferDiv);
        });
    }

    const getBackendProps = () => {
        return new Promise(async (resolve, _reject) => {
            resolve(JSON.parse(await wrappedCallServerMethod("get_load_config")));
        });
    };
    function windowCreated(windowContext) {
        const title = windowContext.m_strTitle;
        // @ts-ignore
        if (title == LocalizationManager.LocalizeString("#Settings_Title")) {
            RenderSettingsModal(windowContext);
        }
        // @ts-ignore
        g_PopupManager.m_mapPopups.data_.forEach((element) => {
            if (element.value_.m_strName == 'SP Desktop_uid0') {
                // main steam window popup sometimes doesn't get hooked. steam bug
                if (element.value_.m_popup.window.HAS_INJECTED_THEME === undefined) {
                    patchDocumentContext(element.value_);
                }
            }
        });
        patchDocumentContext(windowContext);
    }
    console.log(IconsModule);
    const ReloadMillenniumFrontend = () => {
        SteamClient.Browser.RestartJSContext();
    };
    Millennium.exposeObj({ ReloadMillenniumFrontend });
    // Entry point on the front end of your plugin
    async function PluginMain() {
        const startTime = performance.now();
        getBackendProps().then((result) => {
            console.log(`Received props [${performance.now() - startTime}ms]`, result);
            pluginSelf.conditionals = result.conditions;
            const theme = result.active_theme;
            const systemColors = result.accent_color;
            pluginSelf.scriptsAllowed = result?.settings?.scripts ?? true;
            pluginSelf.stylesAllowed = result?.settings?.styles ?? true;
            pluginSelf.systemColor = `
        :root {
            --SystemAccentColor: ${systemColors.accent};
            --SystemAccentColorLight1: ${systemColors.light1};
            --SystemAccentColorLight2: ${systemColors.light2};
            --SystemAccentColorLight3: ${systemColors.light3};
            --SystemAccentColorDark1: ${systemColors.dark1};
            --SystemAccentColorDark2: ${systemColors.dark2};
            --SystemAccentColorDark3: ${systemColors.dark3};
        }`;
            theme?.failed && (pluginSelf.isDefaultTheme = true);
            // evaluate overriden patch keys from default patches, if specified. 
            if (theme?.data?.UseDefaultPatches) {
                theme.data.Patches = parseTheme(theme?.data?.Patches ?? []);
            }
            pluginSelf.activeTheme = theme;
            console.log(pluginSelf.activeTheme);
        });
        Millennium.AddWindowCreateHook(windowCreated);
    }

    exports["default"] = PluginMain;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, window.SP_REACT, window.SP_REACTDOM);

function globalize() {
	// Assign the plugin on plugin list. 
	Object.assign(window.PLUGIN_LIST[pluginName], millennium_main);
	// Run the rolled up plugins default exported function 
	millennium_main["default"]();
	// Notify Millennium this plugin has loaded. This propegates and calls the backend method.
	MILLENNIUM_BACKEND_IPC.postMessage(1, { pluginName: pluginName });
}
globalize()