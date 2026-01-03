# Emergency Recovery Script

If you need to recover recordings immediately without deploying:

## 1. Open the app in browser
Visit: https://520c289c.voice-to-drive.pages.dev (or latest deployment)

## 2. Open DevTools
Press F12 or Right-click → Inspect

## 3. Go to Console tab

## 4. Paste this script:

```javascript
// Import IndexedDB library
const script = document.createElement('script');
script.type = 'module';
script.textContent = `
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';

(async function() {
  console.log('🔍 Starting IndexedDB inspection...');

  const db = await openDB('voice-recordings', 2);
  const recordings = await db.getAll('recordings');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(\`Total recordings found: \${recordings.length}\`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const unsynced = recordings.filter(r => !r.synced);
  const transcribed = recordings.filter(r => r.transcribed);

  console.log(\`Unsynced (not uploaded): \${unsynced.length}\`);
  console.log(\`Transcribed: \${transcribed.length}\`);
  console.log('');

  // Export all recordings
  console.log('📥 Downloading all recordings...');

  for (const rec of recordings) {
    const date = new Date(rec.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const fileName = \`\${year}-\${month}-\${day}_\${hours}-\${minutes}-\${seconds}\`;

    // Download transcript
    if (rec.transcript) {
      const textBlob = new Blob([rec.transcript], { type: 'text/plain' });
      const textUrl = URL.createObjectURL(textBlob);
      const textLink = document.createElement('a');
      textLink.href = textUrl;
      textLink.download = \`\${fileName}.txt\`;
      textLink.click();
      URL.revokeObjectURL(textUrl);
      console.log(\`✅ Downloaded: \${fileName}.txt\`);
    }

    // Download audio
    if (rec.blob) {
      const audioUrl = URL.createObjectURL(rec.blob);
      const audioLink = document.createElement('a');
      audioLink.href = audioUrl;
      audioLink.download = \`\${fileName}.webm\`;
      audioLink.click();
      URL.revokeObjectURL(audioUrl);
      console.log(\`✅ Downloaded: \${fileName}.webm\`);
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Export complete! Check your Downloads folder.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
})();
`;
document.head.appendChild(script);
```

## 5. Press Enter

The script will:
- List all recordings in IndexedDB
- Automatically download each one to your Downloads folder
- Show progress in console

## 6. Check Downloads folder

You should see files like:
- `2025-11-16_14-30-45.webm` (audio)
- `2025-11-16_14-30-45.txt` (transcript, if available)

## Alternative: Manual Inspection

To just inspect without downloading:

1. Open DevTools (F12)
2. Go to: **Application** tab → **IndexedDB** → **voice-recordings** → **recordings**
3. Click on each recording to see details
4. You can manually export by:
   - Right-click on the blob field
   - Copy the value
   - Use a blob viewer online

## After Recovery

Once you have your files safely downloaded:

### Clear the database (optional):
```javascript
const script2 = document.createElement('script');
script2.type = 'module';
script2.textContent = `
import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@8/+esm';
const db = await openDB('voice-recordings', 2);
await db.clear('recordings');
console.log('✅ Database cleared!');
`;
document.head.appendChild(script2);
```

## Troubleshooting

**If script doesn't run:**
- Make sure you're on the actual app page (not diagnostic.html)
- Make sure IndexedDB is not disabled in browser
- Try running each command separately in console

**If downloads don't start:**
- Check browser's download settings
- Some browsers block multiple automatic downloads
- Click the download button in browser address bar to allow

**If no recordings found:**
- Confirm you're on the correct browser/device where you made the recordings
- IndexedDB is specific to each browser and profile
- Check if you're using incognito mode (data might be cleared)
