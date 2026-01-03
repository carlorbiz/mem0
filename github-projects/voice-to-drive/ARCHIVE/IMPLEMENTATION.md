# Implementation Guide

## Prerequisites

### Development Environment
- Node.js (v18+)
- npm or yarn
- Code editor (VS Code recommended)
- Git for version control
- Modern browser for testing (Chrome/Edge/Safari)

### Google Cloud Setup
Before starting development, you need:

1. **Create Google Cloud Project**
   - Go to: https://console.cloud.google.com/
   - Create new project: "Voice-to-Drive-Recorder"
   - Enable Google Drive API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized JavaScript origins
   - Download credentials JSON

2. **OAuth Configuration**
   - Scopes needed: `https://www.googleapis.com/auth/drive.file`
   - This limits access to only files created by the app

### Testing Device
- Spare smartphone or tablet
- Car mount
- USB car charger
- Active internet connection

## Phase 1: MVP Implementation

### Step 1: Project Setup

```bash
# Create project directory
mkdir voice-to-drive-pwa
cd voice-to-drive-pwa

# Initialize project
npm init -y

# Install core dependencies
npm install react react-dom
npm install @ricky0123/vad-web
npm install idb  # IndexedDB wrapper
npm install gapi-script  # Google API client

# Install dev dependencies
npm install -D vite
npm install -D @vitejs/plugin-react
npm install -D workbox-cli  # For service worker
```

### Step 2: Project Structure

```
voice-to-drive-pwa/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icon-192.png          # App icons
│   ├── icon-512.png
│   └── sw.js                 # Service Worker
├── src/
│   ├── components/
│   │   ├── SessionControl.jsx    # Start/Stop UI
│   │   ├── StatusIndicator.jsx   # Recording/Upload status
│   │   ├── AudioLevel.jsx        # Visual feedback
│   │   └── Settings.jsx          # Configuration
│   ├── services/
│   │   ├── vad.js               # Voice Activity Detection
│   │   ├── recorder.js          # Audio recording logic
│   │   ├── storage.js           # IndexedDB operations
│   │   ├── driveApi.js          # Google Drive integration
│   │   └── syncManager.js       # Upload queue management
│   ├── hooks/
│   │   ├── useVAD.js            # VAD React hook
│   │   ├── useRecorder.js       # Recording hook
│   │   └── useSync.js           # Sync status hook
│   ├── utils/
│   │   ├── dateUtils.js         # Folder path generation
│   │   └── audioUtils.js        # Audio format helpers
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── vite.config.js
├── package.json
└── README.md
```

### Step 3: Core Components Implementation

#### 3.1 Voice Activity Detection Service

**File: `src/services/vad.js`**

```javascript
import { MicVAD } from '@ricky0123/vad-web';

export class VADService {
  constructor() {
    this.vad = null;
    this.isInitialized = false;
    this.onSpeechStart = null;
    this.onSpeechEnd = null;
  }

  async initialize(callbacks) {
    this.onSpeechStart = callbacks.onSpeechStart;
    this.onSpeechEnd = callbacks.onSpeechEnd;

    this.vad = await MicVAD.new({
      onSpeechStart: () => {
        console.log('Speech detected');
        this.onSpeechStart?.();
      },
      onSpeechEnd: () => {
        console.log('Speech ended');
        this.onSpeechEnd?.();
      },
      positiveSpeechThreshold: 0.8,  // Tunable for car noise
      minSpeechFrames: 3,
      redemptionFrames: 8,  // How long to wait before considering silence
    });

    this.isInitialized = true;
  }

  start() {
    if (this.vad) {
      this.vad.start();
    }
  }

  pause() {
    if (this.vad) {
      this.vad.pause();
    }
  }

  destroy() {
    if (this.vad) {
      this.vad.destroy();
      this.vad = null;
      this.isInitialized = false;
    }
  }
}
```

#### 3.2 Audio Recorder Service

**File: `src/services/recorder.js`**

```javascript
export class AudioRecorderService {
  constructor() {
    this.mediaRecorder = null;
    this.stream = null;
    this.chunks = [];
    this.isRecording = false;
  }

  async initialize() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
  }

  startRecording() {
    if (!this.stream) {
      throw new Error('Microphone not initialized');
    }

    this.chunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm;codecs=opus',  // Good compression
      audioBitsPerSecond: 64000  // 64kbps is good quality for speech
    });

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    console.log('Recording started');
  }

  async stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.chunks = [];
        this.isRecording = false;
        console.log('Recording stopped, blob size:', blob.size);
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }

  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }
}
```

#### 3.3 Storage Service (IndexedDB)

**File: `src/services/storage.js`**

```javascript
import { openDB } from 'idb';

const DB_NAME = 'voice-recordings';
const STORE_NAME = 'recordings';
const DB_VERSION = 1;

export class StorageService {
  constructor() {
    this.db = null;
  }

  async initialize() {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { 
            keyPath: 'id',
            autoIncrement: true 
          });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('synced', 'synced');
        }
      },
    });
  }

  async saveRecording(blob, metadata) {
    const recording = {
      blob,
      timestamp: new Date().toISOString(),
      synced: false,
      fileName: metadata.fileName,
      drivePath: metadata.drivePath,
      retryCount: 0,
      ...metadata
    };

    const id = await this.db.add(STORE_NAME, recording);
    console.log('Recording saved to IndexedDB, id:', id);
    return id;
  }

  async getUnsyncedRecordings() {
    return await this.db.getAllFromIndex(STORE_NAME, 'synced', 0);
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
}
```

#### 3.4 Google Drive API Service

**File: `src/services/driveApi.js`**

```javascript
export class DriveApiService {
  constructor() {
    this.accessToken = null;
    this.isInitialized = false;
  }

  async initialize(clientId, apiKey) {
    return new Promise((resolve) => {
      gapi.load('client:auth2', async () => {
        await gapi.client.init({
          apiKey: apiKey,
          clientId: clientId,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: 'https://www.googleapis.com/auth/drive.file'
        });
        
        this.isInitialized = true;
        resolve();
      });
    });
  }

  async signIn() {
    const auth = gapi.auth2.getAuthInstance();
    await auth.signIn();
    this.accessToken = auth.currentUser.get().getAuthResponse().access_token;
  }

  async ensureFolderPath(year, month, day) {
    // Create folder structure: recordings/YYYY/MM/DD
    const rootName = 'recordings';
    
    let rootId = await this.findOrCreateFolder(rootName, null);
    let yearId = await this.findOrCreateFolder(year, rootId);
    let monthId = await this.findOrCreateFolder(month, yearId);
    let dayId = await this.findOrCreateFolder(day, monthId);
    
    return dayId;
  }

  async findOrCreateFolder(name, parentId) {
    // Search for existing folder
    let query = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    if (parentId) {
      query += ` and '${parentId}' in parents`;
    }

    const response = await gapi.client.drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    if (response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    // Create folder if not found
    const folderMetadata = {
      name: name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    };

    const folder = await gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });

    return folder.result.id;
  }

  async uploadFile(blob, fileName, folderId) {
    const metadata = {
      name: fileName,
      parents: [folderId]
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', blob);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  }
}
```

#### 3.5 Sync Manager Service

**File: `src/services/syncManager.js`**

```javascript
export class SyncManager {
  constructor(storageService, driveService) {
    this.storage = storageService;
    this.drive = driveService;
    this.isSyncing = false;
    this.syncQueue = [];
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

    try {
      const unsyncedRecordings = await this.storage.getUnsyncedRecordings();
      console.log(`Found ${unsyncedRecordings.length} recordings to sync`);

      for (const recording of unsyncedRecordings) {
        try {
          await this.syncRecording(recording);
        } catch (error) {
          console.error(`Failed to sync recording ${recording.id}:`, error);
          await this.storage.incrementRetryCount(recording.id);
          
          // Give up after 5 retries
          if (recording.retryCount >= 5) {
            console.error(`Recording ${recording.id} failed after 5 retries, keeping in queue`);
          }
        }
      }
    } finally {
      this.isSyncing = false;
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

    // Generate filename
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
    const fileName = `${year}-${month}-${day}_${timeStr}.webm`;

    // Upload file
    await this.drive.uploadFile(recording.blob, fileName, folderId);

    // Mark as synced and delete from local storage
    await this.storage.markAsSynced(recording.id);
    await this.storage.deleteRecording(recording.id);

    console.log(`Successfully synced recording ${recording.id} as ${fileName}`);
  }

  startAutoSync(intervalMs = 30000) {
    // Auto-sync every 30 seconds
    this.syncInterval = setInterval(() => {
      this.syncAll();
    }, intervalMs);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}
```

### Step 4: React Components

#### 4.1 Main App Component

**File: `src/App.jsx`**

```javascript
import { useState, useEffect } from 'react';
import SessionControl from './components/SessionControl';
import StatusIndicator from './components/StatusIndicator';
import { VADService } from './services/vad';
import { AudioRecorderService } from './services/recorder';
import { StorageService } from './services/storage';
import { DriveApiService } from './services/driveApi';
import { SyncManager } from './services/syncManager';

function App() {
  const [sessionActive, setSessionActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ pending: 0, syncing: false });
  
  // Services (initialize once)
  const [services, setServices] = useState(null);

  useEffect(() => {
    initializeServices();
  }, []);

  async function initializeServices() {
    const vad = new VADService();
    const recorder = new AudioRecorderService();
    const storage = new StorageService();
    const drive = new DriveApiService();

    await storage.initialize();
    await recorder.initialize();
    
    // Initialize Google Drive (use your credentials)
    await drive.initialize(
      'YOUR_CLIENT_ID',
      'YOUR_API_KEY'
    );
    
    await drive.signIn();

    const syncManager = new SyncManager(storage, drive);
    
    setServices({ vad, recorder, storage, drive, syncManager });
  }

  async function startSession() {
    if (!services) return;

    const { vad, recorder, storage, syncManager } = services;

    // Initialize VAD with callbacks
    await vad.initialize({
      onSpeechStart: async () => {
        setIsRecording(true);
        recorder.startRecording();
      },
      onSpeechEnd: async () => {
        const blob = await recorder.stopRecording();
        if (blob) {
          await storage.saveRecording(blob, {});
          // Trigger sync
          syncManager.syncAll();
        }
        setIsRecording(false);
      }
    });

    vad.start();
    syncManager.startAutoSync();
    setSessionActive(true);
  }

  function endSession() {
    if (!services) return;

    const { vad, recorder, syncManager } = services;
    
    vad.pause();
    if (recorder.isRecording) {
      recorder.stopRecording();
    }
    syncManager.stopAutoSync();
    setSessionActive(false);
    setIsRecording(false);
  }

  return (
    <div className="app">
      <h1>Voice to Drive</h1>
      
      <SessionControl 
        active={sessionActive}
        onStart={startSession}
        onEnd={endSession}
      />
      
      <StatusIndicator 
        recording={isRecording}
        syncStatus={syncStatus}
      />
    </div>
  );
}

export default App;
```

#### 4.2 Session Control Component

**File: `src/components/SessionControl.jsx`**

```javascript
function SessionControl({ active, onStart, onEnd }) {
  return (
    <div className="session-control">
      {!active ? (
        <button onClick={onStart} className="btn-start">
          Start Session
        </button>
      ) : (
        <button onClick={onEnd} className="btn-end">
          End Session
        </button>
      )}
    </div>
  );
}

export default SessionControl;
```

#### 4.3 Status Indicator Component

**File: `src/components/StatusIndicator.jsx`**

```javascript
function StatusIndicator({ recording, syncStatus }) {
  return (
    <div className="status-indicator">
      <div className={`recording-status ${recording ? 'active' : ''}`}>
        {recording ? '🔴 Recording...' : '⏸️ Listening'}
      </div>
      
      <div className="sync-status">
        {syncStatus.syncing && '☁️ Syncing...'}
        {syncStatus.pending > 0 && `📦 ${syncStatus.pending} pending`}
        {!syncStatus.syncing && syncStatus.pending === 0 && '✓ All synced'}
      </div>
      
      <div className="network-status">
        {navigator.onLine ? '🌐 Online' : '📡 Offline'}
      </div>
    </div>
  );
}

export default StatusIndicator;
```

### Step 5: PWA Configuration

#### 5.1 Manifest File

**File: `public/manifest.json`**

```json
{
  "name": "Voice to Drive Recorder",
  "short_name": "Voice2Drive",
  "description": "Hands-free voice recording with auto-upload to Google Drive",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4285f4",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "permissions": ["microphone", "storage"]
}
```

#### 5.2 Service Worker

**File: `public/sw.js`**

```javascript
const CACHE_NAME = 'voice-to-drive-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

## Phase 2: Testing & Refinement

### Local Testing
```bash
npm run dev
```

### Device Testing Steps
1. Build for production: `npm run build`
2. Serve over HTTPS (required for PWA)
3. Open on test device
4. Install PWA to home screen
5. Mount device in car
6. Test full recording session
7. Verify uploads to Google Drive

### Test Cases
- [ ] Session start/end
- [ ] VAD triggers recording on speech
- [ ] Recording saves locally
- [ ] Auto-sync when online
- [ ] Offline queue management
- [ ] Call interruption handling
- [ ] Low battery warning
- [ ] Storage quota monitoring

## Phase 3: Deployment

### Option 1: Self-Hosted
- Deploy to your own web server
- Ensure HTTPS is enabled
- Configure CORS for Google Drive API

### Option 2: Static Hosting
- Netlify / Vercel / GitHub Pages
- All support PWA requirements
- Free tier available

### Option 3: Local Network
- Run on local server
- Access via IP address over HTTPS
- Good for testing before public deployment

## Troubleshooting

### Common Issues

**Microphone not working:**
- Check browser permissions
- Ensure HTTPS (required for getUserMedia)
- Test with different browsers

**VAD not detecting speech:**
- Adjust `positiveSpeechThreshold` in vad.js
- Test in actual car environment (road noise)
- Consider manual recording fallback

**Google Drive upload fails:**
- Check OAuth credentials
- Verify API is enabled in Cloud Console
- Check network connectivity
- Review browser console for errors

**IndexedDB quota exceeded:**
- Clear old synced recordings
- Reduce audio quality (lower bitrate)
- Implement more aggressive cleanup

## Next Steps After MVP

1. **Add UI polish** - Better styling, animations
2. **Settings page** - Configure VAD sensitivity, audio quality
3. **Manual controls** - Fallback for when VAD doesn't work
4. **Statistics** - Show total recordings, storage used
5. **Export options** - Download recordings locally if needed

## Resources

- MDN Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Google Drive API Docs: https://developers.google.com/drive/api/guides/about-sdk
- PWA Documentation: https://web.dev/progressive-web-apps/
- VAD Library: https://github.com/ricky0123/vad

## Support & Continuation

When continuing this project in a new chat:
1. Share these documentation files (README, STRATEGY, IMPLEMENTATION)
2. Mention current progress / what's already built
3. Describe specific issues or next features needed

This ensures context continuity across chat sessions.
