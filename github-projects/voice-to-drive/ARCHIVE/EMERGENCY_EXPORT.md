# Emergency Export Script

## Immediate Recovery (Use Browser Console)

1. **Open the app in your browser** where the 34 recordings exist
2. **Open DevTools** (F12)
3. **Go to Console tab**
4. **Paste this entire script** and press Enter:

```javascript
(async function emergencyExport() {
  try {
    console.log('🚀 Starting emergency export...');

    // Open IndexedDB directly
    const openRequest = indexedDB.open('voice-recordings', 2);

    openRequest.onsuccess = async (event) => {
      const db = event.target.result;
      console.log('✅ Database opened');

      // Get all recordings without using indexes
      const transaction = db.transaction('recordings', 'readonly');
      const store = transaction.objectStore('recordings');
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = async () => {
        const recordings = getAllRequest.result;
        console.log(`📊 Found ${recordings.length} recordings`);

        if (recordings.length === 0) {
          console.log('❌ No recordings found!');
          return;
        }

        // Export each recording
        for (let i = 0; i < recordings.length; i++) {
          const rec = recordings[i];
          const date = new Date(rec.timestamp);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');
          const fileName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

          // Download transcript if exists
          if (rec.transcript) {
            const textBlob = new Blob([rec.transcript], { type: 'text/plain' });
            const textUrl = URL.createObjectURL(textBlob);
            const textLink = document.createElement('a');
            textLink.href = textUrl;
            textLink.download = `${fileName}.txt`;
            textLink.click();
            URL.revokeObjectURL(textUrl);
            console.log(`✅ [${i+1}/${recordings.length}] Exported transcript: ${fileName}.txt`);
          }

          // Download audio
          if (rec.blob) {
            const audioUrl = URL.createObjectURL(rec.blob);
            const audioLink = document.createElement('a');
            audioLink.href = audioUrl;
            audioLink.download = `${fileName}.webm`;
            audioLink.click();
            URL.revokeObjectURL(audioUrl);
            console.log(`✅ [${i+1}/${recordings.length}] Exported audio: ${fileName}.webm`);
          }

          // Small delay to avoid overwhelming browser
          await new Promise(resolve => setTimeout(resolve, 150));
        }

        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🎉 SUCCESS! Exported ${recordings.length} recordings`);
        console.log('📁 Check your Downloads folder');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('⚠️ IMPORTANT: Once you verify files are downloaded, you can clear the database:');
        console.log('Run: clearOldDatabase()');
      };

      getAllRequest.onerror = () => {
        console.error('❌ Failed to get recordings:', getAllRequest.error);
      };
    };

    openRequest.onerror = () => {
      console.error('❌ Failed to open database:', openRequest.error);
    };

  } catch (error) {
    console.error('❌ Export failed:', error);
  }
})();

// Function to clear database after successful export
window.clearOldDatabase = function() {
  if (!confirm('⚠️ Are you sure? This will delete all recordings from IndexedDB!\n\nOnly proceed if you have verified the downloads.')) {
    return;
  }

  const deleteRequest = indexedDB.deleteDatabase('voice-recordings');

  deleteRequest.onsuccess = () => {
    console.log('✅ Database cleared! Refresh the page to start fresh.');
  };

  deleteRequest.onerror = () => {
    console.error('❌ Failed to delete database');
  };
};
```

5. **Allow multiple downloads** when browser prompts
6. **Wait for completion** - You'll see progress in console
7. **Check Downloads folder** for 34 .webm files

## After Successful Export

Once you've verified all files are in Downloads:

```javascript
clearOldDatabase()
```

Then refresh the page - the app will recreate the database with proper indexes.
