/**
 * Transcription Service
 * Handles audio transcription via Cloudflare Worker with Whisper AI
 */

export class TranscriptionService {
  constructor(workerUrl) {
    this.workerUrl = workerUrl || import.meta.env.VITE_TRANSCRIPTION_WORKER_URL;

    if (!this.workerUrl) {
      console.warn('Transcription Worker URL not configured. Transcription will be disabled.');
    }
  }

  /**
   * Check if transcription service is available
   */
  isAvailable() {
    return !!this.workerUrl;
  }

  /**
   * Transcribe audio blob to text
   * @param {Blob} audioBlob - Audio blob to transcribe
   * @param {Object} options - Transcription options
   * @returns {Promise<Object>} - Transcription result
   */
  async transcribe(audioBlob, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('Transcription service not configured');
    }

    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('No audio data to transcribe');
    }

    // Check blob size (25MB limit on Worker)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (audioBlob.size > maxSize) {
      throw new Error(`Audio file too large: ${(audioBlob.size / 1024 / 1024).toFixed(2)}MB (max: 25MB)`);
    }

    try {
      console.log(`[Transcription] Sending ${audioBlob.size} bytes to Worker...`);

      const startTime = Date.now();

      // Send audio to Cloudflare Worker
      const response = await fetch(`${this.workerUrl}/transcribe`, {
        method: 'POST',
        body: audioBlob,
        headers: {
          'Content-Type': audioBlob.type || 'audio/webm',
        },
        // Add timeout for long transcriptions
        signal: options.signal || AbortSignal.timeout(60000), // 60 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || `Transcription failed: ${response.status}`
        );
      }

      const result = await response.json();
      const totalTime = Date.now() - startTime;

      console.log(
        `[Transcription] Success in ${totalTime}ms:`,
        result.text?.substring(0, 100) + (result.text?.length > 100 ? '...' : '')
      );

      return {
        text: result.text || '',
        timestamp: result.timestamp || new Date().toISOString(),
        processingTime: result.processingTime || 0,
        totalTime: totalTime,
        audioSize: result.audioSize || audioBlob.size,
        vtt: result.vtt || null,
        words: result.words || null,
        success: true,
      };
    } catch (error) {
      console.error('[Transcription] Error:', error);

      // Provide user-friendly error messages
      let userMessage = 'Transcription failed';

      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        userMessage = 'Transcription timed out. Audio might be too long.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        userMessage = 'Network error. Check your internet connection.';
      } else if (error.message.includes('too large')) {
        userMessage = error.message;
      }

      throw {
        error: userMessage,
        originalError: error.message,
        success: false,
      };
    }
  }

  /**
   * Transcribe with retry logic
   * @param {Blob} audioBlob - Audio blob to transcribe
   * @param {Number} maxRetries - Maximum retry attempts
   * @returns {Promise<Object>} - Transcription result
   */
  async transcribeWithRetry(audioBlob, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Transcription] Attempt ${attempt}/${maxRetries}`);
        return await this.transcribe(audioBlob);
      } catch (error) {
        lastError = error;

        // Don't retry on certain errors
        if (error.message?.includes('too large') ||
            error.message?.includes('not configured')) {
          throw error;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Max 10s
          console.log(`[Transcription] Retry in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Batch transcribe multiple audio blobs
   * @param {Array<Blob>} audioBlobs - Array of audio blobs
   * @param {Function} onProgress - Progress callback (current, total, result)
   * @returns {Promise<Array<Object>>} - Array of transcription results
   */
  async transcribeBatch(audioBlobs, onProgress = null) {
    const results = [];

    for (let i = 0; i < audioBlobs.length; i++) {
      try {
        const result = await this.transcribeWithRetry(audioBlobs[i]);
        results.push(result);

        if (onProgress) {
          onProgress(i + 1, audioBlobs.length, result);
        }
      } catch (error) {
        console.error(`[Transcription] Batch item ${i} failed:`, error);
        results.push({
          success: false,
          error: error.message || 'Transcription failed',
          index: i,
        });

        if (onProgress) {
          onProgress(i + 1, audioBlobs.length, { success: false, error: error.message });
        }
      }
    }

    return results;
  }

  /**
   * Test connection to transcription service
   * @returns {Promise<Boolean>} - True if service is reachable
   */
  async testConnection() {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      // Create a small silent audio blob for testing
      const silentAudio = this.createSilentAudioBlob(100); // 100ms of silence

      const response = await fetch(`${this.workerUrl}/transcribe`, {
        method: 'POST',
        body: silentAudio,
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      return response.ok;
    } catch (error) {
      console.warn('[Transcription] Connection test failed:', error);
      return false;
    }
  }

  /**
   * Create a silent audio blob for testing
   * @param {Number} durationMs - Duration in milliseconds
   * @returns {Blob} - Silent audio blob
   */
  createSilentAudioBlob(durationMs = 100) {
    // Create a minimal WebM audio file with silence
    // This is a simplified version - in production, use a real silent audio file
    const sampleRate = 8000;
    const numSamples = Math.floor(sampleRate * durationMs / 1000);
    const audioData = new Float32Array(numSamples).fill(0);

    // Convert to 16-bit PCM
    const pcmData = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      pcmData[i] = audioData[i] * 0x7FFF;
    }

    return new Blob([pcmData.buffer], { type: 'audio/webm' });
  }

  /**
   * Get estimated cost for transcription
   * @param {Number} audioSizeBytes - Audio file size in bytes
   * @returns {Object} - Cost estimation
   */
  getEstimatedCost(audioSizeBytes) {
    // Rough estimation:
    // - WebM is ~1KB per second of audio (varies by quality)
    // - Whisper uses ~1 neuron per second
    // - Free tier: 10,000 neurons/day
    // - Paid: $0.011 per 1,000 neurons

    const estimatedDurationSeconds = audioSizeBytes / 1024; // Rough estimate
    const neuronsNeeded = Math.ceil(estimatedDurationSeconds);
    const cost = neuronsNeeded * 0.000011; // $0.011 per 1000 neurons

    return {
      estimatedDurationSeconds: Math.round(estimatedDurationSeconds),
      neuronsNeeded: neuronsNeeded,
      estimatedCostUSD: cost.toFixed(6),
      withinFreeTier: neuronsNeeded <= 10000,
    };
  }
}

export default TranscriptionService;
