# Voice Transcribe Worker

Cloudflare Worker for audio transcription using Whisper AI.

## Deployment

### Prerequisites
- Cloudflare account with Workers AI enabled
- Wrangler CLI installed (use WSL on Windows ARM64)

### Deploy from WSL

```bash
# Navigate to workers directory
cd /mnt/c/Users/carlo/Development/mem0-sync/mem0/github-projects/voice-to-drive/workers

# Deploy the worker
wrangler deploy

# The worker will be deployed to:
# https://voice-transcribe.<your-subdomain>.workers.dev
```

### First-time Setup

If this is your first Workers AI deployment, you may need to:

1. Enable Workers AI in your Cloudflare dashboard
2. Accept the Workers AI terms of service
3. Verify your account has AI binding enabled

## Testing

### Test with curl

```bash
# Create a test audio file (or use existing .webm file)
# Replace URL with your deployed worker URL

curl -X POST https://voice-transcribe.<your-subdomain>.workers.dev/transcribe \
  -H "Content-Type: audio/webm" \
  --data-binary "@test-audio.webm" \
  | jq

# Expected response:
# {
#   "success": true,
#   "text": "Transcribed text here...",
#   "timestamp": "2025-01-15T...",
#   "processingTime": 1234,
#   "audioSize": 12345
# }
```

### Test with JavaScript fetch

```javascript
const audioBlob = new Blob([audioData], { type: 'audio/webm' });

const response = await fetch('https://voice-transcribe.<your-subdomain>.workers.dev/transcribe', {
  method: 'POST',
  body: audioBlob
});

const result = await response.json();
console.log('Transcript:', result.text);
```

## API Endpoints

### POST /transcribe

Transcribe audio to text using Whisper AI.

**Request:**
- Method: `POST`
- Content-Type: `audio/webm` (or other audio formats)
- Body: Raw audio blob or multipart form data with `audio` field

**Response:**
```json
{
  "success": true,
  "text": "Transcribed text...",
  "timestamp": "2025-01-15T12:34:56.789Z",
  "processingTime": 1234,
  "audioSize": 12345,
  "vtt": "WEBVTT...",
  "words": [...]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message",
  "timestamp": "2025-01-15T12:34:56.789Z"
}
```

## Configuration

### wrangler.toml

- **name**: `voice-transcribe` - Worker name
- **compatibility_date**: `2024-01-01` - Workers runtime version
- **ai.binding**: `AI` - Enables Workers AI

### Environment Variables

No environment variables required. The AI binding is configured in wrangler.toml.

## Limits & Pricing

### Free Tier
- 10,000 neurons per day
- Whisper uses ~1 neuron per second of audio
- Example: ~2.7 hours of audio per day free

### Paid Tier
- $0.011 per 1,000 neurons
- Example: 1 hour of audio = ~$0.04

### File Size Limits
- Maximum: 25MB per request
- Recommended: Keep recordings under 5 minutes for best performance

## Model Information

**Model:** `@cf/openai/whisper-large-v3-turbo`

- Language: Auto-detect (90+ languages)
- Accuracy: High (OpenAI Whisper v3 Turbo)
- Speed: Fast (~1-2 seconds per minute of audio)
- Output: Text transcript, optional VTT and word timestamps

## Troubleshooting

### Error: "AI binding not found"
- Ensure wrangler.toml has `[ai]` binding configured
- Run `wrangler deploy` again after updating config

### Error: "Audio file too large"
- Maximum file size is 25MB
- Consider splitting longer recordings

### Error: "Rate limit exceeded"
- Free tier: 10,000 neurons/day
- Wait 24 hours or upgrade to paid tier

### CORS errors in browser
- Worker includes CORS headers for all origins
- Check browser console for specific error messages

## Integration with Voice to Drive PWA

The transcription service (`src/services/transcription.js`) will use this Worker:

```javascript
const workerUrl = import.meta.env.VITE_TRANSCRIPTION_WORKER_URL;
const response = await fetch(`${workerUrl}/transcribe`, {
  method: 'POST',
  body: audioBlob
});
```

Environment variable to add to Cloudflare Pages:
```
VITE_TRANSCRIPTION_WORKER_URL=https://voice-transcribe.<your-subdomain>.workers.dev
```

## Development

### Local Testing

```bash
# Run worker locally (requires wrangler dev)
wrangler dev

# Worker will be available at http://localhost:8787
# Test with curl or browser
```

### Viewing Logs

```bash
# View real-time logs
wrangler tail

# View logs in dashboard
# https://dash.cloudflare.com → Workers & Pages → voice-transcribe → Logs
```

## Next Steps

After deploying this Worker:

1. ✅ Copy the deployed Worker URL
2. ⬜ Add `VITE_TRANSCRIPTION_WORKER_URL` to `.env` file
3. ⬜ Add environment variable to Cloudflare Pages dashboard
4. ⬜ Create `src/services/transcription.js` in PWA
5. ⬜ Update `src/services/syncManager.js` to use transcription
6. ⬜ Test full flow: Record → Transcribe → Upload to Drive
