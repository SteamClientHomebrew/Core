import english from "./locales/english.json";
import polish from "./locales/polish.json";
import spanish from "./locales/spanish.json";
import indonesian from "./locales/spanish.json";

interface LocalizationData {
    [key: string]: string;
}

export let locale: LocalizationData = undefined;

const localizationFiles: { [key: string]: LocalizationData } = {
    english,
    polish,
    spanish,
    indonesian
    // Add other languages here
};

const GetLocalization = async () => {
    // @ts-ignore
    const language = LocalizationManager.m_mapTokens.get("language");
    console.log(`Millennium loading with locales ${language}`)

    if (localizationFiles.hasOwnProperty(language)) {
        locale = localizationFiles[language];
    } else {
        console.warn(`Localization for language ${language} not found, defaulting to English.`);
        locale = localizationFiles['english'];
    }
};

// setup locales on startup
GetLocalization();