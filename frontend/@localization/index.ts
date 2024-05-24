import english from "./locales/english.json";

interface LocalizationData {
    [key: string]: string;
}

export let locale: LocalizationData = undefined;

const localizationFiles: { [key: string]: LocalizationData } = {
    english,
    // Add other languages here
};

const GetLocalization = async () => {
    // @ts-ignore
    const language = LocalizationManager.m_mapTokens.get("language");

    if (localizationFiles.hasOwnProperty(language)) {
        locale = localizationFiles[language];
    } else {
        console.warn(`Localization for language ${language} not found, defaulting to English.`);
        locale = localizationFiles['english'];
    }
};

// setup locales on startup
GetLocalization();