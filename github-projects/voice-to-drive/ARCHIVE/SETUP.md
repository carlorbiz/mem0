# Voice to Drive - Setup Guide

## 🚀 Quick Start

### 1. Google Cloud Setup (Required)

Before running the app, you need to set up Google Drive API access:

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select existing project
3. Name it "Voice to Drive" (or whatever you prefer)

#### Step 2: Enable Google Drive API
1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google Drive API"
3. Click "Enable"

#### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: Voice to Drive
   - User support email: your email
   - Developer contact: your email
   - Scopes: Add `https://www.googleapis.com/auth/drive.file`
   - Test users: Add your Google account email
4. Application type: "Web application"
5. Authorized JavaScript origins: `http://localhost:3000` (for development)
6. Copy the **Client ID** that's generated

#### Step 4: Create API Key
1. Still in "Credentials", click "Create Credentials" > "API key"
2. Copy the **API Key** that's generated
3. (Optional) Restrict the key to Google Drive API only

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-api-key-here
```

**⚠️ IMPORTANT**: Never commit your `.env` file to git! It's already in `.gitignore` to prevent accidental commits.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 5. Test the App

1. Click "Start Session" - you'll be prompted to sign in with Google
2. Grant permissions for Drive access
3. Speak into your microphone - watch the "Recording" indicator
4. Stop speaking - the recording saves automatically
5. Check your Google Drive at `recordings/YYYY/MM/DD/` for the audio files

## 📱 Deploy to Dedicated Device

### For Testing (Local Network)

1. Build the production version:
```bash
npm run build
```

2. Serve over HTTPS (required for microphone access):
```bash
# Install a local HTTPS server
npm install -g http-server

# Serve with HTTPS
http-server dist -p 8080 -S -C cert.pem -K key.pem
```

3. Find your computer's local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` (look for inet)

4. On your phone/tablet, navigate to: `https://YOUR_IP:8080`

5. Accept the self-signed certificate warning

6. Add to home screen (PWA install)

### For Production (Public Hosting)

Deploy to any static hosting service that supports HTTPS:

**Option 1: Netlify**
```bash
npm run build
# Drag the 'dist' folder to Netlify drop zone
```

**Option 2: Vercel**
```bash
npm run build
npx vercel --prod
```

**Option 3: GitHub Pages**
```bash
npm run build
# Push 'dist' folder to gh-pages branch
```

## 🔧 Configuration Options

### Adjust VAD Sensitivity

If the app is too sensitive or not sensitive enough to your voice, edit `src/services/vad.js`:

```javascript
positiveSpeechThreshold: 0.8,  // Lower = more sensitive (0.5-0.9)
minSpeechFrames: 3,            // Minimum frames before considering speech
redemptionFrames: 8,           // How long to wait before ending (higher = more forgiving)
```

### Change Audio Quality

Edit `src/services/recorder.js`:

```javascript
audioBitsPerSecond: 64000  // 32000 = lower quality/size, 128000 = higher quality/size
```

### Change Sync Interval

Edit `src/App.jsx`:

```javascript
syncManager.startAutoSync(30000);  // Change 30000 (30s) to your preferred interval in ms
```

## 🛠️ Troubleshooting

### "Microphone access denied"
- Check browser permissions
- Ensure you're using HTTPS (required for getUserMedia)
- Try a different browser

### "Google Drive sign-in failed"
- Verify your Client ID and API Key are correct
- Check that your email is added as a test user in OAuth consent screen
- Make sure Drive API is enabled in your Google Cloud project

### VAD not detecting speech
- Test in a quiet environment first
- Adjust `positiveSpeechThreshold` in vad.js
- Check browser console for errors
- Ensure microphone is working (test with other apps)

### Recordings not uploading
- Check internet connection
- Look for pending recordings in the status indicator
- Check browser console for upload errors
- Verify Drive API quotas haven't been exceeded

### App not working offline
- Service Worker might not be registered
- Check browser console for SW errors
- Try building for production: `npm run build` then `npm run preview`

## 📋 Next Steps

### Recommended Improvements

1. **Add Settings Page**
   - VAD sensitivity slider
   - Audio quality selector
   - Sync frequency options
   - Manual sync button

2. **Better Error Handling**
   - Retry failed uploads with exponential backoff
   - Show detailed error messages
   - Add error reporting

3. **Analytics**
   - Track total recordings
   - Show storage used
   - Display sync statistics

4. **Transcription Integration**
   - Add Whisper API for transcription
   - Or set up n8n workflow to watch Drive folder
   - Store transcripts alongside audio files

## 🤝 Support

For issues or questions:
1. Check TROUBLESHOOTING section above
2. Review browser console for error messages
3. Check that all prerequisites are met
4. Verify Google Cloud project is set up correctly

## 📄 File Structure

```
voice-to-drive/
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── icon-*.png        # App icons (add these!)
├── src/
│   ├── components/       # React components
│   ├── services/         # Core services (VAD, recorder, storage, etc.)
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 Usage Tips

### For Best Results:

1. **Mount device properly** - Use a secure car mount at eye level
2. **Keep plugged in** - Screen stays on, so battery drains quickly
3. **Test sensitivity** - Adjust VAD settings for your car's noise level
4. **Use WiFi first** - Initial uploads better over WiFi than cellular
5. **Regular sync** - Don't let too many recordings pile up offline

### Safety First:

- Set up before driving
- Don't interact with the screen while moving
- Voice operation only while driving
- End session when parked

## 📦 What Gets Created

When you record, the app creates:
- Local recording in IndexedDB (temporary)
- File in Google Drive: `recordings/2025/11/13/14-30-45.webm`
- Organized by date automatically

Future additions:
- Transcripts: `recordings/2025/11/13/14-30-45.txt`
- Metadata: `recordings/2025/11/13/14-30-45.json`

Happy recording! 🚗🎙️
