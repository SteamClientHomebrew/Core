/*
 Global Millennium API for developers. 
*/
type Millennium = {
    /* call a backend server method */
    callServerMethod: (methodName: string, kwargs?: object) => Promise<any>,
    AddWindowCreateHook: (callback: (context: object) => void) => void,
    findElement: (privateDocument: string,  querySelector: string, timeOut?: number) => Promise<HTMLElement[]>,
    /* Expose a function to mainworld so it can be called from the backend */
    exposeObj: <T extends object>(obj: T) => any
};

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
        Millennium: Millennium
    }
}

const Millennium: Millennium = window.Millennium as Millennium

Millennium.exposeObj = function<T extends object>(obj: T): void {
    for (const key in obj) {
        exports[key] = obj[key];
    }
}

export { Millennium, pluginSelf }