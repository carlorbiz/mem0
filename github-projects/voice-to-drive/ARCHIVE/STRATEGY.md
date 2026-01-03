# Strategy & Architecture

## Core Design Decisions

### 1. PWA vs Native App
**Decision**: Progressive Web App (PWA)  
**Reasoning**:
- User wants to avoid app store submission/approval process
- Dedicated device usage eliminates main PWA limitations
- Instant updates without store review delays
- Cross-platform compatibility (iOS/Android)

**Trade-offs Accepted**:
- ❌ No background wake word detection ("Hey Claude" trigger)
- ❌ Must keep screen on during session
- ✅ Offset by dedicated device setup (always mounted, always charging)
- ✅ Acceptable for primary use case (driving sessions)

### 2. Voice Activity Detection vs Wake Words
**Decision**: VAD (Voice Activity Detection) for auto-recording  
**Reasoning**:
- Wake words require background processing (not available in PWA)
- VAD works in foreground PWA with screen on
- Actually better UX: just talk naturally, no command needed
- Pause detection (5+ minutes silence) auto-saves segments

**Implementation**:
- Use `@ricky0123/vad-web` library (ONNX-based, runs in browser)
- Confidence threshold tuning for car environment (road noise)
- Configurable sensitivity settings

### 3. Session-Based Recording Model
**Decision**: Continuous session with auto-segmentation  
**Reasoning**:
- Better for brainstorming/long-form thinking
- Auto-saves on pauses prevent data loss
- Each thought becomes separate file (easier to review later)
- Handles interruptions gracefully

**Flow**:
```
Start Session
  ↓
VAD Listening (idle)
  ↓
Speech Detected → Start Recording
  ↓
Silence Detected (30s) → Auto-save → Back to Listening
  ↓
(Repeat until End Session)
```

### 4. Offline-First Architecture
**Decision**: Record locally, sync when possible  
**Reasoning**:
- Cellular coverage gaps while driving
- Prevents data loss from connectivity issues
- Better battery efficiency (batch uploads)

**Technical Approach**:
```
Recording → IndexedDB (immediate)
            ↓
         Queue Manager
            ↓
     [When Online] → Upload to Drive
            ↓
      Mark as Synced → Delete Local Copy
```

### 5. Google Drive Organization
**Decision**: Year/Month/Day folder hierarchy  
**Reasoning**:
- Easy to find recordings by date
- Scales well over time
- Works with future n8n automation
- Standard path structure: `recordings/2025/11/12/timestamp.mp3`

**Filename Convention**:
- Format: `YYYY-MM-DD_HH-MM-SS.mp3`
- Example: `2025-11-12_14-23-45.mp3`
- Optional suffix for interrupted recordings: `_interrupted`, `_continued`

## Technical Architecture

### Component Structure
```
┌─────────────────────────────────────┐
│         UI Layer (React)            │
│  - Session controls                 │
│  - Status indicators                │
│  - Settings                         │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│      VAD Engine                     │
│  - Speech detection                 │
│  - Confidence thresholding          │
│  - Start/stop triggers              │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│    Audio Recorder                   │
│  - MediaRecorder API                │
│  - Blob generation                  │
│  - Quality settings                 │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│   Storage Manager                   │
│  - IndexedDB for local queue        │
│  - Upload queue management          │
│  - Retry logic                      │
└──────────┬──────────────────────────┘
           │
┌──────────▼──────────────────────────┐
│   Google Drive API                  │
│  - OAuth authentication             │
│  - Folder creation                  │
│  - File upload                      │
└─────────────────────────────────────┘
```

### Data Flow

**Recording Phase**:
1. VAD detects speech start
2. MediaRecorder begins capturing
3. VAD detects extended silence (30s)
4. Recording stops, Blob created
5. Save to IndexedDB with metadata

**Sync Phase**:
1. Check network connectivity
2. Get oldest unsynced recording
3. Upload to Google Drive (with retry logic)
4. On success: mark as synced, delete local copy
5. Repeat for all queued recordings

### Error Handling Strategy

**Network Issues**:
- Detect `navigator.onLine` status
- Exponential backoff for retries
- Visual indicator: "X recordings pending"
- Manual sync button if needed

**Storage Issues**:
- Monitor IndexedDB quota
- Warn if space low (< 100MB)
- Auto-delete synced recordings to free space
- Emergency mode: skip local save, try direct upload

**Audio Issues**:
- Detect microphone permission denial
- Test audio levels before session start
- Visual audio level indicator
- Backup: allow manual recording if VAD fails

**Interruptions** (calls, app switches):
- Listen for `visibilitychange` event
- Auto-save current recording immediately
- Resume capability when returning to PWA
- Clear UI state indicators

## Security & Privacy

### Authentication
- OAuth 2.0 with Google Drive API
- Refresh token stored securely (localStorage with encryption)
- Scope limited to Drive file upload only

### Data Handling
- No server-side storage (direct client → Drive)
- No third-party analytics
- Local recordings deleted after sync
- All processing in-browser (no external API calls for VAD)

### Permissions
- Microphone access (required)
- Storage (IndexedDB)
- Network (for Drive sync)

## Performance Considerations

### Battery Optimization
- VAD processing is lightweight (ONNX model)
- Screen brightness can be lowered (still "on")
- Audio encoding: MP3 @ 64kbps (good quality, small size)
- Batch uploads to reduce wake cycles

### Storage Estimates
- 1 minute audio @ 64kbps ≈ 480KB
- 1 hour drive with 20 recordings ≈ 10MB
- IndexedDB can handle 100+ recordings easily
- Auto-cleanup after sync keeps storage minimal

### Network Usage
- Average recording: 5 minutes = ~2.4MB
- Upload when on WiFi preferred (configurable)
- Mobile data option for urgent syncs
- Compression: already using MP3

## Future Extensibility

### Phase 2: Transcription
- Add Whisper API integration
- Or watch Drive folder with n8n → Turboscribe
- Store transcript alongside audio: `2025-11-12_14-23-45.txt`

### Phase 3: AI Assessment
- Claude/Manus workflow triggered by transcript
- Action item extraction
- Calendar event creation
- Email drafts
- Task management integration

### Phase 4: Smart Features
- Speaker identification (if multiple people in car)
- Automatic tagging/categorization
- Search across transcripts
- Voice commands for metadata ("tag this as urgent")

## Development Roadmap

### MVP (Week 1-2)
- [ ] Basic PWA shell
- [ ] VAD integration
- [ ] Audio recording
- [ ] Local storage (IndexedDB)
- [ ] Basic UI (start/stop session)

### Alpha (Week 3-4)
- [ ] Google Drive OAuth
- [ ] Upload queue management
- [ ] Offline sync
- [ ] Error handling
- [ ] Status indicators

### Beta (Week 5-6)
- [ ] Settings/configuration
- [ ] Audio quality options
- [ ] Manual recording fallback
- [ ] Testing on dedicated device
- [ ] UI polish

### V1.0 Release
- [ ] Comprehensive error handling
- [ ] Documentation
- [ ] Deployment instructions
- [ ] User testing feedback incorporated

## Alternative Considerations (Rejected)

### Native App with Sideloading
- Would enable wake words
- But adds complexity to distribution
- User specifically wants to avoid app stores
- PWA approach is simpler for MVP

### Hybrid Approach (PWA + Shortcuts)
- Use Siri Shortcuts or Google Assistant
- But still requires manual trigger
- Not as seamless as VAD approach
- Can be added later as option

### WebRTC-based Recording
- More complex than MediaRecorder
- No clear benefit for this use case
- MediaRecorder is well-supported

### Cloud Processing for VAD
- Would require server and ongoing costs
- Privacy concerns (audio leaves device)
- In-browser VAD is sufficient and free

## Success Metrics

### Technical
- Recording accuracy: >95% capture rate
- Upload success: >99% (with retries)
- Latency: <2s from speech start to recording
- Battery drain: <20% per hour with screen on

### User Experience
- Zero-touch operation during session
- Clear visual feedback at all times
- Recovery from interruptions without data loss
- Setup time: <5 minutes for new device

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Browser VAD limitations in noisy car | High | Tunable sensitivity, manual mode fallback |
| IndexedDB quota exceeded | Medium | Auto-cleanup, quota monitoring, warnings |
| OAuth token expiration | Medium | Refresh token handling, re-auth flow |
| Drive API rate limits | Low | Batch uploads, exponential backoff |
| Device incompatibility | Low | Test on multiple devices, clear requirements |
| Poor cellular coverage | Low | Offline-first design handles this |

## Conclusion

This architecture balances the user's requirements (hands-free, no app stores, reliable) with technical constraints (PWA limitations, browser APIs). The dedicated device approach turns PWA weaknesses into non-issues, while maintaining simplicity and avoiding complex infrastructure.

The strategy prioritizes:
1. **Reliability**: Never lose a recording
2. **Simplicity**: Minimal user interaction
3. **Safety**: Legal, hands-free operation
4. **Extensibility**: Clear path to future features

Next step: Begin implementation of MVP components.
