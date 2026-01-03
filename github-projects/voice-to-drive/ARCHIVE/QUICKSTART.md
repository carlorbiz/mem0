# Quick Start Guide

## For Continuing This Project in a New Chat

Upload these files to get Claude up to speed:
1. `README.md` - Project overview and goals
2. `STRATEGY.md` - Technical decisions and architecture
3. `IMPLEMENTATION.md` - Step-by-step build guide
4. This `QUICKSTART.md` file

## Current Status

**✅ Completed:**
- Project planning and architecture design
- Technical stack selection
- Documentation (what you're reading now)

**🚧 In Progress:**
- None yet - ready to start building!

**📋 Next Steps:**
1. Set up development environment
2. Initialize project with dependencies
3. Implement core VAD + recording services
4. Build React UI components
5. Test on dedicated device

## Key Project Info

**What we're building:**
Hands-free voice recording PWA that auto-uploads to Google Drive, designed for a dedicated device mounted in a car.

**Tech Stack:**
- React for UI
- @ricky0123/vad-web for voice detection
- MediaRecorder API for audio
- IndexedDB for offline storage
- Google Drive API for cloud sync

**Key Features:**
- Voice Activity Detection (auto-start/stop on speech)
- Offline-first with sync queue
- Year/Month/Day folder organization
- Session-based recording

**Design Decisions:**
- PWA instead of native app (avoid app stores)
- VAD instead of wake words (PWA limitation)
- Dedicated device approach (screen stays on)
- Offline-first architecture

## When Starting Development

1. **Prerequisites to gather:**
   - Google Cloud Project credentials
   - OAuth 2.0 client ID and API key
   - Testing device ready

2. **First command:**
   ```bash
   mkdir voice-to-drive-pwa && cd voice-to-drive-pwa
   npm init -y
   ```

3. **Follow IMPLEMENTATION.md** for detailed steps

## Quick Context for Claude

When you upload these docs to a new chat, start your message like:

> "I'm continuing work on the Voice-to-Drive PWA project. Here are the documentation files. We've completed planning and architecture design. I'm ready to start [specific next step]. Can you help me with [specific question]?"

This gives immediate context about where we are and what you need.

## Important Reminders

- **User preference:** Stay off mobile app stores
- **Primary use case:** Hands-free recording while driving
- **Dedicated device:** Removes most PWA limitations
- **Safety first:** Designed for legal, no-touch operation

## Files in This Project

- `README.md` - High-level overview, features, user flow
- `STRATEGY.md` - Architecture, technical decisions, design rationale
- `IMPLEMENTATION.md` - Step-by-step build instructions, code samples
- `QUICKSTART.md` - This file - quick reference for continuation

## Common Questions

**Q: Why PWA instead of native app?**
A: User wants to avoid app stores. Dedicated device setup makes PWA viable.

**Q: Why no wake word like "Hey Claude"?**
A: PWAs can't do background wake word detection. Using VAD instead (auto-detects speech).

**Q: How does offline recording work?**
A: Records to IndexedDB immediately, uploads to Drive when connection available.

**Q: What about call interruptions?**
A: Auto-saves current recording when interrupted, allows resume after.

**Q: Why dedicated device?**
A: Solves PWA screen-on requirement, eliminates call interruptions, can stay in session mode permanently.

## Success Criteria

MVP is successful when:
- Can start session with one tap
- VAD reliably detects speech in car environment
- Recordings save locally immediately
- Uploads to Drive with Year/Month/Day structure
- Handles offline/online transitions gracefully
- Works hands-free while driving

## Getting Help

If stuck, check:
1. IMPLEMENTATION.md for detailed code examples
2. STRATEGY.md for architectural reasoning
3. README.md for project overview

For specific errors, share:
- What you were trying to do
- Error messages from console
- Which browser/device
- Current development step

## Project Timeline (Estimated)

- Week 1-2: MVP core functionality
- Week 3-4: Alpha testing and refinement
- Week 5-6: Beta testing on device
- Week 7+: Deployment and real-world use

Good luck building! 🚀
