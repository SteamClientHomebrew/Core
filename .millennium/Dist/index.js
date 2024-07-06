const pluginName = "core";
function InitializePlugins() {
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
InitializePlugins()
async function wrappedCallServerMethod(methodName, kwargs) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        Millennium.callServerMethod(pluginName, methodName, kwargs).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}
var millennium_main = (function (exports, React, ReactDOM) {
    'use strict';

    const bgStyle1 = 'background: #8a16a2; color: black;';
    const log = (name, ...args) => {
        console.log(`%c @millennium/ui %c ${name} %c`, bgStyle1, 'background: #b11cce; color: black;', 'background: transparent;', ...args);
    };
    const group = (name, ...args) => {
        console.group(`%c @millennium/ui %c ${name} %c`, bgStyle1, 'background: #b11cce; color: black;', 'background: transparent;', ...args);
    };
    const groupEnd = (name, ...args) => {
        console.groupEnd();
        if (args?.length > 0)
            console.log(`^ %c @millennium/ui %c ${name} %c`, bgStyle1, 'background: #b11cce; color: black;', 'background: transparent;', ...args);
    };
    const debug = (name, ...args) => {
        console.debug(`%c @millennium/ui %c ${name} %c`, bgStyle1, 'background: #1abc9c; color: black;', 'color: blue;', ...args);
    };
    const warn = (name, ...args) => {
        console.warn(`%c @millennium/ui %c ${name} %c`, bgStyle1, 'background: #ffbb00; color: black;', 'color: blue;', ...args);
    };
    const error = (name, ...args) => {
        console.error(`%c @millennium/ui %c ${name} %c`, bgStyle1, 'background: #FF0000;', 'background: transparent;', ...args);
    };
    let Logger$1 = class Logger {
        constructor(name) {
            this.name = name;
            this.name = name;
        }
        log(...args) {
            log(this.name, ...args);
        }
        debug(...args) {
            debug(this.name, ...args);
        }
        warn(...args) {
            warn(this.name, ...args);
        }
        error(...args) {
            error(this.name, ...args);
        }
        group(...args) {
            group(this.name, ...args);
        }
        groupEnd(...args) {
            groupEnd(this.name, ...args);
        }
    };

    const logger = new Logger$1('Webpack');
    let modules = [];
    function initModuleCache() {
        const startTime = performance.now();
        logger.group('Webpack Module Init');
        // Webpack 5, currently on beta
        // Generate a fake module ID
        const id = Math.random(); // really should be an int and not a float but who cares
        let webpackRequire;
        // Insert our module in a new chunk.
        // The module will then be called with webpack's internal require function as its first argument
        window.webpackChunksteamui.push([
            [id],
            {},
            (r) => {
                webpackRequire = r;
            },
        ]);
        logger.log('Initializing all modules. Errors here likely do not matter, as they are usually just failing module side effects.');
        // Loop over every module ID
        for (let i of Object.keys(webpackRequire.m)) {
            try {
                const module = webpackRequire(i);
                if (module) {
                    modules.push(module);
                }
            }
            catch (e) {
                logger.debug('Ignoring require error for module', i, e);
            }
        }
        logger.groupEnd(`Modules initialized in ${performance.now() - startTime}ms...`);
    }
    initModuleCache();
    const findModule = (filter) => {
        for (const m of modules) {
            if (m.default && filter(m.default))
                return m.default;
            if (filter(m))
                return m;
        }
    };
    const findModuleDetailsByExport = (filter, minExports) => {
        for (const m of modules) {
            if (!m)
                continue;
            for (const mod of [m.default, m]) {
                if (typeof mod !== 'object')
                    continue;
                for (let exportName in mod) {
                    if (mod?.[exportName]) {
                        const filterRes = filter(mod[exportName], exportName);
                        if (filterRes) {
                            return [mod, mod[exportName], exportName];
                        }
                        else {
                            continue;
                        }
                    }
                }
            }
        }
        return [undefined, undefined, undefined];
    };
    const findModuleByExport = (filter, minExports) => {
        return findModuleDetailsByExport(filter)?.[0];
    };
    const findModuleExport = (filter, minExports) => {
        return findModuleDetailsByExport(filter)?.[1];
    };
    /**
     * @deprecated use findModuleExport instead
     */
    const findModuleChild = (filter) => {
        for (const m of modules) {
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
        for (const m of modules) {
            if (m.default && filter(m.default))
                out.push(m.default);
            if (filter(m))
                out.push(m);
        }
        return out;
    };
    const CommonUIModule = modules.find((m) => {
        if (typeof m !== 'object')
            return false;
        for (let prop in m) {
            if (m[prop]?.contextType?._currentValue && Object.keys(m).length > 60)
                return true;
        }
        return false;
    });
    const IconsModule = findModuleByExport((e) => e?.toString && /Spinner\)}\)?,.\.createElement\(\"path\",{d:\"M18 /.test(e.toString()));
    const ReactRouter = findModuleByExport((e) => e.computeRootMatch);

    const CommonDialogDivs = Object.values(CommonUIModule).filter((m) => typeof m === 'object' && m?.render?.toString().includes('createElement("div",{...') ||
        m?.render?.toString().includes('createElement("div",Object.assign({},'));
    const MappedDialogDivs = new Map(Object.values(CommonDialogDivs).map((m) => {
        try {
            const renderedDiv = m.render({});
            // Take only the first class name segment as it identifies the element we want
            return [renderedDiv.props.className.split(' ')[0], m];
        }
        catch (e) {
            console.error("[DFL:Dialog]: failed to render common dialog component", e);
            return [null, null];
        }
    }));
    const DialogHeader = MappedDialogDivs.get('DialogHeader');
    const DialogSubHeader = MappedDialogDivs.get('DialogSubHeader');
    MappedDialogDivs.get('DialogFooter');
    MappedDialogDivs.get('DialogLabel');
    const DialogBodyText = MappedDialogDivs.get('DialogBodyText');
    const DialogBody = MappedDialogDivs.get('DialogBody');
    MappedDialogDivs.get('DialogControlsSection');
    MappedDialogDivs.get('DialogControlsSectionHeader');
    Object.values(CommonUIModule).find((mod) => mod?.render?.toString()?.includes('"DialogButton","_DialogLayout","Primary"'));
    const DialogButtonSecondary = Object.values(CommonUIModule).find((mod) => mod?.render?.toString()?.includes('"DialogButton","_DialogLayout","Secondary"'));
    // This is the "main" button. The Primary can act as a submit button,
    // therefore secondary is chosen (also for backwards comp. reasons)
    const DialogButton = DialogButtonSecondary;

    // Button isn't exported, so call DialogButton to grab it
    const Button = DialogButton?.render({}).type;

    (window && window.__setFunctionName) || function (f, name, prefix) {
        if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
    };
    /**
     * Create a Regular Expression to search for a React component that uses certain props in order.
     *
     * @export
     * @param {string[]} propList Ordererd list of properties to search for
     * @returns {RegExp} RegEx to call .test(component.toString()) on
     */
    function createPropListRegex(propList, fromStart = true) {
        let regexString = fromStart ? "const\{" : "";
        propList.forEach((prop, propIdx) => {
            regexString += `"?${prop}"?:[a-zA-Z_$]{1,2}`;
            if (propIdx < propList.length - 1) {
                regexString += ",";
            }
        });
        // TODO provide a way to enable this
        // console.debug(`[DFL:Utils] createPropListRegex generated regex "${regexString}" for props`, propList);
        return new RegExp(regexString);
    }
    function fakeRenderComponent(fun, customHooks = {}) {
        const hooks = window.SP_REACT.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher
            .current;
        // TODO: add more hooks
        let oldHooks = {
            useContext: hooks.useContext,
            useCallback: hooks.useCallback,
            useLayoutEffect: hooks.useLayoutEffect,
            useEffect: hooks.useEffect,
            useMemo: hooks.useMemo,
            useRef: hooks.useRef,
            useState: hooks.useState,
        };
        hooks.useCallback = (cb) => cb;
        hooks.useContext = (cb) => cb._currentValue;
        hooks.useLayoutEffect = (_) => { }; //cb();
        hooks.useMemo = (cb, _) => cb;
        hooks.useEffect = (_) => { }; //cb();
        hooks.useRef = (val) => ({ current: val || {} });
        hooks.useState = (v) => {
            let val = v;
            return [val, (n) => (val = n)];
        };
        Object.assign(hooks, customHooks);
        const res = fun(hooks);
        Object.assign(hooks, oldHooks);
        return res;
    }

    const classMapList = findAllModules((m) => {
        if (typeof m == 'object' && !m.__esModule) {
            const keys = Object.keys(m);
            // special case some libraries
            if (keys.length == 1 && m.version)
                return false;
            // special case localization
            if (keys.length > 1000 && m.AboutSettings)
                return false;
            return keys.length > 0 && keys.every((k) => !Object.getOwnPropertyDescriptor(m, k)?.get && typeof m[k] == 'string');
        }
        return false;
    });
    const classMap = Object.assign({}, ...classMapList.map(obj => Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value]))));
    function findClassModule(filter) {
        return classMapList.find((m) => filter(m));
    }

    findClassModule((m) => m.Title && m.QuickAccessMenu && m.BatteryDetailsLabels);
    findClassModule((m) => m.ScrollPanel);
    findClassModule((m) => m.GamepadDialogContent && !m.BindingButtons);
    findClassModule((m) => m.BatteryPercentageLabel && m.PanelSection && !m['vr-dashboard-bar-height'] && !m.QuickAccessMenu && !m.QuickAccess && !m.PerfProfileInfo);
    findClassModule((m) => m.OOBEUpdateStatusContainer);
    findClassModule((m) => m.PlayBarDetailLabel);
    findClassModule((m) => m.SliderControlPanelGroup);
    findClassModule((m) => m.TopCapsule);
    findClassModule((m) => m.HeaderLoaded);
    findClassModule((m) => m.BasicUiRoot);
    findClassModule((m) => m.GamepadTabbedPage);
    findClassModule((m) => m.BasicContextMenuModal);
    findClassModule((m) => m.AchievementListItemBase && !m.Page);
    findClassModule((m) => m.AchievementListItemBase && m.Page);
    findClassModule((m) => m.AppRunningControls && m.OverlayAchievements);
    findClassModule((m) => m.AppDetailsRoot);
    findClassModule(m => m.SpinnerLoaderContainer);
    findClassModule(m => m.QuickAccessFooter);
    findClassModule(m => m.PlayButtonContainer);
    findClassModule(m => m.LongTitles && m.GreyBackground);
    findClassModule(m => m.GamepadLibrary);
    findClassModule(m => m.FocusRingRoot);
    findClassModule(m => m.SearchAndTitleContainer);
    findClassModule(m => m.MainBrowserContainer);

    function sleep(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }
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

    const buttonItemRegex = createPropListRegex(["highlightOnFocus", "childrenContainerWidth"], false);
    Object.values(CommonUIModule).find((mod) => (mod?.render?.toString && buttonItemRegex.test(mod.render.toString())) ||
        mod?.render?.toString?.().includes('childrenContainerWidth:"min"'));

    findModuleExport((e) => e.render?.toString().includes('setFocusedColumn:'));

    findModuleExport((e) => e?.toString && e.toString().includes('().ControlsListChild') && e.toString().includes('().ControlsListOuterPanel'));

    Object.values(findModule((m) => {
        if (typeof m !== 'object')
            return false;
        for (const prop in m) {
            if (m[prop]?.prototype?.GetPanelElementProps)
                return true;
        }
        return false;
    })).find((m) => m.contextType &&
        m.prototype?.render.toString().includes('fallback:') &&
        m?.prototype?.SetChecked &&
        m?.prototype?.Toggle &&
        m?.prototype?.GetPanelElementProps);

    const Dropdown = Object.values(CommonUIModule).find((mod) => mod?.prototype?.SetSelectedOption && mod?.prototype?.BuildMenu);
    const dropdownItemRegex = createPropListRegex(["dropDownControlRef", "description"], false);
    Object.values(CommonUIModule).find((mod) => mod?.toString && dropdownItemRegex.test(mod.toString()));

    findModuleExport((e) => e.InstallErrorReportingStore && e?.prototype?.Reset && e?.prototype?.componentDidCatch); // Actually a class but @types/react is broken lol

    findModuleExport((e) => e?.render?.toString().includes('"shift-children-below"'));

    const focusableRegex = createPropListRegex(["flow-children", "onActivate", "onCancel", "focusClassName", "focusWithinClassName"]);
    findModuleExport((e) => e?.render?.toString && focusableRegex.test(e.render.toString()));

    findModuleExport((e) => e?.toString()?.includes('.GetShowDebugFocusRing())'));

    var GamepadButton;
    (function (GamepadButton) {
        GamepadButton[GamepadButton["INVALID"] = 0] = "INVALID";
        GamepadButton[GamepadButton["OK"] = 1] = "OK";
        GamepadButton[GamepadButton["CANCEL"] = 2] = "CANCEL";
        GamepadButton[GamepadButton["SECONDARY"] = 3] = "SECONDARY";
        GamepadButton[GamepadButton["OPTIONS"] = 4] = "OPTIONS";
        GamepadButton[GamepadButton["BUMPER_LEFT"] = 5] = "BUMPER_LEFT";
        GamepadButton[GamepadButton["BUMPER_RIGHT"] = 6] = "BUMPER_RIGHT";
        GamepadButton[GamepadButton["TRIGGER_LEFT"] = 7] = "TRIGGER_LEFT";
        GamepadButton[GamepadButton["TRIGGER_RIGHT"] = 8] = "TRIGGER_RIGHT";
        GamepadButton[GamepadButton["DIR_UP"] = 9] = "DIR_UP";
        GamepadButton[GamepadButton["DIR_DOWN"] = 10] = "DIR_DOWN";
        GamepadButton[GamepadButton["DIR_LEFT"] = 11] = "DIR_LEFT";
        GamepadButton[GamepadButton["DIR_RIGHT"] = 12] = "DIR_RIGHT";
        GamepadButton[GamepadButton["SELECT"] = 13] = "SELECT";
        GamepadButton[GamepadButton["START"] = 14] = "START";
        GamepadButton[GamepadButton["LSTICK_CLICK"] = 15] = "LSTICK_CLICK";
        GamepadButton[GamepadButton["RSTICK_CLICK"] = 16] = "RSTICK_CLICK";
        GamepadButton[GamepadButton["LSTICK_TOUCH"] = 17] = "LSTICK_TOUCH";
        GamepadButton[GamepadButton["RSTICK_TOUCH"] = 18] = "RSTICK_TOUCH";
        GamepadButton[GamepadButton["LPAD_TOUCH"] = 19] = "LPAD_TOUCH";
        GamepadButton[GamepadButton["LPAD_CLICK"] = 20] = "LPAD_CLICK";
        GamepadButton[GamepadButton["RPAD_TOUCH"] = 21] = "RPAD_TOUCH";
        GamepadButton[GamepadButton["RPAD_CLICK"] = 22] = "RPAD_CLICK";
        GamepadButton[GamepadButton["REAR_LEFT_UPPER"] = 23] = "REAR_LEFT_UPPER";
        GamepadButton[GamepadButton["REAR_LEFT_LOWER"] = 24] = "REAR_LEFT_LOWER";
        GamepadButton[GamepadButton["REAR_RIGHT_UPPER"] = 25] = "REAR_RIGHT_UPPER";
        GamepadButton[GamepadButton["REAR_RIGHT_LOWER"] = 26] = "REAR_RIGHT_LOWER";
        GamepadButton[GamepadButton["STEAM_GUIDE"] = 27] = "STEAM_GUIDE";
        GamepadButton[GamepadButton["STEAM_QUICK_MENU"] = 28] = "STEAM_QUICK_MENU";
    })(GamepadButton || (GamepadButton = {}));

    findModuleExport((e) => e?.toString && e.toString().includes('.Marquee') && e.toString().includes('--fade-length'));

    findModuleExport((e) => typeof e === 'function' && e.toString().includes('GetContextMenuManagerFromWindow(')
        && e.toString().includes('.CreateContextMenuInstance('));
    findModuleExport((e) => e?.prototype?.HideIfSubmenu && e?.prototype?.HideMenu);
    findModuleExport((e) => (e?.toString()?.includes?.('bInGamepadUI:') &&
        fakeRenderComponent(() => e({ overview: { appid: 7 } }), { useContext: () => ({ IN_GAMEPADUI: true }) })?.type?.prototype?.RenderSubMenu) ||
        (e?.prototype?.RenderSubMenu && e?.prototype?.ShowSubMenu));
    findModuleExport((e) => e?.render?.toString()?.includes('bPlayAudio:') || (e?.prototype?.OnOKButton && e?.prototype?.OnMouseEnter));
    /*
    all().map(m => {
    if (typeof m !== "object") return undefined;
    for (let prop in m) { if (m[prop]?.prototype?.OK && m[prop]?.prototype?.Cancel && m[prop]?.prototype?.render) return m[prop]}
    }).find(x => x)
    */

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

    const [mod, panelSection] = findModuleDetailsByExport((e) => e.toString()?.includes('.PanelSection'));
    Object.values(mod).filter((exp) => !exp?.toString()?.includes('.PanelSection'))[0];

    findModuleExport((e) => e?.toString()?.includes('.ProgressBar,"standard"=='));
    findModuleExport((e) => e?.toString()?.includes('.ProgressBarFieldStatus},'));
    const progressBarItemRegex = createPropListRegex(["indeterminate", "nTransitionSec", "nProgress"]);
    findModuleExport((e) => e?.toString && progressBarItemRegex.test(e.toString()));

    const sidebarNavigationRegex = createPropListRegex(["pages", "fnSetNavigateToPage", "disableRouteReporting"]);
    findModuleExport((e) => e?.toString && sidebarNavigationRegex.test(e.toString()));

    Object.values(CommonUIModule).find((mod) => mod?.toString()?.includes('SliderField,fallback'));

    // TODO type this and other icons?
    Object.values(IconsModule)?.find((mod) => mod?.toString && /Spinner\)}\)?,.\.createElement\(\"path\",{d:\"M18 /.test(mod.toString()));

    findModuleExport((e) => e?.toString?.()?.includes('Steam Spinner') && e?.toString?.()?.includes('src'));

    let oldTabs;
    try {
        const oldTabsModule = findModuleByExport((e) => e.Unbleed);
        if (oldTabsModule)
            oldTabs = Object.values(oldTabsModule).find((x) => x?.type?.toString()?.includes('((function(){'));
    }
    catch (e) {
        console.error('Error finding oldTabs:', e);
    }

    Object.values(CommonUIModule).find((mod) => mod?.validateUrl && mod?.validateEmail);

    const Toggle = Object.values(CommonUIModule).find((mod) => mod?.render?.toString()?.includes('.ToggleOff)'));

    Object.values(CommonUIModule).find((mod) => mod?.render?.toString()?.includes('ToggleField,fallback'));

    const ScrollingModule = findModuleByExport((e) => e?.render?.toString?.().includes('{case"x":'));
    const ScrollingModuleProps = ScrollingModule ? Object.values(ScrollingModule) : [];
    ScrollingModuleProps.find((prop) => prop?.render?.toString?.().includes('{case"x":'));
    findModuleExport((e) => e?.render?.toString().includes('.FocusVisibleChild()),[])'));

    /**
     * Get the current params from ReactRouter
     *
     * @returns an object with the current ReactRouter params
     *
     * @example
     * import { useParams } from "decky-frontend-lib";
     *
     * const { appid } = useParams<{ appid: string }>()
     */
    Object.values(ReactRouter).find((val) => /return (\w)\?\1\.params:{}/.test(`${val}`));

    var SideMenu;
    (function (SideMenu) {
        SideMenu[SideMenu["None"] = 0] = "None";
        SideMenu[SideMenu["Main"] = 1] = "Main";
        SideMenu[SideMenu["QuickAccess"] = 2] = "QuickAccess";
    })(SideMenu || (SideMenu = {}));
    var QuickAccessTab;
    (function (QuickAccessTab) {
        QuickAccessTab[QuickAccessTab["Notifications"] = 0] = "Notifications";
        QuickAccessTab[QuickAccessTab["RemotePlayTogetherControls"] = 1] = "RemotePlayTogetherControls";
        QuickAccessTab[QuickAccessTab["VoiceChat"] = 2] = "VoiceChat";
        QuickAccessTab[QuickAccessTab["Friends"] = 3] = "Friends";
        QuickAccessTab[QuickAccessTab["Settings"] = 4] = "Settings";
        QuickAccessTab[QuickAccessTab["Perf"] = 5] = "Perf";
        QuickAccessTab[QuickAccessTab["Help"] = 6] = "Help";
        QuickAccessTab[QuickAccessTab["Music"] = 7] = "Music";
        QuickAccessTab[QuickAccessTab["Decky"] = 999] = "Decky";
    })(QuickAccessTab || (QuickAccessTab = {}));
    var DisplayStatus;
    (function (DisplayStatus) {
        DisplayStatus[DisplayStatus["Invalid"] = 0] = "Invalid";
        DisplayStatus[DisplayStatus["Launching"] = 1] = "Launching";
        DisplayStatus[DisplayStatus["Uninstalling"] = 2] = "Uninstalling";
        DisplayStatus[DisplayStatus["Installing"] = 3] = "Installing";
        DisplayStatus[DisplayStatus["Running"] = 4] = "Running";
        DisplayStatus[DisplayStatus["Validating"] = 5] = "Validating";
        DisplayStatus[DisplayStatus["Updating"] = 6] = "Updating";
        DisplayStatus[DisplayStatus["Downloading"] = 7] = "Downloading";
        DisplayStatus[DisplayStatus["Synchronizing"] = 8] = "Synchronizing";
        DisplayStatus[DisplayStatus["ReadyToInstall"] = 9] = "ReadyToInstall";
        DisplayStatus[DisplayStatus["ReadyToPreload"] = 10] = "ReadyToPreload";
        DisplayStatus[DisplayStatus["ReadyToLaunch"] = 11] = "ReadyToLaunch";
        DisplayStatus[DisplayStatus["RegionRestricted"] = 12] = "RegionRestricted";
        DisplayStatus[DisplayStatus["PresaleOnly"] = 13] = "PresaleOnly";
        DisplayStatus[DisplayStatus["InvalidPlatform"] = 14] = "InvalidPlatform";
        DisplayStatus[DisplayStatus["PreloadComplete"] = 16] = "PreloadComplete";
        DisplayStatus[DisplayStatus["BorrowerLocked"] = 17] = "BorrowerLocked";
        DisplayStatus[DisplayStatus["UpdatePaused"] = 18] = "UpdatePaused";
        DisplayStatus[DisplayStatus["UpdateQueued"] = 19] = "UpdateQueued";
        DisplayStatus[DisplayStatus["UpdateRequired"] = 20] = "UpdateRequired";
        DisplayStatus[DisplayStatus["UpdateDisabled"] = 21] = "UpdateDisabled";
        DisplayStatus[DisplayStatus["DownloadPaused"] = 22] = "DownloadPaused";
        DisplayStatus[DisplayStatus["DownloadQueued"] = 23] = "DownloadQueued";
        DisplayStatus[DisplayStatus["DownloadRequired"] = 24] = "DownloadRequired";
        DisplayStatus[DisplayStatus["DownloadDisabled"] = 25] = "DownloadDisabled";
        DisplayStatus[DisplayStatus["LicensePending"] = 26] = "LicensePending";
        DisplayStatus[DisplayStatus["LicenseExpired"] = 27] = "LicenseExpired";
        DisplayStatus[DisplayStatus["AvailForFree"] = 28] = "AvailForFree";
        DisplayStatus[DisplayStatus["AvailToBorrow"] = 29] = "AvailToBorrow";
        DisplayStatus[DisplayStatus["AvailGuestPass"] = 30] = "AvailGuestPass";
        DisplayStatus[DisplayStatus["Purchase"] = 31] = "Purchase";
        DisplayStatus[DisplayStatus["Unavailable"] = 32] = "Unavailable";
        DisplayStatus[DisplayStatus["NotLaunchable"] = 33] = "NotLaunchable";
        DisplayStatus[DisplayStatus["CloudError"] = 34] = "CloudError";
        DisplayStatus[DisplayStatus["CloudOutOfDate"] = 35] = "CloudOutOfDate";
        DisplayStatus[DisplayStatus["Terminating"] = 36] = "Terminating";
    })(DisplayStatus || (DisplayStatus = {}));
    const Router = findModuleExport((e) => e.Navigate && e.NavigationManager);
    let Navigation = {};
    try {
        (async () => {
            let InternalNavigators = {};
            if (!Router.NavigateToAppProperties || Router.deckyShim) {
                function initInternalNavigators() {
                    try {
                        InternalNavigators = findModuleExport((e) => e.GetNavigator && e.SetNavigator)?.GetNavigator();
                    }
                    catch (e) {
                        console.error('[DFL:Router]: Failed to init internal navigators, trying again');
                    }
                }
                initInternalNavigators();
                while (!InternalNavigators?.AppProperties) {
                    console.log('[DFL:Router]: Trying to init internal navigators again');
                    await sleep(2000);
                    initInternalNavigators();
                }
            }
            const newNavigation = {
                Navigate: Router.Navigate?.bind(Router),
                NavigateBack: Router.WindowStore?.GamepadUIMainWindowInstance?.NavigateBack?.bind(Router.WindowStore.GamepadUIMainWindowInstance),
                NavigateToAppProperties: InternalNavigators?.AppProperties || Router.NavigateToAppProperties?.bind(Router),
                NavigateToExternalWeb: InternalNavigators?.ExternalWeb || Router.NavigateToExternalWeb?.bind(Router),
                NavigateToInvites: InternalNavigators?.Invites || Router.NavigateToInvites?.bind(Router),
                NavigateToChat: InternalNavigators?.Chat || Router.NavigateToChat?.bind(Router),
                NavigateToLibraryTab: InternalNavigators?.LibraryTab || Router.NavigateToLibraryTab?.bind(Router),
                NavigateToLayoutPreview: Router.NavigateToLayoutPreview?.bind(Router),
                NavigateToSteamWeb: Router.WindowStore?.GamepadUIMainWindowInstance?.NavigateToSteamWeb?.bind(Router.WindowStore.GamepadUIMainWindowInstance),
                OpenSideMenu: Router.WindowStore?.GamepadUIMainWindowInstance?.MenuStore.OpenSideMenu?.bind(Router.WindowStore.GamepadUIMainWindowInstance.MenuStore),
                OpenQuickAccessMenu: Router.WindowStore?.GamepadUIMainWindowInstance?.MenuStore.OpenQuickAccessMenu?.bind(Router.WindowStore.GamepadUIMainWindowInstance.MenuStore),
                OpenMainMenu: Router.WindowStore?.GamepadUIMainWindowInstance?.MenuStore.OpenMainMenu?.bind(Router.WindowStore.GamepadUIMainWindowInstance.MenuStore),
                CloseSideMenus: Router.CloseSideMenus?.bind(Router),
                OpenPowerMenu: Router.OpenPowerMenu?.bind(Router),
            };
            Object.assign(Navigation, newNavigation);
        })();
    }
    catch (e) {
        console.error('[DFL:Router]: Error initializing Navigation interface', e);
    }

    const IPCMain = {
        postMessage: (messageId, contents) => {
            return new Promise((resolve) => {
                const message = { id: messageId, iteration: window.CURRENT_IPC_CALL_COUNT++, data: contents };
                const messageHandler = function (data) {
                    const json = JSON.parse(data.data);
                    /**
                     * wait to receive the correct message id from the backend
                     */
                    if (json.id != message.iteration)
                        return;
                    resolve(json);
                    window.MILLENNIUM_IPC_SOCKET.removeEventListener('message', messageHandler);
                };
                window.MILLENNIUM_IPC_SOCKET.addEventListener('message', messageHandler);
                window.MILLENNIUM_IPC_SOCKET.send(JSON.stringify(message));
            });
        }
    };
    window.MILLENNIUM_BACKEND_IPC = IPCMain;
    window.Millennium = {
        // @ts-ignore (ignore overloaded function)
        callServerMethod: (pluginName, methodName, kwargs) => {
            return new Promise((resolve, reject) => {
                const query = {
                    pluginName: pluginName,
                    methodName: methodName
                };
                if (kwargs)
                    query.argumentList = kwargs;
                /* call handled from "src\core\ipc\pipe.cpp @ L:67" */
                window.MILLENNIUM_BACKEND_IPC.postMessage(0, query).then((response) => {
                    if (response?.failedRequest) {
                        const m = ` wrappedCallServerMethod() from [name: ${pluginName}, method: ${methodName}] failed on exception -> ${response.failMessage}`;
                        // Millennium can't accurately pin point where this came from
                        // check the sources tab and find your plugins index.js, and look for a call that could error this
                        throw new Error(m);
                    }
                    const val = response.returnValue;
                    if (typeof val === 'string') {
                        resolve(atob(val));
                    }
                    resolve(val);
                });
            });
        },
        AddWindowCreateHook: (callback) => {
            // used to have extended functionality but removed since it was shotty
            g_PopupManager.AddPopupCreatedCallback((e) => {
                callback(e);
            });
        },
        findElement: (privateDocument, querySelector, timeout) => {
            return new Promise((resolve, reject) => {
                const matchedElements = privateDocument.querySelectorAll(querySelector);
                /**
                 * node is already in DOM and doesn't require watchdog
                 */
                if (matchedElements.length) {
                    resolve(matchedElements);
                }
                let timer = null;
                const observer = new MutationObserver(() => {
                    const matchedElements = privateDocument.querySelectorAll(querySelector);
                    if (matchedElements.length) {
                        if (timer)
                            clearTimeout(timer);
                        observer.disconnect();
                        resolve(matchedElements);
                    }
                });
                /** observe the document body for item changes, assuming we are waiting for target element */
                observer.observe(privateDocument.body, {
                    childList: true,
                    subtree: true
                });
                if (timeout) {
                    timer = setTimeout(() => {
                        observer.disconnect();
                        reject();
                    }, timeout);
                }
            });
        },
        exposeObj: function (obj) {
            for (const key in obj) {
                exports[key] = obj[key];
            }
        }
    };
    /**
     * @brief
     * pluginSelf is a sandbox for data specific to your plugin.
     * You can't access other plugins sandboxes and they can't access yours
     *
     * @example
     * | pluginSelf.var = "Hello"
     * | console.log(pluginSelf.var) -> Hello
     */
    const pluginSelf = window.PLUGIN_LIST[pluginName];
    const Millennium = window.Millennium;

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
    function constructThemePath(nativeName, relativePath) {
        return ['skins', nativeName, relativePath].join('/');
    }
    const classListMatch = (classList, affectee) => {
        for (const classItem in classList) {
            if (classList[classItem].includes(affectee)) {
                return true;
            }
        }
        return false;
    };
    const evaluatePatch = (type, modulePatch, documentTitle, classList, document) => {
        if (modulePatch[CommonPatchTypes[type]] === undefined) {
            return;
        }
        modulePatch[CommonPatchTypes[type]].affects.forEach((affectee) => {
            if (!documentTitle.match(affectee) && !classListMatch(classList, affectee)) {
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

    /**
     * @deprecated this entire module is deprecated and is only here to support Millennium <= 1.1.5
     *
     * @note this module does not provide interfaces to edit the deprecated conditions,
     * it serves only to allow old ones to still work until they are properly updated by the developer.
     */
    var ConfigurationItemType;
    (function (ConfigurationItemType) {
        ConfigurationItemType["ComboBox"] = "ComboBox";
        ConfigurationItemType["CheckBox"] = "CheckBox";
    })(ConfigurationItemType || (ConfigurationItemType = {}));
    const GetFromConfigurationStore = (configName) => {
        const activeTheme = pluginSelf.activeTheme.data;
        for (const configItem of activeTheme.Configuration) {
            if (configItem.Name === configName) {
                return configItem;
            }
        }
        return undefined;
    };
    const InsertModule = (target, document) => {
        const activeTheme = pluginSelf.activeTheme;
        target?.TargetCss && DOMModifier.AddStyleSheet(document, constructThemePath(activeTheme.native, target.TargetCss));
        target?.TargetJs && DOMModifier.AddJavaScript(document, constructThemePath(activeTheme.native, target.TargetJs));
    };
    const EvaluateComboBox = (statement, currentValue, document) => {
        statement.Combo.forEach((comboItem) => {
            if (comboItem.Equals === currentValue) {
                InsertModule(comboItem?.True, document);
            }
            else {
                InsertModule(comboItem?.False, document);
            }
        });
    };
    const EvaluateCheckBox = (statement, currentValue, document) => {
        if (statement.Equals === currentValue) {
            InsertModule(statement?.True, document);
        }
        else {
            InsertModule(statement?.False, document);
        }
    };
    const EvaluateType = (statement) => {
        return statement.Combo !== undefined ? ConfigurationItemType.ComboBox : ConfigurationItemType.CheckBox;
    };
    const EvaluateStatement = (statement, document) => {
        const statementId = statement.If;
        const statementStore = GetFromConfigurationStore(statementId);
        const storedStatementValue = statementStore.Value;
        const statementType = EvaluateType(statement);
        switch (statementType) {
            case ConfigurationItemType.CheckBox: {
                EvaluateCheckBox(statement, storedStatementValue, document);
                break;
            }
            case ConfigurationItemType.ComboBox: {
                EvaluateComboBox(statement, storedStatementValue, document);
                break;
            }
        }
    };
    const EvaluateStatements = (patchItem, document) => {
        if (Array.isArray(patchItem.Statement)) {
            patchItem.Statement.forEach(statement => {
                EvaluateStatement(statement, document);
            });
        }
        else {
            EvaluateStatement(patchItem.Statement, document);
        }
    };

    const EvaluateModule = (module, type, document) => {
        const activeTheme = pluginSelf.activeTheme;
        switch (type) {
            case ConditionalControlFlowType.TargetCss:
                DOMModifier.AddStyleSheet(document, constructThemePath(activeTheme.native, module));
                break;
            case ConditionalControlFlowType.TargetJs:
                DOMModifier.AddJavaScript(document, constructThemePath(activeTheme.native, module));
                break;
        }
    };
    /**
     * @brief evaluates list of; or single module
     *
     * @param module module(s) to be injected into the frame
     * @param type the type of the module
     * @returns null
     */
    const SanitizeTargetModule = (module, type, document) => {
        if (module === undefined) {
            return;
        }
        else if (typeof module === 'string') {
            EvaluateModule(module, type, document);
        }
        else if (Array.isArray(module)) {
            module.forEach((node) => EvaluateModule(node, type, document));
        }
    };
    const evaluatePatches = (activeTheme, documentTitle, classList, document, context) => {
        activeTheme.data.Patches.forEach((patch) => {
            const match = patch.MatchRegexString;
            context.m_popup.window.HAS_INJECTED_THEME = true;
            if (!documentTitle.match(match) && !classListMatch(classList, match)) {
                return;
            }
            SanitizeTargetModule(patch?.TargetCss, ConditionalControlFlowType.TargetCss, document);
            SanitizeTargetModule(patch?.TargetJs, ConditionalControlFlowType.TargetJs, document);
            // backwards compatability with old millennium versions. 
            const PatchV1 = patch;
            if (PatchV1?.Statement !== undefined) {
                EvaluateStatements(PatchV1, document);
            }
        });
    };
    /**
     * parses all classnames from a window and concatenates into one list
     * @param context window context from g_popupManager
     * @returns
     */
    const getDocumentClassList = (context) => {
        const bodyClass = context?.m_rgParams?.body_class ?? String();
        const htmlClass = context?.m_rgParams?.html_class ?? String();
        return (`${bodyClass} ${htmlClass}`).split(' ').map((className) => '.' + className);
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
        // Append old global colors struct to DOM
        pluginSelf?.GlobalsColors && DOMModifier.AddStyleSheetFromText(document, pluginSelf.GlobalsColors, "GlobalColors");
        activeTheme?.data?.hasOwnProperty("Patches") && evaluatePatches(activeTheme, documentTitle, classList, document, windowContext);
        activeTheme?.data?.hasOwnProperty("Conditions") && evaluateConditions(activeTheme, documentTitle, classList, document);
    }

    var settingsPanelPlugins$4 = "Plugins";
    var settingsPanelThemes$4 = "Themes";
    var settingsPanelUpdates$4 = "Updates";
    var itemNoDescription$4 = "No description yet.";
    var themePanelClientTheme$4 = "Client Theme";
    var themePanelThemeTooltip$4 = "Select the theme you want Steam to use (requires reload)";
    var themePanelGetMoreThemes$4 = "Get more themes";
    var themePanelInjectJavascript$4 = "Inject Javascript";
    var themePanelInjectJavascriptToolTip$4 = "Decide whether themes are allowed to insert javascript into Steam. Disabling javascript may break Steam interface as a byproduct (requires reload)";
    var themePanelInjectCSS$4 = "Inject StyleSheets";
    var themePanelInjectCSSToolTip$4 = "Decide whether themes are allowed to insert stylesheets into Steam. (requires reload)";
    var updatePanelHasUpdates$4 = "Updates Available!";
    var updatePanelHasUpdatesSub$4 = "Millennium found the following updates for your themes.";
    var updatePanelReleasedTag$4 = "Released:";
    var updatePanelReleasePatchNotes$4 = "Patch Notes:";
    var updatePanelIsUpdating$4 = "Updating...";
    var updatePanelUpdate$4 = "Update";
    var updatePanelNoUpdatesFound$4 = "No updates found. You're good to go!";
    var ViewMore$4 = "View More";
    var aboutThemeAnonymous$4 = "Anonymous";
    var aboutThemeTitle$4 = "About";
    var aboutThemeVerifiedDev$4 = "Verified Developer";
    var viewSourceCode$4 = "View Source Code";
    var showInFolder$4 = "Show in Folder";
    var uninstall$4 = "Uninstall";
    var reloadRequired$4 = "Reload Required";
    var reloadRequiredBody$4 = "Selected changes need a reload in order to take affect. Should we reload right now?";
    var optionReloadNow$4 = "Reload Now";
    var optionReloadLater$4 = "Reload Later";
    var updatePanelUpdateNotifications = "Push Notifications";
    var updatePanelUpdateNotificationsTooltip = "Get Millennium to give you a reminder when a item in your library has an update!";
    var english = {
    	settingsPanelPlugins: settingsPanelPlugins$4,
    	settingsPanelThemes: settingsPanelThemes$4,
    	settingsPanelUpdates: settingsPanelUpdates$4,
    	itemNoDescription: itemNoDescription$4,
    	themePanelClientTheme: themePanelClientTheme$4,
    	themePanelThemeTooltip: themePanelThemeTooltip$4,
    	themePanelGetMoreThemes: themePanelGetMoreThemes$4,
    	themePanelInjectJavascript: themePanelInjectJavascript$4,
    	themePanelInjectJavascriptToolTip: themePanelInjectJavascriptToolTip$4,
    	themePanelInjectCSS: themePanelInjectCSS$4,
    	themePanelInjectCSSToolTip: themePanelInjectCSSToolTip$4,
    	updatePanelHasUpdates: updatePanelHasUpdates$4,
    	updatePanelHasUpdatesSub: updatePanelHasUpdatesSub$4,
    	updatePanelReleasedTag: updatePanelReleasedTag$4,
    	updatePanelReleasePatchNotes: updatePanelReleasePatchNotes$4,
    	updatePanelIsUpdating: updatePanelIsUpdating$4,
    	updatePanelUpdate: updatePanelUpdate$4,
    	updatePanelNoUpdatesFound: updatePanelNoUpdatesFound$4,
    	ViewMore: ViewMore$4,
    	aboutThemeAnonymous: aboutThemeAnonymous$4,
    	aboutThemeTitle: aboutThemeTitle$4,
    	aboutThemeVerifiedDev: aboutThemeVerifiedDev$4,
    	viewSourceCode: viewSourceCode$4,
    	showInFolder: showInFolder$4,
    	uninstall: uninstall$4,
    	reloadRequired: reloadRequired$4,
    	reloadRequiredBody: reloadRequiredBody$4,
    	optionReloadNow: optionReloadNow$4,
    	optionReloadLater: optionReloadLater$4,
    	updatePanelUpdateNotifications: updatePanelUpdateNotifications,
    	updatePanelUpdateNotificationsTooltip: updatePanelUpdateNotificationsTooltip
    };

    var settingsPanelPlugins$3 = "Wtyczki";
    var settingsPanelThemes$3 = "Motywy";
    var settingsPanelUpdates$3 = "Aktualizacje";
    var itemNoDescription$3 = "Brak opisu.";
    var themePanelClientTheme$3 = "Motyw klienta";
    var themePanelThemeTooltip$3 = "Wybierz motyw, którego ma używać Steam (wymaga ponownego załadowania)";
    var themePanelGetMoreThemes$3 = "Pobierz więcej motywów";
    var themePanelInjectJavascript$3 = "Wstrzyknij Javascript";
    var themePanelInjectJavascriptToolTip$3 = "Zdecyduj, czy motywy mogą wstrzykiwać javascript do Steam. Wyłączenie javascriptu może spowodować problemy z interfejsem Steam (wymaga ponownego załadowania)";
    var themePanelInjectCSS$3 = "Wstrzyknij arkusze stylów";
    var themePanelInjectCSSToolTip$3 = "Zdecyduj, czy motywy mogą wstrzykiwać arkusze stylów do Steam. (wymaga ponownego załadowania)";
    var updatePanelHasUpdates$3 = "Dostępne aktualizacje!";
    var updatePanelHasUpdatesSub$3 = "Millennium znalazł następujące aktualizacje dla Twoich motywów.";
    var updatePanelReleasedTag$3 = "Wydano:";
    var updatePanelReleasePatchNotes$3 = "Uwagi do wydania:";
    var updatePanelIsUpdating$3 = "Aktualizowanie...";
    var updatePanelUpdate$3 = "Aktualizuj";
    var updatePanelNoUpdatesFound$3 = "Brak dostępnych aktualizacji. Wszystko jest aktualne!";
    var ViewMore$3 = "Zobacz więcej";
    var aboutThemeAnonymous$3 = "Anonimowy";
    var aboutThemeTitle$3 = "O motywie";
    var aboutThemeVerifiedDev$3 = "Zweryfikowany deweloper";
    var viewSourceCode$3 = "Zobacz kod źródłowy";
    var showInFolder$3 = "Pokaż w folderze";
    var uninstall$3 = "Odinstaluj";
    var reloadRequired$3 = "Wymagane ponowne załadowanie";
    var reloadRequiredBody$3 = "Wybrane zmiany wymagają ponownego załadowania, aby mogły zostać zastosowane. Czy chcesz ponownie załadować teraz?";
    var optionReloadNow$3 = "Załaduj ponownie teraz";
    var optionReloadLater$3 = "Załaduj ponownie później";
    var polish = {
    	settingsPanelPlugins: settingsPanelPlugins$3,
    	settingsPanelThemes: settingsPanelThemes$3,
    	settingsPanelUpdates: settingsPanelUpdates$3,
    	itemNoDescription: itemNoDescription$3,
    	themePanelClientTheme: themePanelClientTheme$3,
    	themePanelThemeTooltip: themePanelThemeTooltip$3,
    	themePanelGetMoreThemes: themePanelGetMoreThemes$3,
    	themePanelInjectJavascript: themePanelInjectJavascript$3,
    	themePanelInjectJavascriptToolTip: themePanelInjectJavascriptToolTip$3,
    	themePanelInjectCSS: themePanelInjectCSS$3,
    	themePanelInjectCSSToolTip: themePanelInjectCSSToolTip$3,
    	updatePanelHasUpdates: updatePanelHasUpdates$3,
    	updatePanelHasUpdatesSub: updatePanelHasUpdatesSub$3,
    	updatePanelReleasedTag: updatePanelReleasedTag$3,
    	updatePanelReleasePatchNotes: updatePanelReleasePatchNotes$3,
    	updatePanelIsUpdating: updatePanelIsUpdating$3,
    	updatePanelUpdate: updatePanelUpdate$3,
    	updatePanelNoUpdatesFound: updatePanelNoUpdatesFound$3,
    	ViewMore: ViewMore$3,
    	aboutThemeAnonymous: aboutThemeAnonymous$3,
    	aboutThemeTitle: aboutThemeTitle$3,
    	aboutThemeVerifiedDev: aboutThemeVerifiedDev$3,
    	viewSourceCode: viewSourceCode$3,
    	showInFolder: showInFolder$3,
    	uninstall: uninstall$3,
    	reloadRequired: reloadRequired$3,
    	reloadRequiredBody: reloadRequiredBody$3,
    	optionReloadNow: optionReloadNow$3,
    	optionReloadLater: optionReloadLater$3
    };

    var settingsPanelPlugins$2 = "Complementos";
    var settingsPanelThemes$2 = "Temas";
    var settingsPanelUpdates$2 = "Actualizaciones";
    var itemNoDescription$2 = "Sin Descripción.";
    var themePanelClientTheme$2 = "Tema del Cliente";
    var themePanelThemeTooltip$2 = "Selecciona el tema que quieres que Steam use (requiere reiniciar)";
    var themePanelGetMoreThemes$2 = "Conseguir más temas";
    var themePanelInjectJavascript$2 = "Inyectar Javascript";
    var themePanelInjectJavascriptToolTip$2 = "Decidir que temas tienen permiso para insertar javascript en Steam. Deshabilitar javascript puede romper la interfaz de Steam como consecuencia (requiere reiniciar)";
    var themePanelInjectCSS$2 = "Inyectar StyleSheets";
    var themePanelInjectCSSToolTip$2 = "Decidir que temas tienen permiso para insertar stylesheets en Steam. (requiere recargar)";
    var updatePanelHasUpdates$2 = "¡Actualizaciones Disponibles!";
    var updatePanelHasUpdatesSub$2 = "Millennium ha encontrado las siguientes actualizaciones para tus temas.";
    var updatePanelReleasedTag$2 = "Publicado:";
    var updatePanelReleasePatchNotes$2 = "Notas de Parche:";
    var updatePanelIsUpdating$2 = "Actualizando...";
    var updatePanelUpdate$2 = "Actualizar";
    var updatePanelNoUpdatesFound$2 = "No se han encontrado actualizaciones. ¡Todo listo!";
    var ViewMore$2 = "Ver más";
    var aboutThemeAnonymous$2 = "Anónimo";
    var aboutThemeTitle$2 = "Sobre";
    var aboutThemeVerifiedDev$2 = "Desarrollador Verificado";
    var viewSourceCode$2 = "Ver Código Fuente";
    var showInFolder$2 = "Mostrar en Carpeta";
    var uninstall$2 = "Desinstalar";
    var reloadRequired$2 = "Requiere Reiniciar";
    var reloadRequiredBody$2 = "Los cambios seleccionados necesitan reiniciar Steam para tener efecto. ¿Reiniciar ahora?";
    var optionReloadNow$2 = "Reiniciar Ahora";
    var optionReloadLater$2 = "Reiniciar Después";
    var spanish = {
    	settingsPanelPlugins: settingsPanelPlugins$2,
    	settingsPanelThemes: settingsPanelThemes$2,
    	settingsPanelUpdates: settingsPanelUpdates$2,
    	itemNoDescription: itemNoDescription$2,
    	themePanelClientTheme: themePanelClientTheme$2,
    	themePanelThemeTooltip: themePanelThemeTooltip$2,
    	themePanelGetMoreThemes: themePanelGetMoreThemes$2,
    	themePanelInjectJavascript: themePanelInjectJavascript$2,
    	themePanelInjectJavascriptToolTip: themePanelInjectJavascriptToolTip$2,
    	themePanelInjectCSS: themePanelInjectCSS$2,
    	themePanelInjectCSSToolTip: themePanelInjectCSSToolTip$2,
    	updatePanelHasUpdates: updatePanelHasUpdates$2,
    	updatePanelHasUpdatesSub: updatePanelHasUpdatesSub$2,
    	updatePanelReleasedTag: updatePanelReleasedTag$2,
    	updatePanelReleasePatchNotes: updatePanelReleasePatchNotes$2,
    	updatePanelIsUpdating: updatePanelIsUpdating$2,
    	updatePanelUpdate: updatePanelUpdate$2,
    	updatePanelNoUpdatesFound: updatePanelNoUpdatesFound$2,
    	ViewMore: ViewMore$2,
    	aboutThemeAnonymous: aboutThemeAnonymous$2,
    	aboutThemeTitle: aboutThemeTitle$2,
    	aboutThemeVerifiedDev: aboutThemeVerifiedDev$2,
    	viewSourceCode: viewSourceCode$2,
    	showInFolder: showInFolder$2,
    	uninstall: uninstall$2,
    	reloadRequired: reloadRequired$2,
    	reloadRequiredBody: reloadRequiredBody$2,
    	optionReloadNow: optionReloadNow$2,
    	optionReloadLater: optionReloadLater$2
    };

    var settingsPanelPlugins$1 = "Plugins";
    var settingsPanelThemes$1 = "Tema";
    var settingsPanelUpdates$1 = "Pembaruan";
    var itemNoDescription$1 = "Tidak ada deskripsi.";
    var themePanelClientTheme$1 = "Tema Klien";
    var themePanelThemeTooltip$1 = "Pilih tema yang akan digunakan Steam (diperlukan muat ulang)";
    var themePanelGetMoreThemes$1 = "Lebih banyak tema";
    var themePanelInjectJavascript$1 = "Gunakan Javascript";
    var themePanelInjectJavascriptToolTip$1 = "Mengizinkan tema untuk memasukkan javascript ke Steam. Menonaktifkan javascript dapat merusak antarmuka Steam (diperlukan muat ulang)";
    var themePanelInjectCSS$1 = "Gunakan StyleSheets";
    var themePanelInjectCSSToolTip$1 = "Mengizinkan tema untuk memasukkan stylesheets ke Steam.";
    var updatePanelHasUpdates$1 = "Pembaruan tersedia!";
    var updatePanelHasUpdatesSub$1 = "Millenium menemukan pembaruan berikut ini untuk tema Anda.";
    var updatePanelReleasedTag$1 = "Dirilis:";
    var updatePanelReleasePatchNotes$1 = "Catatan Pembaruan:";
    var updatePanelIsUpdating$1 = "Melakukan Pembaruan...";
    var updatePanelUpdate$1 = "Pembaruan";
    var updatePanelNoUpdatesFound$1 = "Tidak ada pembaruan tersedia. Anda sudah siap!";
    var ViewMore$1 = "Lihat Lebih Banyak";
    var aboutThemeAnonymous$1 = "Anonim";
    var aboutThemeTitle$1 = "Tentang";
    var aboutThemeVerifiedDev$1 = "Pengembang Terverifikasi";
    var viewSourceCode$1 = "Lihat Source Code";
    var showInFolder$1 = "Tampilkan di Folder";
    var uninstall$1 = "Hapus Instalasi";
    var reloadRequired$1 = "Membutuhkan Muat Ulang";
    var reloadRequiredBody$1 = "Perubahan yang dipilih perlu dimuat ulang agar dapat diterapkan. Muat ulang sekarang?";
    var optionReloadNow$1 = "Muat Ulang Sekarang";
    var optionReloadLater$1 = "Muat Ulang Nanti";
    var indonesian = {
    	settingsPanelPlugins: settingsPanelPlugins$1,
    	settingsPanelThemes: settingsPanelThemes$1,
    	settingsPanelUpdates: settingsPanelUpdates$1,
    	itemNoDescription: itemNoDescription$1,
    	themePanelClientTheme: themePanelClientTheme$1,
    	themePanelThemeTooltip: themePanelThemeTooltip$1,
    	themePanelGetMoreThemes: themePanelGetMoreThemes$1,
    	themePanelInjectJavascript: themePanelInjectJavascript$1,
    	themePanelInjectJavascriptToolTip: themePanelInjectJavascriptToolTip$1,
    	themePanelInjectCSS: themePanelInjectCSS$1,
    	themePanelInjectCSSToolTip: themePanelInjectCSSToolTip$1,
    	updatePanelHasUpdates: updatePanelHasUpdates$1,
    	updatePanelHasUpdatesSub: updatePanelHasUpdatesSub$1,
    	updatePanelReleasedTag: updatePanelReleasedTag$1,
    	updatePanelReleasePatchNotes: updatePanelReleasePatchNotes$1,
    	updatePanelIsUpdating: updatePanelIsUpdating$1,
    	updatePanelUpdate: updatePanelUpdate$1,
    	updatePanelNoUpdatesFound: updatePanelNoUpdatesFound$1,
    	ViewMore: ViewMore$1,
    	aboutThemeAnonymous: aboutThemeAnonymous$1,
    	aboutThemeTitle: aboutThemeTitle$1,
    	aboutThemeVerifiedDev: aboutThemeVerifiedDev$1,
    	viewSourceCode: viewSourceCode$1,
    	showInFolder: showInFolder$1,
    	uninstall: uninstall$1,
    	reloadRequired: reloadRequired$1,
    	reloadRequiredBody: reloadRequiredBody$1,
    	optionReloadNow: optionReloadNow$1,
    	optionReloadLater: optionReloadLater$1
    };

    var settingsPanelPlugins = "插件";
    var settingsPanelThemes = "主题";
    var settingsPanelUpdates = "更新";
    var itemNoDescription = "暂无描述";
    var themePanelClientTheme = "客户端主题";
    var themePanelThemeTooltip = "选择 Steam 主题（需要重新加载）";
    var themePanelGetMoreThemes = "获取更多主题";
    var themePanelInjectJavascript = "注入 JavaScript";
    var themePanelInjectJavascriptToolTip = "是否允许主题在 Steam 中插入 JavaScript。禁用 JavaScript 可能会导致 Steam 界面出现问题。（需要重新加载）";
    var themePanelInjectCSS = "注入 CSS";
    var themePanelInjectCSSToolTip = "是否允许主题在 Steam 中插入 CSS。(需要重新加载）";
    var updatePanelHasUpdates = "发现新版本！";
    var updatePanelHasUpdatesSub = "Millennium 找到了以下主题的更新。";
    var updatePanelReleasedTag = "发布：";
    var updatePanelReleasePatchNotes = "补丁说明：";
    var updatePanelIsUpdating = "更新中...";
    var updatePanelUpdate = "更新";
    var updatePanelNoUpdatesFound = "已经是最新版本！";
    var ViewMore = "查看更多";
    var aboutThemeAnonymous = "匿名";
    var aboutThemeTitle = "关于";
    var aboutThemeVerifiedDev = "经过验证的开发者";
    var viewSourceCode = "查看源码";
    var showInFolder = "打开文件位置";
    var uninstall = "卸载";
    var reloadRequired = "需要重新加载";
    var reloadRequiredBody = "所选更改需要重新加载才能生效。立即重新加载？";
    var optionReloadNow = "立即重新加载";
    var optionReloadLater = "稍后重新加载";
    var schinese = {
    	settingsPanelPlugins: settingsPanelPlugins,
    	settingsPanelThemes: settingsPanelThemes,
    	settingsPanelUpdates: settingsPanelUpdates,
    	itemNoDescription: itemNoDescription,
    	themePanelClientTheme: themePanelClientTheme,
    	themePanelThemeTooltip: themePanelThemeTooltip,
    	themePanelGetMoreThemes: themePanelGetMoreThemes,
    	themePanelInjectJavascript: themePanelInjectJavascript,
    	themePanelInjectJavascriptToolTip: themePanelInjectJavascriptToolTip,
    	themePanelInjectCSS: themePanelInjectCSS,
    	themePanelInjectCSSToolTip: themePanelInjectCSSToolTip,
    	updatePanelHasUpdates: updatePanelHasUpdates,
    	updatePanelHasUpdatesSub: updatePanelHasUpdatesSub,
    	updatePanelReleasedTag: updatePanelReleasedTag,
    	updatePanelReleasePatchNotes: updatePanelReleasePatchNotes,
    	updatePanelIsUpdating: updatePanelIsUpdating,
    	updatePanelUpdate: updatePanelUpdate,
    	updatePanelNoUpdatesFound: updatePanelNoUpdatesFound,
    	ViewMore: ViewMore,
    	aboutThemeAnonymous: aboutThemeAnonymous,
    	aboutThemeTitle: aboutThemeTitle,
    	aboutThemeVerifiedDev: aboutThemeVerifiedDev,
    	viewSourceCode: viewSourceCode,
    	showInFolder: showInFolder,
    	uninstall: uninstall,
    	reloadRequired: reloadRequired,
    	reloadRequiredBody: reloadRequiredBody,
    	optionReloadNow: optionReloadNow,
    	optionReloadLater: optionReloadLater
    };

    const Logger = {
        Error: (...message) => {
            console.error('%c Millennium ', 'background: red; color: white', ...message);
        },
        Log: (...message) => {
            console.log('%c Millennium ', 'background: purple; color: white', ...message);
        },
        Warn: (...message) => {
            console.warn('%c Millennium ', 'background: orange; color: white', ...message);
        }
    };

    let _locale = english;
    const handler = {
        get: function (target, property) {
            if (property in target) {
                return target[property];
            }
            else {
                try {
                    // fallback to english if the target string wasn't found
                    return english?.[property];
                }
                catch (exception) {
                    return "locale was not found.";
                }
            }
        }
    };
    let locale = new Proxy(_locale, handler);
    const localizationFiles = {
        english,
        polish,
        spanish,
        indonesian,
        schinese
        // Add other languages here
    };
    const GetLocalization = async () => {
        const language = await SteamClient.Settings.GetCurrentLanguage();
        Logger.Log(`loading locales ${language}`);
        if (localizationFiles.hasOwnProperty(language)) {
            locale = localizationFiles[language];
        }
        else {
            Logger.Warn(`Localization for language ${language} not found, defaulting to English.`);
            locale = localizationFiles['english'];
        }
    };
    // setup locales on startup
    GetLocalization();

    const ConnectionFailed = () => {
        return (window.SP_REACT.createElement("div", { className: "__up-to-date-container", style: {
                display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "center"
            } },
            window.SP_REACT.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", version: "1.1", width: 25, height: 25, viewBox: "0 0 256 256", xmlSpace: "preserve" },
                window.SP_REACT.createElement("defs", null),
                window.SP_REACT.createElement("g", { style: { stroke: 'none', strokeWidth: 0, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'none', fillRule: 'nonzero', opacity: 1 }, transform: "translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" },
                    window.SP_REACT.createElement("path", { d: "M 11 90 c -2.815 0 -5.63 -1.074 -7.778 -3.222 c -4.295 -4.296 -4.295 -11.261 0 -15.557 l 68 -68 c 4.297 -4.296 11.26 -4.296 15.557 0 c 4.296 4.296 4.296 11.261 0 15.557 l -68 68 C 16.63 88.926 13.815 90 11 90 z", style: { stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(214,0,0)', fillRule: 'nonzero', opacity: 1 }, transform: " matrix(1 0 0 1 0 0) ", strokeLinecap: "round" }),
                    window.SP_REACT.createElement("path", { d: "M 79 90 c -2.815 0 -5.63 -1.074 -7.778 -3.222 l -68 -68 c -4.295 -4.296 -4.295 -11.261 0 -15.557 c 4.296 -4.296 11.261 -4.296 15.557 0 l 68 68 c 4.296 4.296 4.296 11.261 0 15.557 C 84.63 88.926 81.815 90 79 90 z", style: { stroke: 'none', strokeWidth: 1, strokeDasharray: 'none', strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 10, fill: 'rgb(214,0,0)', fillRule: 'nonzero', opacity: 1 }, transform: " matrix(1 0 0 1 0 0) ", strokeLinecap: "round" }))),
            window.SP_REACT.createElement("div", { className: "__up-to-date-header", style: { marginTop: "20px", color: "white", fontWeight: "500", fontSize: "15px" } }, "Failed to connect to Millennium!"),
            window.SP_REACT.createElement("p", { style: { fontSize: "12px", color: "grey", textAlign: "center", maxWidth: "76%" } }, "This issue isn't network related, you're most likely missing a file millennium needs, or are experiencing an unexpected bug."),
            window.SP_REACT.createElement(Button, { onClick: () => SteamClient.System.OpenLocalDirectoryInSystemExplorer("ext\\data\\logs\\"), style: { marginTop: "20px" } }, "Open Logs Folder")));
    };

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
            })
                .catch((_) => pluginSelf.connectionFailed = true);
        }, []);
        const handleCheckboxChange = (index) => {
            /* Prevent users from disabling this plugin, as its vital */
            const updated = !checkedItems[index] || plugins[index]?.data?.name === "core";
            setCheckedItems({ ...checkedItems, [index]: updated });
            wrappedCallServerMethod("update_plugin_status", { plugin_name: plugins[index]?.data?.name, enabled: updated });
        };
        if (pluginSelf.connectionFailed) {
            return window.SP_REACT.createElement(ConnectionFailed, null);
        }
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement(DialogHeader, null, locale.settingsPanelPlugins),
            window.SP_REACT.createElement(DialogBody, { className: classMap.SettingsDialogBodyFade }, plugins.map((plugin, index) => (window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel", key: index },
                window.SP_REACT.createElement("div", { className: classMap.FieldLabelRow },
                    window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, plugin?.data?.common_name),
                    window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon, style: { display: "flex", alignItems: "center" } },
                        window.SP_REACT.createElement(EditPlugin, { plugin: plugin }),
                        window.SP_REACT.createElement("div", { className: "_3N47t_-VlHS8JAEptE5rlR" },
                            window.SP_REACT.createElement(Toggle, { disabled: plugin?.data?.name == "core", value: checkedItems[index], onChange: (_checked) => handleCheckboxChange(index) })))),
                window.SP_REACT.createElement("div", { className: classMap.FieldDescription }, plugin?.data?.description ?? locale.itemNoDescription)))))));
    };

    var ConditionType;
    (function (ConditionType) {
        ConditionType[ConditionType["Dropdown"] = 0] = "Dropdown";
        ConditionType[ConditionType["Toggle"] = 1] = "Toggle";
    })(ConditionType || (ConditionType = {}));
    class RenderThemeEditor extends React.Component {
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
            strTitle: locale.reloadRequired,
            bHideMainWindowForPopouts: false,
            popupHeight: 250,
            popupWidth: 425,
        };
        const modalProps = {
            strTitle: locale.reloadRequired,
            strDescription: locale.reloadRequiredBody,
            strOKButtonText: locale.optionReloadNow,
            strCancelButtonText: locale.optionReloadLater
        };
        return await ShowMessageBox(windowOptions, modalProps);
    };

    const CreatePopupBase = findModuleChild((m) => {
        if (typeof m !== 'object')
            return undefined;
        for (let prop in m) {
            if (typeof m[prop] === 'function'
                && m[prop]?.toString().includes('CreatePopup(this.m_strName')
                && m[prop]?.toString().includes('GetWindowRestoreDetails')) {
                return m[prop];
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
    class CreatePopup extends CreatePopupBase {
        constructor(component, strPopupName, options) {
            super(strPopupName, options);
            this.component = component;
        }
        Show() {
            super.Show();
            const RenderComponent = ({ _window }) => {
                return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                    window.SP_REACT.createElement("div", { className: "PopupFullWindow", onContextMenu: ((_e) => {
                            // console.log('CONTEXT MENU OPEN')
                            // _e.preventDefault()
                            // this.contextMenuHandler.CreateContextMenuInstance(_e)
                        }) },
                        window.SP_REACT.createElement(TitleBarControls, { popup: _window, hideMin: false, hideMax: false, hideActions: false }),
                        window.SP_REACT.createElement(this.component, null))));
            };
            console.log(super.root_element);
            ReactDOM.render(window.SP_REACT.createElement(RenderComponent, { _window: super.window }), super.root_element);
        }
        SetTitle() {
            console.log("[internal] setting title ->", this);
            if (this.m_popup && this.m_popup.document) {
                this.m_popup.document.title = "WINDOW";
            }
        }
        Render(_window, _element) { }
        OnClose() { }
        OnLoad() {
            const element = this.m_popup.document.querySelector(".DialogContent_InnerWidth");
            const height = element?.getBoundingClientRect()?.height;
            this.m_popup.SteamClient?.Window?.ResizeTo(450, height + 48, true);
            this.m_popup.SteamClient.Window.ShowWindow();
        }
    }

    class AboutThemeRenderer extends React.Component {
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
                                window.SP_REACT.createElement("div", { className: "r62qzcdJQ0qezZglOtiUX" }, this.activeTheme?.data?.github?.owner ?? this.activeTheme?.data?.author ?? locale.aboutThemeAnonymous)),
                            window.SP_REACT.createElement("div", { className: "_2nrSdZqzl3e01VZleoVaWp", style: { width: "100%" } },
                                window.SP_REACT.createElement("div", { className: "_2wpaptjZY-3Gn1HOPlL85O _1k82NiWym4STegDGxRBHz2 no-drag" },
                                    "\u2705 ",
                                    locale.aboutThemeVerifiedDev))))));
            };
            this.RenderDescription = () => {
                return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
                    window.SP_REACT.createElement("div", { className: "DialogSubHeader _2rK4YqGvSzXLj1bPZL8xMJ" }, locale.aboutThemeTitle),
                    window.SP_REACT.createElement("div", { className: "DialogBodyText _3fPiC9QRyT5oJ6xePCVYz8" }, this.activeTheme?.data?.description ?? locale.itemNoDescription)));
            };
            this.RenderInfoRow = () => {
                const themeOwner = this.activeTheme?.data?.github?.owner;
                const themeRepo = this.activeTheme?.data?.github?.repo_name;
                this.activeTheme?.data?.funding?.kofi;
                const ShowSource = () => {
                    SteamClient.System.OpenInSystemBrowser(`https://github.com/${themeOwner}/${themeRepo}`);
                };
                const ShowInFolder = () => {
                    wrappedCallServerMethod("Millennium.steam_path").then((path) => {
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
                    themeOwner && themeRepo && window.SP_REACT.createElement("button", { type: "button", style: { width: "unset" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", onClick: ShowSource }, locale.viewSourceCode),
                    window.SP_REACT.createElement("div", { className: ".flex-btn-container", style: { display: "flex", gap: "5px" } },
                        window.SP_REACT.createElement("button", { type: "button", style: { width: "50%", }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", onClick: ShowInFolder }, locale.showInFolder),
                        window.SP_REACT.createElement("button", { type: "button", style: { width: "50%" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", onClick: UninstallTheme }, locale.uninstall))));
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
            title: locale.aboutThemeTitle + " " + active,
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
         * hacky solution to extending the restricted showModal wrapper.
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
        if (pluginSelf?.isDefaultTheme || pluginSelf.activeTheme?.data?.Conditions === undefined) {
            return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null));
        }
        return (window.SP_REACT.createElement("button", { onClick: () => ShowThemeSettings(active), style: { margin: "0", padding: "0px 10px", marginRight: "10px" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable millenniumIconButton" },
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
            pluginSelf.isDefaultTheme ? setActive("Default") : setActive(activeTheme?.data?.name ?? activeTheme?.native);
            findAllThemes().then((result) => setThemes(result));
            wrappedCallServerMethod("cfg.get_config_str").then((value) => {
                const json = JSON.parse(value);
                setJsState(json.scripts);
                setCssState(json.styles);
            })
                .catch((_) => {
                console.error("Failed to fetch theme settings");
                pluginSelf.connectionFailed = true;
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
                    wrappedCallServerMethod("cfg.set_config_keypair", { key: "styles", value: enabled })
                        .catch((_) => {
                        console.error("Failed to update settings");
                        pluginSelf.connectionFailed = true;
                    });
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
        if (pluginSelf.connectionFailed) {
            return window.SP_REACT.createElement(ConnectionFailed, null);
        }
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("style", null, `.DialogDropDown._DialogInputContainer.Panel.Focusable {
                        min-width: max-content !important;
                    }`),
            window.SP_REACT.createElement(DialogHeader, null, locale.settingsPanelThemes),
            window.SP_REACT.createElement(DialogBody, { className: classMap.SettingsDialogBodyFade },
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, locale.themePanelClientTheme),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon },
                            window.SP_REACT.createElement(RenderEditTheme, { active: active }),
                            !pluginSelf.isDefaultTheme &&
                                window.SP_REACT.createElement("button", { onClick: () => SetupAboutRenderer(active), style: { margin: "0", padding: "0px 10px", marginRight: "10px" }, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable millenniumIconButton" },
                                    window.SP_REACT.createElement(IconsModule.Information, { style: { height: "16px" } })),
                            window.SP_REACT.createElement(Dropdown, { contextMenuPositionOptions: { bMatchWidth: false }, rgOptions: themes, selectedOption: 1, strDefaultLabel: active, onChange: updateThemeCallback }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription },
                        window.SP_REACT.createElement("div", null, locale.themePanelThemeTooltip),
                        window.SP_REACT.createElement("a", { href: "#", onClick: OpenThemeRepository, className: "RmxP90Yut4EIwychIEg51", style: { display: "flex", gap: "5px" } },
                            window.SP_REACT.createElement(IconsModule.Hyperlink, { style: { width: "14px" } }),
                            locale.themePanelGetMoreThemes))),
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, locale.themePanelInjectJavascript),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon }, jsState !== undefined && window.SP_REACT.createElement(Toggle, { value: jsState, onChange: onScriptToggle }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription }, locale.themePanelInjectJavascriptToolTip)),
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, locale.themePanelInjectCSS),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon }, cssState !== undefined && window.SP_REACT.createElement(Toggle, { value: cssState, onChange: onStyleToggle }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription }, locale.themePanelInjectCSSToolTip)))));
    };

    let SettingsStore = pluginSelf.SettingsStore;
    const Settings = {
        FetchAllSettings: () => {
            return new Promise(async (resolve, _reject) => {
                const settingsStore = JSON.parse(await wrappedCallServerMethod("get_load_config").catch((_) => {
                    console.error("Failed to fetch settings");
                    pluginSelf.connectionFailed = true;
                }));
                SettingsStore = settingsStore;
                resolve(settingsStore);
            });
        }
    };

    const UpToDateModal = () => {
        return (window.SP_REACT.createElement("div", { className: "__up-to-date-container", style: {
                display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", height: "100%", justifyContent: "center"
            } },
            window.SP_REACT.createElement("div", { className: "__up-to-date-header", style: { marginTop: "-120px", color: "white", fontWeight: "500", fontSize: "15px" } }, locale.updatePanelNoUpdatesFound),
            window.SP_REACT.createElement("svg", { viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", style: { width: "40px" } },
                window.SP_REACT.createElement("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }),
                window.SP_REACT.createElement("g", { id: "SVGRepo_tracerCarrier", strokeLinecap: "round", strokeLinejoin: "round" }),
                window.SP_REACT.createElement("g", { id: "SVGRepo_iconCarrier" },
                    window.SP_REACT.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z", fill: "#55bd00" })))));
    };
    const RenderAvailableUpdates = ({ updates, setUpdates }) => {
        const [updating, setUpdating] = React.useState([]);
        const viewMoreClick = (props) => SteamClient.System.OpenInSystemBrowser(props?.commit);
        const updateItemMessage = (updateObject, index) => {
            setUpdating({ ...updating, [index]: true });
            wrappedCallServerMethod("updater.update_theme", { native: updateObject.native }).then((success) => {
                /** @todo: prompt user an error occured. */
                if (!success)
                    return;
                const activeTheme = pluginSelf.activeTheme;
                // the current theme was just updated, so reload SteamUI
                if (activeTheme.native === updateObject.native) {
                    SteamClient.Browser.RestartJSContext();
                }
                wrappedCallServerMethod("updater.get_update_list").then((result) => {
                    setUpdates(JSON.parse(result).updates);
                });
            });
        };
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement(DialogSubHeader, { className: '_2rK4YqGvSzXLj1bPZL8xMJ' }, locale.updatePanelHasUpdates),
            window.SP_REACT.createElement(DialogBodyText, { className: '_3fPiC9QRyT5oJ6xePCVYz8' }, locale.updatePanelHasUpdatesSub),
            updates.map((update, index) => (window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel", key: index },
                window.SP_REACT.createElement("div", { className: classMap.FieldLabelRow },
                    window.SP_REACT.createElement("div", { className: "update-item-type", style: { color: "white", fontSize: "12px", padding: "4px", background: "#007eff", borderRadius: "6px" } }, "Theme"),
                    window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, update.name),
                    window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon },
                        window.SP_REACT.createElement("div", { className: "_3N47t_-VlHS8JAEptE5rlR", style: { gap: "10px", width: "200px" } },
                            window.SP_REACT.createElement("button", { onClick: () => viewMoreClick(update), className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" }, locale.ViewMore),
                            window.SP_REACT.createElement("button", { onClick: () => updateItemMessage(update, index), className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable" }, updating[index] ? locale.updatePanelIsUpdating : locale.updatePanelUpdate)))),
                window.SP_REACT.createElement("div", { className: classMap.FieldDescription },
                    window.SP_REACT.createElement("b", null, locale.updatePanelReleasedTag),
                    " ",
                    update?.date),
                window.SP_REACT.createElement("div", { className: classMap.FieldDescription },
                    window.SP_REACT.createElement("b", null, locale.updatePanelReleasePatchNotes),
                    " ",
                    update?.message))))));
    };
    const UpdatesViewModal = () => {
        const [updates, setUpdates] = React.useState(null);
        const [checkingForUpdates, setCheckingForUpdates] = React.useState(false);
        const [showUpdateNotifications, setNotifications] = React.useState(undefined);
        React.useEffect(() => {
            wrappedCallServerMethod("updater.get_update_list").then((result) => {
                const updates = JSON.parse(result);
                console.log(updates);
                setUpdates(updates.updates);
                setNotifications(updates.notifications ?? false);
            })
                .catch((_) => {
                console.error("Failed to fetch updates");
                pluginSelf.connectionFailed = true;
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
            })
                .catch((_) => {
                console.error("Failed to fetch updates");
                pluginSelf.connectionFailed = true;
            });
        };
        const DialogHeaderStyles = {
            display: "flex", alignItems: "center", gap: "15px"
        };
        const OnNotificationsChange = (enabled) => {
            wrappedCallServerMethod("updater.set_update_notifs_status", { status: enabled })
                .then((success) => {
                if (success) {
                    setNotifications(enabled);
                    Settings.FetchAllSettings();
                }
            });
        };
        if (pluginSelf.connectionFailed) {
            return window.SP_REACT.createElement(ConnectionFailed, null);
        }
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement(DialogHeader, { style: DialogHeaderStyles },
                locale.settingsPanelUpdates,
                !checkingForUpdates &&
                    window.SP_REACT.createElement("button", { onClick: checkForUpdates, className: "_3epr8QYWw_FqFgMx38YEEm DialogButton _DialogLayout Secondary Focusable", style: { width: "16px", "-webkit-app-region": "no-drag", zIndex: "9999", padding: "4px 4px", display: "flex" } },
                        window.SP_REACT.createElement(IconsModule.Update, null))),
            window.SP_REACT.createElement(DialogBody, { className: classMap.SettingsDialogBodyFade },
                window.SP_REACT.createElement("div", { className: "S-_LaQG5eEOM2HWZ-geJI qFXi6I-Cs0mJjTjqGXWZA _3XNvAmJ9bv_xuKx5YUkP-5 _3bMISJvxiSHPx1ol-0Aswn _3s1Rkl6cFOze_SdV2g-AFo _1ugIUbowxDg0qM0pJUbBRM _5UO-_VhgFhDWlkDIOZcn_ XRBFu6jAfd5kH9a3V8q_x wE4V6Ei2Sy2qWDo_XNcwn Panel" },
                    window.SP_REACT.createElement("div", { className: "H9WOq6bV_VhQ4QjJS_Bxg" },
                        window.SP_REACT.createElement("div", { className: "_3b0U-QDD-uhFpw6xM716fw" }, locale.updatePanelUpdateNotifications),
                        window.SP_REACT.createElement("div", { className: classMap.FieldChildrenWithIcon }, showUpdateNotifications !== undefined && window.SP_REACT.createElement(Toggle, { value: showUpdateNotifications, onChange: OnNotificationsChange }))),
                    window.SP_REACT.createElement("div", { className: classMap.FieldDescription }, locale.updatePanelUpdateNotificationsTooltip)),
                updates && (!updates.length ? window.SP_REACT.createElement(UpToDateModal, null) : window.SP_REACT.createElement(RenderAvailableUpdates, { updates: updates, setUpdates: setUpdates })))));
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
                    ReactDOM.render(window.SP_REACT.createElement(PluginViewModal, null), element[0]);
                    break;
                case Renderer.Themes:
                    ReactDOM.render(window.SP_REACT.createElement(ThemeViewModal, null), element[0]);
                    break;
                case Renderer.Updates:
                    ReactDOM.render(window.SP_REACT.createElement(UpdatesViewModal, null), element[0]);
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
        React.useEffect(() => {
            Millennium.findElement(pluginSelf.settingsDoc, ".DialogBody").then(_ => {
                if (pluginSelf?.OpenOnUpdatesPanel ?? false) {
                    componentUpdate(Renderer.Updates);
                    pluginSelf.OpenOnUpdatesPanel = false;
                }
            });
        }, []);
        return (window.SP_REACT.createElement(window.SP_REACT.Fragment, null,
            window.SP_REACT.createElement("div", { className: `MillenniumTab PluginSettingsTab bkfjn0yka2uHNqEvWZaTJ ${selected == Renderer.Plugins ? "Myra7iGjzCdMPzitboVfh" : ""}`, onClick: () => componentUpdate(Renderer.Plugins) },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement("svg", { version: "1.1", id: "Icons", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", x: "0px", y: "0px", viewBox: "0 0 32 32", xmlSpace: "preserve" },
                        window.SP_REACT.createElement("g", null,
                            window.SP_REACT.createElement("path", { d: "M18.3,17.3L15,20.6L11.4,17l3.3-3.3c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L10,15.6l-1.3-1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4 L7.6,16l-2.8,2.8C3.6,19.9,3,21.4,3,23c0,1.3,0.4,2.4,1.1,3.5l-2.8,2.8c-0.4,0.4-0.4,1,0,1.4C1.5,30.9,1.7,31,2,31s0.5-0.1,0.7-0.3 l2.8-2.8C6.5,28.6,7.7,29,9,29c1.6,0,3.1-0.6,4.2-1.7l2.8-2.8l0.3,0.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L16.4,22l3.3-3.3c0.4-0.4,0.4-1,0-1.4S18.7,16.9,18.3,17.3z", fill: "currentColor" }),
                            window.SP_REACT.createElement("path", { d: "M30.7,1.3c-0.4-0.4-1-0.4-1.4,0l-2.8,2.8C25.5,3.4,24.3,3,23,3c-1.6,0-3.1,0.6-4.2,1.7l-3.5,3.5c-0.4,0.4-0.4,1,0,1.4l7,7 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3.5-3.5C28.4,12.1,29,10.6,29,9c0-1.3-0.4-2.4-1.1-3.5l2.8-2.8 C31.1,2.3,31.1,1.7,30.7,1.3z", fill: "currentColor" })))),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, locale.settingsPanelPlugins)),
            window.SP_REACT.createElement("div", { className: `MillenniumTab ThemesSettingsTab bkfjn0yka2uHNqEvWZaTJ ${selected == Renderer.Themes ? "Myra7iGjzCdMPzitboVfh" : ""}`, onClick: () => componentUpdate(Renderer.Themes) },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 48 48" },
                        window.SP_REACT.createElement("g", { id: "_21_-_30", "data-name": "21 - 30" },
                            window.SP_REACT.createElement("g", { id: "Art" },
                                window.SP_REACT.createElement("path", { d: "M45.936,18.9a23.027,23.027,0,0,0-1.082-2.1L39.748,30.67a4.783,4.783,0,0,1-.837,1.42,8.943,8.943,0,0,0,7.464-12.115C46.239,19.609,46.093,19.253,45.936,18.9Z", fill: "currentColor" }),
                                window.SP_REACT.createElement("path", { d: "M16.63,6.4A23.508,23.508,0,0,0,2.683,37.268c.031.063.052.125.083.188a8.935,8.935,0,0,0,15.662,1.526A16.713,16.713,0,0,1,26.165,32.7c.1-.04.2-.07.3-.107a6.186,6.186,0,0,1,3.859-3.453,4.865,4.865,0,0,1,.451-2.184l7.9-17.107A23.554,23.554,0,0,0,16.63,6.4ZM10.5,32.5a4,4,0,1,1,4-4A4,4,0,0,1,10.5,32.5Zm5-11.5a4,4,0,1,1,4-4A4,4,0,0,1,15.5,21Zm12-3.5a4,4,0,1,1,4-4A4,4,0,0,1,27.5,17.5Z", fill: "currentColor" }),
                                window.SP_REACT.createElement("path", { d: "M45.478,4.151a1.858,1.858,0,0,0-2.4.938L32.594,27.794a2.857,2.857,0,0,0,.535,3.18,4.224,4.224,0,0,0-4.865,2.491c-1.619,3.91.942,5.625-.678,9.535a10.526,10.526,0,0,0,8.5-6.3,4.219,4.219,0,0,0-1.25-4.887,2.85,2.85,0,0,0,3.037-1.837l8.64-23.471A1.859,1.859,0,0,0,45.478,4.151Z", fill: "currentColor" }))))),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, locale.settingsPanelThemes)),
            window.SP_REACT.createElement("div", { className: `MillenniumTab UpdatesSettingsTab bkfjn0yka2uHNqEvWZaTJ ${selected == Renderer.Updates ? "Myra7iGjzCdMPzitboVfh" : ""}`, onClick: () => componentUpdate(Renderer.Updates) },
                window.SP_REACT.createElement("div", { className: "U6HcKswXzjmWtFxbjxuz4" },
                    window.SP_REACT.createElement(IconsModule.Update, null)),
                window.SP_REACT.createElement("div", { className: "_2X9_IsQsEJDpAd2JGrHdJI" }, locale.settingsPanelUpdates)),
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
            bufferDiv.classList.add("millennium-tabs-list");
            element[0].prepend(bufferDiv);
            ReactDOM.render(window.SP_REACT.createElement(PluginComponent, null), bufferDiv);
        });
    }

    /**
     * appends a virtual CSS script into self module
     * @param systemColors SystemAccentColors
     */
    const DispatchSystemColors = (systemColors) => {
        pluginSelf.systemColor = `
    :root {
        --SystemAccentColor: ${systemColors.accent}; 
        --SystemAccentColorLight1: ${systemColors.light1}; --SystemAccentColorDark1: ${systemColors.dark1};
        --SystemAccentColorLight2: ${systemColors.light2}; --SystemAccentColorDark2: ${systemColors.dark2};
        --SystemAccentColorLight3: ${systemColors.light3}; --SystemAccentColorDark3: ${systemColors.dark3};
    }`;
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
    /**
     * parses a theme after it has been received from the backend.
     * - checks for failure in theme parse
     * - calculates what patches should be used relative to UseDefaultPatches
     * @param theme ThemeItem
     * @returns void
     */
    const ParseLocalTheme = (theme) => {
        if (theme?.failed) {
            pluginSelf.isDefaultTheme = true;
            return;
        }
        theme?.data?.UseDefaultPatches && (theme.data.Patches = parseTheme(theme?.data?.Patches ?? []));
        pluginSelf.activeTheme = theme;
    };

    /**
     * @todo use builtin notification components instead of altering
     * SteamClient.ClientNotifications.DisplayClientNotification
     * @param doc document of notification
     */
    const RemoveAllListeners = (doc) => {
        var bodyClass = [...doc.getElementsByClassName("_3CGHgMXRIoyrljmStDoKuf")];
        Array.from(bodyClass).forEach(function (element) {
            var newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
    };
    const SetClickListener = (doc) => {
        var bodyClass = [...doc.getElementsByClassName("_3CGHgMXRIoyrljmStDoKuf")][0];
        bodyClass.addEventListener("click", () => {
            console.log("clicked notif!");
            pluginSelf.OpenOnUpdatesPanel = true;
            /** Open the settings window */
            window.open("steam://open/settings", "_blank");
        });
    };
    const PatchNotification = (doc) => {
        Millennium.findElement(doc, "._3dAcRIhxsyAgEam4dywJvj").then(async (elements) => {
            const header = elements[0].textContent;
            if (header == "Updates Available") {
                (await Millennium.findElement(doc, "._28AhGOLtOo3TwshpQm2-wk"))?.[0]?.remove();
                (await Millennium.findElement(doc, "._2yhOCNV9s2fKohW8wqWRTY"))?.[0]?.remove();
                (await Millennium.findElement(doc, "._19g_L-qkP3q7SDkgXAgoli"))?.[0]?.remove();
            }
            RemoveAllListeners(doc);
            SetClickListener(doc);
        });
    };

    /**
     * appends a virtual CSS script into self module
     * @param globalColors V1 Global Colors struct
     */
    const DispatchGlobalColors = (globalColors) => {
        pluginSelf.GlobalsColors = `
    :root {
        ${globalColors.map((color) => `${color.ColorName}: ${color.HexColorCode};`).join(" ")}
    }`;
    };

    const PatchMissedDocuments = () => {
        // @ts-ignore
        g_PopupManager.m_mapPopups.data_.forEach((element) => {
            if (element.value_.m_popup.window.HAS_INJECTED_THEME === undefined) {
                patchDocumentContext(element.value_);
            }
        });
    };
    const windowCreated = (windowContext) => {
        switch (windowContext.m_strTitle) {
            /** @ts-ignore */
            case LocalizationManager.LocalizeString("#Steam_Platform"):        /** @ts-ignore */
            case LocalizationManager.LocalizeString("#Settings_Title"): {
                RenderSettingsModal(windowContext);
            }
        }
        if (windowContext.m_strTitle.includes("notificationtoasts")) {
            PatchNotification(windowContext.m_popup.document);
        }
        PatchMissedDocuments();
        patchDocumentContext(windowContext);
    };
    const InitializePatcher = (startTime, result) => {
        Logger.Log(`Received props in [${(performance.now() - startTime).toFixed(3)}ms]`, result);
        const theme = result.active_theme;
        const systemColors = result.accent_color;
        ParseLocalTheme(theme);
        DispatchSystemColors(systemColors);
        const themeV1 = result?.active_theme?.data;
        if (themeV1?.GlobalsColors) {
            DispatchGlobalColors(themeV1?.GlobalsColors);
        }
        pluginSelf.conditionals = result.conditions;
        pluginSelf.scriptsAllowed = result?.settings?.scripts ?? true;
        pluginSelf.stylesAllowed = result?.settings?.styles ?? true;
        // @ts-ignore
        if (g_PopupManager.m_mapPopups.size > 0) {
            SteamClient.Browser.RestartJSContext();
        }
        PatchMissedDocuments();
    };
    const ProcessUpdates = (updates) => {
        const updateCount = updates.length;
        if (!SettingsStore.settings.updateNotifications || updateCount <= 0) {
            return;
        }
        const message = `Millennium found ${updateCount} available update${updateCount > 1 ? "s" : ""}`;
        SteamClient.ClientNotifications.DisplayClientNotification(1, JSON.stringify({ title: 'Updates Available', body: message, state: 'online', steamid: 0 }), (_) => { });
    };
    // Entry point on the front end of your plugin
    async function PluginMain() {
        const startTime = performance.now();
        Settings.FetchAllSettings().then((result) => InitializePatcher(startTime, result));
        wrappedCallServerMethod("updater.get_update_list")
            .then((result) => JSON.parse(result).updates)
            .then((updates) => ProcessUpdates(updates))
            .catch((_) => {
            console.error("Failed to fetch updates");
            pluginSelf.connectionFailed = true;
        });
        Millennium.AddWindowCreateHook(windowCreated);
    }

    exports.default = PluginMain;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, window.SP_REACT, window.SP_REACTDOM);

function ExecutePluginModule() {
    // Assign the plugin on plugin list. 
    Object.assign(window.PLUGIN_LIST[pluginName], millennium_main);
    // Run the rolled up plugins default exported function 
    millennium_main["default"]();
    MILLENNIUM_BACKEND_IPC.postMessage(1, { pluginName: pluginName });
}
ExecutePluginModule()