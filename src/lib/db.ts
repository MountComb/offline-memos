import Dexie, { type Table } from 'dexie';

// 1. Define the TypeScript interface for our data
export interface Note {
  localId?: number; // Auto-incrementing primary key
  remoteId?: string; // ID from the remote Memos server
  isSynced: boolean;  // True if the note is synced with the server
  content: string;    // Markdown content of the note
  displayTime: Date;  // The user-facing timestamp for the note
}

// 2. Define the Dexie database class
class MemosDB extends Dexie {
  // 'notes' is the name of our object store (table).
  notes!: Table<Note>;

  constructor() {
    super('MemosOfflineDB'); // The name of our database
    this.version(1).stores({
      // Define the schema for the 'notes' table.
      // '++localId' makes localId the auto-incrementing primary key.
      // 'remoteId', 'isSynced', and 'displayTime' are indexed for faster queries.
      notes: '++localId, remoteId, isSynced, displayTime',
    });
  }
}

// 3. Create a single, shared instance of the database
const db = new MemosDB();

// 4. Export utility functions for database interactions

/**
 * Adds a new note to the local database.
 * @param content The markdown content of the note.
 */
export async function addNote(content: string): Promise<void> {
  try {
    await db.notes.add({
      content,
      isSynced: false,
      displayTime: new Date(),
    });
  } catch (error) {
    console.error("Failed to add note: ", error);
  }
}

/**
 * Updates an existing note in the local database.
 * @param localId The local ID of the note to update.
 * @param content The new markdown content.
 */
export async function updateNote(localId: number, content: string): Promise<void> {
    try {
        // Also update displayTime to reflect the latest change
        await db.notes.update(localId, { 
            content, 
            isSynced: false, 
            displayTime: new Date() 
        });
    } catch (error) {
        console.error(`Failed to update note ${localId}: `, error);
    }
}

/**
 * Deletes a note from the local database.
 * @param localId The local ID of the note to delete.
 */
export async function deleteNote(localId: number): Promise<void> {
    try {
        await db.notes.delete(localId);
    } catch (error) {
        console.error(`Failed to delete note ${localId}: `, error);
    }
}

/**
 * Retrieves a single note by its local ID.
 * @param localId The local ID of the note.
 */
export async function getNoteById(localId: number): Promise<Note | undefined> {
    try {
        return await db.notes.get(localId);
    } catch (error) {
        console.error(`Failed to get note ${localId}: `, error);
        return undefined;
    }
}

/**
 * Deletes the entire database.
 */
export async function deleteDatabase(): Promise<void> {
    try {
        await db.delete();
    } catch (error) {
        console.error("Failed to delete database: ", error);
    }
}

// Export the raw db instance for use with dexie-react-hooks
export { db };
