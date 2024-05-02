/*
 Global Millennium API for developers. 
*/
type Millennium = {
    /* call a backend server method */
    callServerMethod: (methodName: string, kwargs?: object) => Promise<any>,
    AddWindowCreateHook: (callback: (context: object) => void) => void,
    findElement: (privateDocument: string,  querySelector: string, timeOut?: number) => Promise<HTMLElement[]>,
    createWindow: (windowContext: WindowType) => CreatedWindow
    /* Expose a function to mainworld so it can be called from the backend */
    exposeObj: <T extends object>(obj: T) => any
};

export interface CreatedWindow {
    window: Window & typeof globalThis,
    document: Document
}

interface WindowDimensions {
    width: number, 
    height: number
}

// Control what window controls are exposed. 
export enum WindowControls {
    Minimize = 1 << 0,
    Maximize = 1 << 1,
    Close = 1 << 2
}

export interface WindowType {
    minimumDimensions?: WindowDimensions,
    dimensions?: WindowDimensions,
    controls?: WindowControls,
    icon?: SVGElement,
    title?: string,
    // prevent Millennium from adding boiler plate HTML
    emptyDocument: boolean,
    autoShow?: boolean,
    resizable?: boolean,
    delayShow?: number // delay when the window shows, in milliseconds. defaults to 500ms
}

const m_private_context: any = undefined
/* 
pluginSelf is a sandbox for data specific to your plugin. 
You can't access other plugins sandboxes and they can't access yours 

ex: 
    pluginSelf.var = "Hello"
    console.log(pluginSelf.var) -> Hello
    
notes:
    pluginSelf can be refrenced from any js/ts file and its guaranteed to be the same object
*/
const pluginSelf: any = m_private_context

// Ignore the following code. you can't (shouldn't) interact with it

declare global {
    interface Window {
        Millennium: Millennium,
        PLUGIN_LIST: any // internal plugin data
    }
}

const Millennium: Millennium = window.Millennium as Millennium

Millennium.exposeObj = function<T extends object>(obj: T): void {
    for (const key in obj) {
        exports[key] = obj[key];
    }
}

export { Millennium, pluginSelf }