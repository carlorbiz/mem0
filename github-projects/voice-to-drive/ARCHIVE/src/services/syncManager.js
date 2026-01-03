export class SyncManager {
  constructor(storageService, driveService, transcriptionService = null) {
    this.storage = storageService;
    this.drive = driveService;
    this.transcription = transcriptionService;
    this.isSyncing = false;
    this.isTranscribing = false;
    this.syncQueue = [];
    this.syncInterval = null;
    this.transcriptionInterval = null;
    this.onStatusChange = null;
    this.onError = null; // NEW: Error callback
    this.lastError = null; // NEW: Track last error
    // If no transcription service, always upload audio
    this.uploadAudio = !transcriptionService;
    console.log(`Audio upload ${this.uploadAudio ? 'ENABLED' : 'disabled'} (transcription: ${transcriptionService ? 'available' : 'not available'})`);
  }

  async syncAll() {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('Offline, skipping sync');
      return;
    }

    this.isSyncing = true;
    this.notifyStatusChange();

    try {
      const unsyncedRecordings = await this.storage.getUnsyncedRecordings();
      console.log(`Found ${unsyncedRecordings.length} recordings to sync`);

      if (unsyncedRecordings.length === 0) {
        console.log('No recordings to sync');
        return;
      }

      for (const recording of unsyncedRecordings) {
        try {
          await this.syncRecording(recording);
          this.lastError = null; // Clear error on success
        } catch (error) {
          console.error(`Failed to sync recording ${recording.id}:`, error);
          this.lastError = error.message;
          this.notifyError(`Upload failed: ${error.message}`);

          await this.storage.incrementRetryCount(recording.id);

          // Give up after 5 retries
          if (recording.retryCount >= 5) {
            console.error(`Recording ${recording.id} failed after 5 retries, keeping in queue`);
            this.notifyError(`Recording ${recording.id} failed after 5 retries`);
          }
        }
      }
    } catch (error) {
      console.error('Sync error:', error);
      this.lastError = error.message;
      this.notifyError(`Sync error: ${error.message}`);
    } finally {
      this.isSyncing = false;
      this.notifyStatusChange();
    }
  }

  async syncRecording(recording) {
    // Parse date from timestamp
    const date = new Date(recording.timestamp);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Ensure folder structure exists
    const folderId = await this.drive.ensureFolderPath(year, month, day);

    // Generate base filename
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}-${minutes}-${seconds}`;
    const baseFileName = `${year}-${month}-${day}_${timeStr}`;

    // Upload transcript if available
    if (recording.transcribed && recording.transcript) {
      const transcriptBlob = new Blob([recording.transcript], { type: 'text/plain' });
      await this.drive.uploadFile(transcriptBlob, `${baseFileName}.txt`, folderId);
      console.log(`Uploaded transcript for recording ${recording.id}`);
    }

    // Upload audio if configured or if no transcript
    if (this.uploadAudio || !recording.transcribed) {
      await this.drive.uploadFile(recording.blob, `${baseFileName}.webm`, folderId);
      console.log(`Uploaded audio for recording ${recording.id}`);
    }

    // Mark as synced but DON'T delete - keep as backup
    await this.storage.markAsSynced(recording.id);
    // DISABLED: await this.storage.deleteRecording(recording.id);
    // Recordings kept in IndexedDB for safety until user manually exports/clears

    console.log(`Successfully synced recording ${recording.id} as ${baseFileName} (kept in IndexedDB as backup)`);
  }

  // Transcription methods

  async transcribeAll() {
    if (!this.transcription || !this.transcription.isAvailable()) {
      console.log('Transcription service not available');
      return;
    }

    if (this.isTranscribing) {
      console.log('Transcription already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('Offline, skipping transcription');
      return;
    }

    this.isTranscribing = true;
    this.notifyStatusChange();

    try {
      const untranscribed = await this.storage.getUntranscribedRecordings();
      console.log(`Found ${untranscribed.length} recordings to transcribe`);

      if (untranscribed.length === 0) {
        console.log('No recordings to transcribe');
        return;
      }

      for (const recording of untranscribed) {
        try {
          await this.transcribeRecording(recording);
        } catch (error) {
          console.error(`Failed to transcribe recording ${recording.id}:`, error);
          this.notifyError(`Transcription failed: ${error.message}`);
          await this.storage.updateTranscriptionError(
            recording.id,
            error.error || error.message || 'Transcription failed'
          );
        }
      }
    } catch (error) {
      console.error('Transcription error:', error);
      this.notifyError(`Transcription error: ${error.message}`);
    } finally {
      this.isTranscribing = false;
      this.notifyStatusChange();
    }
  }

  async transcribeRecording(recording) {
    console.log(`Transcribing recording ${recording.id}...`);

    const result = await this.transcription.transcribeWithRetry(recording.blob);

    if (result.success && result.text) {
      await this.storage.updateTranscript(recording.id, result.text, {
        processingTime: result.processingTime,
        audioSize: result.audioSize,
        timestamp: result.timestamp,
      });
      console.log(`Successfully transcribed recording ${recording.id}`);
    } else {
      throw new Error(result.error || 'Transcription returned no text');
    }
  }

  startAutoSync(intervalMs = 30000) {
    // Auto-sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, intervalMs);

    // Auto-transcribe every 15 seconds (faster to get transcripts ready)
    if (this.transcription && this.transcription.isAvailable()) {
      this.transcriptionInterval = setInterval(() => {
        this.transcribeAll();
      }, intervalMs / 2);
    }
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    if (this.transcriptionInterval) {
      clearInterval(this.transcriptionInterval);
      this.transcriptionInterval = null;
    }
  }

  setUploadAudio(shouldUpload) {
    this.uploadAudio = shouldUpload;
    console.log(`Audio upload ${shouldUpload ? 'enabled' : 'disabled'}`);
  }

  setStatusChangeCallback(callback) {
    this.onStatusChange = callback;
  }

  setErrorCallback(callback) {
    this.onError = callback;
  }

  notifyError(errorMessage) {
    console.error('SyncManager error:', errorMessage);
    if (this.onError) {
      this.onError(errorMessage);
    }
  }

  async notifyStatusChange() {
    if (this.onStatusChange) {
      const pendingCount = await this.storage.getPendingCount();
      const untranscribed = this.transcription
        ? await this.storage.getUntranscribedRecordings()
        : [];

      this.onStatusChange({
        syncing: this.isSyncing,
        transcribing: this.isTranscribing,
        pending: pendingCount,
        untranscribed: untranscribed.length,
        lastError: this.lastError,
      });
    }
  }
}
