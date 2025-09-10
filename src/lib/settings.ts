// src/lib/settings.ts

export interface AppSettings {
  apiEndpoint: string;
  accessToken: string;
  autoDeleteDays: number;
}

const SETTINGS_KEY = 'memos-offline-settings';

/**
 * Retrieves the application settings from local storage.
 * @returns The settings object or a default object if not found.
 */
export function getSettings(): AppSettings {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
  } catch (error) {
    console.error("Failed to parse settings from localStorage: ", error);
  }
  
  // Return a default object if settings are not found or parsing fails
  return {
    apiEndpoint: '',
    accessToken: '',
    autoDeleteDays: 0,
  };
}

/**
 * Saves the application settings to local storage.
 * @param settings The settings object to save.
 */
export function saveSettings(settings: AppSettings): void {
  try {
    const settingsJson = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_KEY, settingsJson);
  } catch (error) {
    console.error("Failed to save settings to localStorage: ", error);
  }
}
