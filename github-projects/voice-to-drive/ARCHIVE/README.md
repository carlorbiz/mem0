# Voice to Drive - Voice Recording PWA

**Status:** ✅ Production Ready | **Version:** 2.0 (Whisper AI) | **Last Updated:** January 17, 2025

A hands-free Progressive Web App (PWA) for recording voice notes while driving, with automatic AI transcription via Cloudflare Workers AI (Whisper).

**🌐 Live App:** https://voice-to-drive.pages.dev

---

## 🎯 What It Does

Voice to Drive is a hands-free voice recording app designed for safe use while driving:

- **Auto-Records When You Speak** - VAD (Voice Activity Detection) starts recording automatically
- **AI Transcription** - Whisper AI transcribes your voice notes in real-time
- **Offline-First** - Records without internet, syncs when back online
- **One-Tap Export** - Download all recordings to your device
- **PWA Install** - Works like a native app on your phone

Perfect for capturing thoughts, ideas, and notes during long drives.

---

## ✨ Key Features

### Phase 1: Basic Recording ✅ (Complete)
- Voice Activity Detection (VAD)
- Hands-free auto-recording
- Google Drive integration
- Offline support with IndexedDB
- Session mode (record multiple notes in one drive)

### Phase 2: AI Transcription ✅ (Complete)
- **Cloudflare Workers AI** integration
- **Whisper-large-v3-turbo** model
- Real-time transcription (when online)
- Offline queueing (transcribes when reconnected)
- Transcript export as .txt files

### Current Features
- **Always-Visible Control Panel** - Monitor recordings in real-time
- **Manual Export** - One-tap download to device
- **Safe Data Handling** - Recordings never deleted until you confirm export
- **Mobile-Optimized** - Large buttons, clear status indicators
- **Persistent Storage** - Recordings survive app restart and page refresh

---

## 🚀 Quick Start

### For Users

**1. Install the PWA (One-Time Setup)**

**On iPhone (Safari):**
1. Visit: https://voice-to-drive.pages.dev
2. Tap **Share** → **Add to Home Screen**
3. Name it "Voice Notes" and tap **Add**

**On Android (Chrome):**
1. Visit: https://voice-to-drive.pages.dev
2. Tap the **Install** banner or **Menu** → **Install app**
3. Tap **Install**

**2. First-Time Authentication**
- Grant microphone permission
- Sign in with Google Drive (optional - for auto-upload)

**3. Start Recording**
- Open the PWA from your home screen
- Tap **"Start Session"**
- Talk naturally - recording starts automatically when you speak
- Tap **"End Session"** when done

**4. Export Your Recordings**
- Check the control panel in the bottom-right corner
- Tap **💾 Export All** to download recordings
- Files save to your Downloads folder
- Tap **🗑️ Clear DB** after verifying export

### For Developers

**Prerequisites:**
- Node.js 18+
- npm or yarn
- Cloudflare account (for deployment)

**Local Development:**
```bash
# Clone repository
git clone https://github.com/yourusername/voice-to-drive.git
cd voice-to-drive

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Start dev server
npm run dev

# Open http://localhost:5173
```

**Build for Production:**
```bash
npm run build
```

**Deploy to Cloudflare Pages:**
```bash
# Install wrangler (if not already)
npm install -g wrangler

# Deploy
wrangler pages deploy dist --project-name=voice-to-drive
```

---

## 📱 Control Panel

The app features an always-visible control panel in the bottom-right corner:

```
DB Total: 0          ← Total recordings in database
This Session: 0      ← Recordings captured this session
Pending: 0           ← Recordings not yet uploaded to Drive

[🔍 Inspect DB]      ← Show database details in console
[💾 Export All]      ← Download all recordings to device
[🗑️ Clear DB]        ← Delete recordings after verifying export
```

This panel is always visible and works on both mobile and desktop.

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + Vite
- **Audio:** MediaRecorder API (webm codec)
- **VAD:** @ricky0123/vad-web (ONNX Runtime)
- **Storage:** IndexedDB via idb library
- **Transcription:** Cloudflare Workers AI (Whisper-large-v3-turbo)
- **Cloud Storage:** Google Drive API (optional)
- **Hosting:** Cloudflare Pages
- **PWA:** Service Worker + Web App Manifest

### Data Flow
```
Voice Input
    ↓
VAD Detection (Speech/Silence Detection)
    ↓
Audio Recording (MediaRecorder → webm blob)
    ↓
IndexedDB Storage (Immediate Save)
    ↓
Background Tasks (Async):
    ├─→ Transcription (Cloudflare Workers AI → Whisper)
    │       ↓
    │   Update IndexedDB with transcript text
    └─→ Google Drive Upload (Best-effort, not guaranteed)
    ↓
User-Initiated Export (Download to device)
```

### File Structure
```
voice-to-drive/
├── src/
│   ├── App.jsx                    # Main app + control panel
│   ├── services/
│   │   ├── vad.js                 # Voice activity detection
│   │   ├── recorder.js            # Audio recording service
│   │   ├── storage.js             # IndexedDB operations
│   │   ├── syncManager.js         # Sync orchestration
│   │   ├── driveApi.js            # Google Drive integration
│   │   └── transcription.js       # Whisper AI client
│   └── components/
│       ├── SessionControl.jsx     # Start/End session UI
│       └── StatusIndicator.jsx    # Recording status display
├── workers/
│   ├── transcribe-audio.js        # Cloudflare Worker (Whisper)
│   └── wrangler.toml              # Worker configuration
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker
│   └── vad/                       # VAD WASM files
├── PHASE2_DEPLOYMENT.md           # Whisper integration docs
├── MOBILE_READY_GUIDE.md          # Mobile user guide
└── SUPABASE_MIGRATION_PLAN.md     # Future migration strategy
```

---

## 🎓 User Guide

### Daily Workflow
1. **Open App** - Launch PWA from home screen
2. **Start Session** - Tap "Start Session" button
3. **Talk Naturally** - Speak your thoughts (auto-records when you talk)
4. **End Session** - Tap "End Session" when done
5. **Export** - Tap "💾 Export All" in control panel
6. **Verify** - Check Downloads folder for .webm and .txt files
7. **Clear** - Tap "🗑️ Clear DB" to free up space

### Exported Files
```
Downloads/
├── 2025-01-17_08-30-15.webm  # Audio recording
├── 2025-01-17_08-30-15.txt   # AI transcript
├── 2025-01-17_08-45-42.webm
├── 2025-01-17_08-45-42.txt
└── ...
```

### Tips for Best Results
- **Speak clearly** - Normal conversational volume works best
- **Pause between thoughts** - Let VAD auto-stop between recordings
- **Check control panel** - Monitor "This Session" count to confirm recording
- **Export regularly** - Don't let too many recordings accumulate
- **Verify exports** - Check Downloads folder before clearing database

---

## 🔧 Configuration

### Environment Variables

**Local Development (.env):**
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_API_KEY=your-google-api-key
VITE_TRANSCRIPTION_WORKER_URL=https://voice-transcribe.your-account.workers.dev
```

**Production (Cloudflare Pages):**
Set these in the Cloudflare Pages dashboard under **Settings → Environment variables**

### Google OAuth Setup
1. Create project in Google Cloud Console
2. Enable Google Drive API
3. Create OAuth 2.0 credentials
4. Add authorized JavaScript origins and redirect URIs
5. Copy Client ID and API Key to environment variables

### Cloudflare Workers AI Setup
1. Deploy the Whisper transcription worker:
   ```bash
   cd workers
   wrangler deploy
   ```
2. Copy the worker URL to `VITE_TRANSCRIPTION_WORKER_URL`

---

## 📊 Current Limitations

### Known Issues
1. **Google Drive Upload Unreliable** - OAuth token expires, uploads may fail silently
   - **Workaround:** Use manual export instead of relying on auto-upload
2. **Browser-Specific Storage** - Recordings only accessible in the same browser
   - **Workaround:** Export regularly, don't switch browsers
3. **No Cloud Sync** - Can't access recordings from different devices
   - **Future Fix:** Supabase migration (see SUPABASE_MIGRATION_PLAN.md)
4. **Manual Export Required** - Must remember to export after sessions
   - **Current Design:** Always-visible control panel helps remind users

### Browser Compatibility
- ✅ Chrome/Edge (Desktop + Mobile)
- ✅ Safari (iOS + macOS)
- ✅ Firefox (Desktop + Mobile)
- ❌ IE11 (not supported)

### Device Requirements
- Modern smartphone (2018+)
- Microphone access
- ~100MB free storage (for VAD WASM files)
- Internet connection (for transcription, optional for recording)

---

## 🚀 Roadmap

### Completed ✅
- [x] Phase 1: Basic voice recording with VAD
- [x] Google Drive integration
- [x] Offline support with IndexedDB
- [x] PWA installation
- [x] Phase 2: Whisper AI transcription
- [x] Always-visible export controls
- [x] Database schema fixes
- [x] Production deployment

### Next Up (Q1 2025)
- [ ] **Supabase Migration** - Multi-device sync, cloud storage
- [ ] Full-text search across transcripts
- [ ] Team workspaces and sharing
- [ ] Integration with Notion, Airtable, n8n

### Future Enhancements
- [ ] Speaker diarization (identify multiple speakers)
- [ ] AI-powered summarization
- [ ] Automatic action item extraction
- [ ] Voice commands ("save as task", "add to calendar")
- [ ] Custom vocabulary for industry-specific terms
- [ ] API access for developers

---

## 💰 Pricing & Costs

### Current Costs (Cloudflare Stack)
- **Cloudflare Pages:** Free
- **Cloudflare Workers AI:** ~$1-4/month (mostly free tier)
- **Google Drive API:** Free
- **Total:** ~$1-4/month

### Free Tier Limits
- **Workers AI:** 10,000 neurons/day
  - ~2.7 hours of transcription per day FREE
  - Typical 30-second clip = $0.00033
- **Cloudflare Pages:** Unlimited static hosting
- **Google Drive:** 15 GB free storage

### Future Pricing (Post-Supabase)
- **Free Tier:** 100 recordings/month, 1 hour storage
- **Pro ($9/mo):** Unlimited recordings, 10 GB storage, team sharing
- **Team ($29/mo):** Multiple users, API access, integrations
- **Enterprise:** Custom pricing, SSO, white-label

---

## 🐛 Troubleshooting

### App Not Recording
1. Check microphone permission in browser settings
2. Verify VAD is initialized (check console for errors)
3. Speak louder/clearer (VAD sensitivity)
4. Try refreshing the page

### Recordings Not Appearing
1. Click "🔍 Inspect DB" to see actual database count
2. Check browser console for errors
3. Verify recordings saved: Browser DevTools → Application → IndexedDB → voice-recordings

### Export Not Working
1. Allow browser to download multiple files when prompted
2. Check browser's download settings
3. Try exporting smaller batches (clear DB after each export)
4. Check Downloads folder location in browser settings

### Transcription Not Working
1. Verify you're online (transcription requires internet)
2. Check `VITE_TRANSCRIPTION_WORKER_URL` is set correctly
3. Test Worker directly: visit Worker URL in browser
4. Check Cloudflare dashboard for Worker errors

---

## 📚 Documentation

- **[PROJECT_STATUS_2025-01-17.md](PROJECT_STATUS_2025-01-17.md)** - Current project status and technical details
- **[MOBILE_READY_GUIDE.md](MOBILE_READY_GUIDE.md)** - Complete guide for mobile usage
- **[PHASE2_DEPLOYMENT.md](PHASE2_DEPLOYMENT.md)** - Whisper AI integration documentation
- **[SUPABASE_MIGRATION_PLAN.md](SUPABASE_MIGRATION_PLAN.md)** - Future cloud sync migration plan
- **[EMERGENCY_EXPORT.md](EMERGENCY_EXPORT.md)** - Console-based export script
- **[RECOVERY_SCRIPT.md](RECOVERY_SCRIPT.md)** - Data recovery procedures

---

## 🤝 Contributing

This is currently a personal project, but contributions are welcome!

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly on mobile and desktop
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- Use ESLint + Prettier for formatting
- Write meaningful commit messages
- Test on real mobile devices (not just emulators)
- Update documentation for new features

---

## 📜 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- **@ricky0123/vad-web** - Excellent VAD implementation
- **Cloudflare Workers AI** - Fast and affordable Whisper hosting
- **idb Library** - Simplified IndexedDB wrapper
- **React + Vite** - Modern development experience

---

## 📞 Support

For issues, questions, or feedback:
- **Email:** (your-email@example.com)
- **GitHub Issues:** (when public repo created)
- **Documentation:** See docs listed above

---

## 🎯 Project Goals

### Primary Goals (Achieved ✅)
1. Safe, hands-free voice recording while driving
2. Reliable local storage (no data loss)
3. AI transcription for searchability
4. Simple, mobile-friendly interface

### Secondary Goals (In Progress)
1. Multi-device sync (via Supabase migration)
2. Team collaboration features
3. Advanced search and filtering
4. Integration ecosystem (Notion, n8n, etc.)

### Long-Term Vision
Build a complete voice-first productivity platform that:
- Captures thoughts anytime, anywhere
- Transcribes and organizes automatically
- Extracts actionable insights with AI
- Integrates seamlessly with existing workflows
- Scales from individual use to enterprise teams

---

**Built with ❤️ for safe, hands-free productivity on the road**

**Version:** 2.0 (Whisper AI) | **Status:** Production Ready | **Updated:** January 17, 2025
