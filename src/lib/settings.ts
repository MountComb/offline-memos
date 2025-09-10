export interface AppSettings {
    apiEndpoint?: string;
    accessToken?: string;
    autoDeleteDays: number; // 0 means disabled
}

const SETTINGS_KEY = 'memos_settings';

const defaultSettings: AppSettings = {
    autoDeleteDays: 0, 
};

/**
 * Retrieves the current app settings from localStorage.
 * @returns The current settings or the default settings if none are found.
 */
export function getSettings(): AppSettings {
    try {
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        if (storedSettings) {
            return { ...defaultSettings, ...JSON.parse(storedSettings) };
        }
    } catch (error) {
        console.error("Failed to retrieve settings: ", error);
    }
    return defaultSettings;
}

/**
 * Saves the app settings to localStorage.
 * @param settings The settings object to save.
 */
export function saveSettings(settings: AppSettings): void {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings: ", error);
    }
}
