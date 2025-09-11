import { db } from './db';
import { getSettings } from './settings';

/**
 * Deletes old, synced notes from the local database based on the
 * auto-delete setting.
 */
export async function cleanupOldNotes() {
  const settings = getSettings();
  const autoDeleteDays = settings.autoDeleteDays || 0;

  if (autoDeleteDays <= 0) {
    console.log('Auto-delete is disabled. Skipping cleanup.');
    return;
  }

  console.log(`Auto-deleting notes older than ${autoDeleteDays} days.`);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - autoDeleteDays);

  try {
    const notesToDelete = await db.notes
      .where('displayTime')
      .below(cutoffDate)
      .filter(note => note.isSynced === true)
      .toArray();

    if (notesToDelete.length > 0) {
      const idsToDelete = notesToDelete.map(note => note.localId!);
      await db.notes.bulkDelete(idsToDelete);
      console.log(`Successfully deleted ${idsToDelete.length} old notes.`);
    } else {
      console.log('No old notes to delete.');
    }
  } catch (error) {
    console.error('Error during old note cleanup:', error);
  }
}
