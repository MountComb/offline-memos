import type { AppSettings } from './settings';

/**
 * A simple client for the Memos API.
 */
export class MemosAPI {
  private settings: AppSettings;

  constructor(settings: AppSettings) {
    this.settings = settings;
  }

  /**
   * Tests the connection to the Memos API endpoint using the provided credentials.
   * It does so by fetching the current session, which requires a valid access token.
   */
  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const { apiEndpoint, accessToken } = this.settings;

    if (!apiEndpoint || !accessToken) {
      return { ok: false, message: 'Missing credentials.' };
    }

    try {
        // Remove any trailing slash from the endpoint to prevent double slashes
        const cleanApiEndpoint = apiEndpoint.replace(/\/$/, '');
        const url = `${cleanApiEndpoint}/api/v1/auth/sessions/current`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
            return { ok: true, message: 'Connection successful!' };
        } else {
             return { ok: false, message: `Connection failed.` };
        }
    } catch (error) {
        console.error("Connection test failed:", error);
        return { ok: false, message: 'Connection failed.' };
    }
  }
}
