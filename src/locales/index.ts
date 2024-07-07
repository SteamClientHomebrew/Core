import english from "./locales/english.json";
import polish from "./locales/polish.json";
import spanish from "./locales/spanish.json";
import indonesian from "./locales/indonesian.json";
import schinese from "./locales/schinese.json";
import german from "./locales/german.json";
import { Logger } from "../components/Logger";

interface LocalizationData {
    [key: string]: string;
}

let _locale = english 

const handler: ProxyHandler<any>  = {
    get: function(target, property: keyof any) {

        if (property in target) {
            return target[property];
        }
        else {
            try {
                // fallback to english if the target string wasn't found
                return (english as any)?.[property]
            }
            catch (exception) {
                return "locale was not found."
            }
        }
    }
};

export let locale: LocalizationData = new Proxy(_locale, handler);

const localizationFiles: { [key: string]: LocalizationData } = {
    english,
    polish,
    spanish,
    indonesian,
    schinese,
    german
    // Add other languages here
};

const GetLocalization = async () => {

    const language = await SteamClient.Settings.GetCurrentLanguage()
    Logger.Log(`loading locales ${language} ${localizationFiles?.[language]}`)

    if (localizationFiles.hasOwnProperty(language)) {
        locale = localizationFiles[language];
    } 
    else {
        Logger.Warn(`Localization for language ${language} not found, defaulting to English.`)
        locale = localizationFiles['english'];
    }
};

// setup locales on startup
GetLocalization();