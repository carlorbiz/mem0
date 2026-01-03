import { openDB } from 'idb';

const DB_NAME = 'voice-recordings';
const STORE_NAME = 'recordings';
const DB_VERSION = 2; // Updated for transcription support

export class StorageService {
  constructor() {
    this.db = null;
  }

  async initialize() {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        let store;

        // Create store if it doesn't exist (v1)
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('synced', 'synced');
        } else {
          store = transaction.objectStore(STORE_NAME);
        }

        // Add transcription indexes (v2)
        if (oldVersion < 2) {
          if (!store.indexNames.contains('transcribed')) {
            store.createIndex('transcribed', 'transcribed');
          }
        }
      },
    });
  }

  async saveRecording(blob, metadata) {
    const recording = {
      blob,
      timestamp: new Date().toISOString(),
      synced: false,
      transcribed: false,
      transcript: null,
      transcriptionError: null,
      fileName: metadata.fileName,
      drivePath: metadata.drivePath,
      retryCount: 0,
      transcriptionRetryCount: 0,
      ...metadata
    };

    const id = await this.db.add(STORE_NAME, recording);
    console.log('Recording saved to IndexedDB, id:', id);
    return id;
  }

  async getUnsyncedRecordings() {
    try {
      // Try using index first (for properly upgraded databases)
      if (this.db.objectStoreNames.contains(STORE_NAME)) {
        const tx = this.db.transaction(STORE_NAME, 'readonly');
        const store = tx.store;

        // Check if index exists before using it
        if (store.indexNames.contains('synced')) {
          const index = store.index('synced');
          const recordings = await index.getAll(IDBKeyRange.only(false));
          return recordings || [];
        }
      }

      // Fallback: Get all recordings and filter manually
      // This handles old databases without the 'synced' index
      console.warn('Index "synced" not found, using manual filter');
      const allRecordings = await this.getAllRecordings();
      return allRecordings.filter(r => !r.synced);
    } catch (error) {
      console.error('Error getting unsynced recordings:', error);
      // Last resort: return all recordings
      try {
        return await this.getAllRecordings();
      } catch (e) {
        return [];
      }
    }
  }

  async markAsSynced(id) {
    const recording = await this.db.get(STORE_NAME, id);
    if (recording) {
      recording.synced = true;
      recording.syncedAt = new Date().toISOString();
      await this.db.put(STORE_NAME, recording);
    }
  }

  async deleteRecording(id) {
    await this.db.delete(STORE_NAME, id);
  }

  async incrementRetryCount(id) {
    const recording = await this.db.get(STORE_NAME, id);
    if (recording) {
      recording.retryCount = (recording.retryCount || 0) + 1;
      recording.lastRetry = new Date().toISOString();
      await this.db.put(STORE_NAME, recording);
    }
  }

  async getStorageEstimate() {
    if (navigator.storage && navigator.storage.estimate) {
      return await navigator.storage.estimate();
    }
    return null;
  }

  async getPendingCount() {
    const unsynced = await this.getUnsyncedRecordings();
    return unsynced.length;
  }

  // Transcription management methods

  async updateTranscript(id, transcript, metadata = {}) {
    const recording = await this.db.get(STORE_NAME, id);
    if (recording) {
      recording.transcribed = true;
      recording.transcript = transcript;
      recording.transcriptionError = null;
      recording.transcribedAt = new Date().toISOString();
      recording.transcriptionMetadata = metadata;
      await this.db.put(STORE_NAME, recording);
      console.log(`Transcript saved for recording ${id}`);
    }
  }

  async updateTranscriptionError(id, error) {
    const recording = await this.db.get(STORE_NAME, id);
    if (recording) {
      recording.transcribed = false;
      recording.transcriptionError = error;
      recording.transcriptionRetryCount = (recording.transcriptionRetryCount || 0) + 1;
      recording.lastTranscriptionRetry = new Date().toISOString();
      await this.db.put(STORE_NAME, recording);
    }
  }

  async getUntranscribedRecordings() {
    try {
      // Try using index first (for properly upgraded databases)
      if (this.db.objectStoreNames.contains(STORE_NAME)) {
        const tx = this.db.transaction(STORE_NAME, 'readonly');
        const store = tx.store;

        // Check if index exists before using it
        if (store.indexNames.contains('transcribed')) {
          const index = store.index('transcribed');
          const recordings = await index.getAll(IDBKeyRange.only(false));
          // Filter out recordings with too many retry attempts
          return recordings.filter(r => (r.transcriptionRetryCount || 0) < 5);
        }
      }

      // Fallback: Get all recordings and filter manually
      console.warn('Index "transcribed" not found, using manual filter');
      const allRecordings = await this.getAllRecordings();
      return allRecordings.filter(r => !r.transcribed && (r.transcriptionRetryCount || 0) < 5);
    } catch (error) {
      console.warn('Error getting untranscribed recordings:', error);
      return [];
    }
  }

  async getRecording(id) {
    return await this.db.get(STORE_NAME, id);
  }

  async getAllRecordings() {
    return await this.db.getAll(STORE_NAME);
  }

  async getTotalCount() {
    try {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const count = await tx.store.count();
      return count;
    } catch (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
  }
}
