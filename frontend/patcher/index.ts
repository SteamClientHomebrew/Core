import { pluginSelf } from "millennium-lib";
import { ConditionalControlFlowType as ModuleType, Patch, ThemeItem } from "../types/types";
import { DOMModifier, classListMatch, constructThemePath, parseTheme } from "./dispatcher";
import { evaluateConditions } from "./v2/conditions";
import { PatchV1, EvaluateStatements } from "./v1/conditions"

/**
 * @brief evaluates list of; or single module
 * 
 * @param module module(s) to be injected into the frame
 * @param type the type of the module
 * @returns null
 */
const evaluateTargetModule = (module: string | Array<string>, type: ModuleType, document: Document) => {

    const activeTheme: ThemeItem = pluginSelf.activeTheme
    const nodeHandler = type == ModuleType.TargetCss ? DOMModifier.AddStyleSheet : DOMModifier.AddJavaScript

    if (module === undefined) return 
    
    if (typeof module === 'string') {
        nodeHandler(document, constructThemePath(activeTheme.native, module));
    }
    else if (Array.isArray(module)) {
        module.forEach(css => nodeHandler(document, constructThemePath(activeTheme.native, css)));
    }
}

const evaluatePatches = (activeTheme: ThemeItem, documentTitle: string, classList: string[], document: Document, context: any) => {
    activeTheme.data.Patches.forEach((patch: Patch) => {

        const match = patch.MatchRegexString
        context.m_popup.window.HAS_INJECTED_THEME = documentTitle === "Steam"

        if (!documentTitle.match(match) && !classListMatch(classList, match)) {
            return 
        }

        evaluateTargetModule(patch?.TargetCss, ModuleType.TargetCss, document)
        evaluateTargetModule(patch?.TargetJs, ModuleType.TargetJs, document)

        // backwards compatability with old millennium versions. 
        const PatchV1 = (patch as PatchV1)

        if (PatchV1?.Statement !== undefined) {
            EvaluateStatements(PatchV1, document)
        }
    });
}

const getDocumentClassList = (context: any): string[] => {

    const bodyClass: string = context?.m_rgParams?.body_class ?? String()
    const htmlClass: string = context?.m_rgParams?.html_class ?? String()

    return (bodyClass + htmlClass).split(' ').map((className: string) => '.' + className)
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

    console.log(windowContext)

    // Append System Accent Colors to global document (publically shared)
    DOMModifier.AddStyleSheetFromText(document, pluginSelf.systemColor, "SystemAccentColorInject")

    activeTheme?.data?.hasOwnProperty("Patches") && evaluatePatches(activeTheme, documentTitle, classList, document, windowContext)
    activeTheme?.data?.hasOwnProperty("Conditions") && evaluateConditions(activeTheme, documentTitle, classList, document)
}

export { parseTheme, patchDocumentContext }