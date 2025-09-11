import { db, type Note } from './db';
import { getSettings } from './settings';

/**
 * The Memo object from the Memos API.
 */
interface RemoteMemo {
  name: string; // The resource name, e.g., memos/123
  content: string;
  display_time: string;
}

async function handleApiResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  throw new Error('Received a non-JSON response from the server. Please check your API Endpoint setting.');
}

/**
 * Creates a new note on the remote Memos server by first creating it and then
 * immediately updating it with the correct display time.
 */
async function createRemoteNote(note: Note, apiUrl: string, accessToken: string): Promise<RemoteMemo> {
  // Step 1: Create the memo. The server will assign its own timestamp.
  const createResponse = await fetch(`${apiUrl}/api/v1/memos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content: note.content }),
  });
  const createdMemo: RemoteMemo = await handleApiResponse(createResponse);
  const remoteId = createdMemo.name.split('/').pop();
  if (!remoteId) {
    throw new Error('Could not parse remote ID from API response during creation.');
  }

  // Step 2: Immediately update the memo with the correct displayTime.
  const updateResponse = await fetch(`${apiUrl}/api/v1/memos/${remoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ display_time: note.displayTime.toISOString() }),
  });

  return handleApiResponse(updateResponse);
}

/**
 * Updates an existing note on the remote Memos server.
 */
async function updateRemoteNote(note: Note, apiUrl: string, accessToken: string): Promise<RemoteMemo> {
  if (!note.remoteId) {
    throw new Error('Cannot update a note without a remoteId');
  }

  const response = await fetch(`${apiUrl}/api/v1/memos/${note.remoteId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content: note.content, display_time: note.displayTime.toISOString() }),
  });
  return handleApiResponse(response);
}

/**
 * Synchronizes local notes with the remote Memos server.
 */
export async function syncWithRemote() {
  const settings = getSettings();
  if (!settings.apiEndpoint || !settings.accessToken) {
    console.warn('API Endpoint or Access Token not configured. Skipping sync.');
    throw new Error('API Endpoint or Access Token not configured.');
  }

  // Remove trailing slash from the API endpoint to prevent double slashes
  const sanitizedApiUrl = settings.apiEndpoint.replace(/\/$/, '');

  console.log('Starting synchronization...');

  const localNotes = await db.notes.toArray();
  const notesToCreate = localNotes.filter(n => !n.remoteId && !n.isSynced);
  const notesToUpdate = localNotes.filter(n => n.remoteId && !n.isSynced);

  console.log(`${notesToCreate.length} notes to create.`);
  for (const note of notesToCreate) {
    try {
      const remoteMemo = await createRemoteNote(note, sanitizedApiUrl, settings.accessToken);
      const remoteId = remoteMemo.name.split('/').pop();
      if (!remoteId) {
        throw new Error('Could not parse remote ID from API response.');
      }
      await db.notes.update(note.localId!, { remoteId: remoteId, isSynced: true });
    } catch (error) {
      console.error(`Failed to create note ${note.localId}:`, error);
      throw error;
    }
  }

  console.log(`${notesToUpdate.length} notes to update.`);
  for (const note of notesToUpdate) {
    try {
      await updateRemoteNote(note, sanitizedApiUrl, settings.accessToken);
      await db.notes.update(note.localId!, { isSynced: true });
    } catch (error) {
      console.error(`Failed to update note ${note.localId}:`, error);
      throw error;
    }
  }

  console.log('Synchronization finished.');
}
