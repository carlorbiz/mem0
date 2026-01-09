# Implementation Guide: Notion-Drive-KL Sync

## 🎯 What You're Building

A complete synchronization system that keeps Notion, Google Drive, and Knowledge Lake in sync via n8n, so your AI agents can access data from whichever platform they can connect to.

---

## ✅ Pre-Flight Checklist

Before you start, make sure you have:

- [ ] n8n running (http://localhost:5678)
- [ ] Notion integration API key (with read+write permissions)
- [ ] Google Cloud service account JSON file (with Drive API enabled)
- [ ] Knowledge Lake API accessible at: `https://knowledge-lake-api-production.up.railway.app`
- [ ] List of Notion databases you want to sync

---

## 🚀 Step-by-Step Implementation

### Phase 1: Discovery (30 minutes)

**Goal:** Find all your Notion databases and their IDs

1. **Import Workflow 01**
   - Open n8n → Import workflow
   - Select: `01-database-discovery-workflow.json`
   - Import

2. **Configure Credentials**
   - Click on "Search All Databases" node
   - Select your Notion API credential (or create new)
   - Save

3. **Create Tracking Sheet**
   - Go to Google Drive
   - Create new Google Sheet: "AAE Database Inventory"
   - Copy the Sheet ID from URL: `docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - In n8n, update "Save to Tracking Sheet" node with this ID

4. **Run Discovery**
   - Click "Execute Workflow" in n8n
   - Wait for completion
   - Open your "AAE Database Inventory" sheet
   - You should see all your Notion databases listed with IDs

5. **Export Results**
   - Copy the database IDs you care about
   - Update `database-sync-config.json` with these IDs

---

### Phase 2: Auto-Create Google Sheets (45 minutes)

**Goal:** Automatically create Google Sheets for each Notion database

1. **Prepare Parent Folder**
   - Go to Google Drive
   - Create folder: "AAE Notion Sync"
   - Copy folder ID from URL: `drive.google.com/drive/folders/FOLDER_ID_HERE`

2. **Import Workflow 04**
   - n8n → Import workflow
   - Select: `04-auto-create-sheets-workflow.json`

3. **Update Configuration**
   - Click on "Load Database Config" node
   - Edit the JavaScript to include your databases:
   ```javascript
   const config = {
     "databases": [
       {
         "name": "Master AI System",
         "notion_database_id": "24f9440556f78033a2e0e8f4eee6f341",
         "google_sheet_name": "Master AI System"
       },
       {
         "name": "Deck Generation",
         "notion_database_id": "27494405-56f7-8047-a148-db17477e12f3",
         "google_sheet_name": "Deck Generation"
       }
       // Add more from your discovery results
     ],
     "parent_folder_id": "YOUR_FOLDER_ID_HERE"
   };
   ```

4. **Update All Nodes with Folder ID**
   - "Create Google Sheet" node → Options → Folder ID → Paste your folder ID
   - Save

5. **Create Tracking Sheet**
   - Create another sheet: "Created Sheets Log"
   - Copy its ID
   - Update "Log to Tracking Sheet" node with this ID

6. **Run Auto-Creation**
   - Execute workflow
   - Watch as sheets are created automatically
   - Check your "AAE Notion Sync" folder - you should see new sheets!

7. **Update Config File**
   - Open "Created Sheets Log"
   - Copy the Sheet IDs that were created
   - Update `database-sync-config.json` with these IDs:
   ```json
   {
     "name": "Master AI System",
     "notion_database_id": "24f9440556f78033a2e0e8f4eee6f341",
     "google_sheet_id": "PASTE_CREATED_SHEET_ID_HERE",
     "google_sheet_name": "Master AI System"
   }
   ```

---

### Phase 3: Setup Notion → Drive Sync (1 hour)

**Goal:** Sync Notion databases to Google Sheets every 4 hours

1. **Import Workflow 02**
   - n8n → Import workflow
   - Select: `02-notion-to-drive-sync-workflow.json`

2. **Configure Database List**
   - Click "Get Database List from Config" node
   - Update with your databases (you can do multiple):
   ```javascript
   // For multiple databases, create array:
   const databases = [
     {
       databaseId: "24f9440556f78033a2e0e8f4eee6f341",
       databaseName: "Master AI System",
       sheetId: "YOUR_SHEET_ID",
       sheetName: "Sheet1"
     },
     {
       databaseId: "27494405-56f7-8047-a148-db17477e12f3",
       databaseName: "Deck Generation",
       sheetId: "YOUR_SHEET_ID_2",
       sheetName: "Sheet1"
     }
   ];
   return databases;
   ```

3. **Configure Google Sheets Nodes**
   - "Clear Existing Sheet" → Add Google Sheets credential
   - "Append to Google Sheet" → Add Google Sheets credential
   - Save both

4. **Configure Knowledge Lake Node**
   - "Log to Knowledge Lake" → Add HTTP Header Auth credential
   - Header: `Authorization`
   - Value: `Bearer YOUR_KL_API_KEY`
   - Save

5. **Test Run (IMPORTANT!)**
   - **Disable** the Schedule Trigger first
   - Use Manual Trigger instead (change the starting node)
   - Execute workflow manually
   - Check results:
     - [ ] Google Sheets populated with data?
     - [ ] All columns present?
     - [ ] Notion URLs included?
     - [ ] Timestamps correct?

6. **Enable Schedule**
   - Once manual test succeeds, switch back to Schedule Trigger
   - Activate workflow
   - It will run every 4 hours automatically

---

### Phase 4: Setup Notion → Knowledge Lake Sync (30 minutes)

**Goal:** Ingest Notion page content into Knowledge Lake for semantic search

1. **Import Workflow 03**
   - n8n → Import workflow
   - Select: `03-notion-to-knowledge-lake-workflow.json`

2. **Configure Notion Credential**
   - "Get Recently Edited Pages" → Add Notion credential
   - "Get Page Content" → Add Notion credential
   - Save

3. **Configure Knowledge Lake**
   - "Ingest to Knowledge Lake" → Add HTTP Header Auth credential
   - Save

4. **Test with Small Batch**
   - Edit "Get Recently Edited Pages" node
   - Set `limit: 5` (start small!)
   - Execute workflow manually
   - Check Knowledge Lake:
   ```bash
   curl -X POST https://knowledge-lake-api-production.up.railway.app/api/conversations/search \
     -H "Content-Type: application/json" \
     -d '{"query": "notion-sync", "limit": 5}' | python -m json.tool
   ```

5. **Scale Up**
   - Once test succeeds, increase limit to 100
   - Activate workflow
   - It will run every 6 hours

---

## 🔍 Verification Steps

### Verify Notion → Drive Sync

1. Make a change in a Notion database
2. Wait for next sync (or trigger manually)
3. Check Google Sheet - change should appear
4. Verify timestamps are updated

### Verify Notion → Knowledge Lake Sync

```bash
# Search for recently synced content
curl -X POST https://knowledge-lake-api-production.up.railway.app/api/conversations/search \
  -H "Content-Type: application/json" \
  -d '{"query": "your search term", "limit": 10}' | python -m json.tool

# Check health
curl https://knowledge-lake-api-production.up.railway.app/health | python -m json.tool

# Get stats
curl https://knowledge-lake-api-production.up.railway.app/api/stats | python -m json.tool
```

### Test Agent Access

**Fred (ChatGPT) via Google Sheets:**
- Ask Fred: "What's in the Master AI System sheet?"
- Fred should be able to read the Google Sheet directly

**Gemini via Knowledge Lake:**
- Query: "Search the knowledge lake for [topic]"
- Should return Notion-sourced content

**Manus via Google Sheets:**
- Test: "Read row 5 from Master AI System sheet"
- Should work without Notion API complexity

---

## 🐛 Troubleshooting

### "Database not found" Error

**Cause:** Notion integration doesn't have access to the database

**Fix:**
1. Open Notion database
2. Click "..." (More) → "Add connections"
3. Select your integration
4. Re-run workflow

### "Google Sheets quota exceeded"

**Cause:** Too many writes too quickly

**Fix:**
1. Reduce sync frequency (change cron to `0 */6 * * *` for 6 hours)
2. Sync fewer databases at once
3. Check Google Cloud Console quotas

### "Knowledge Lake 404"

**Cause:** Using wrong URL or API is down

**Fix:**
1. Verify URL: `https://knowledge-lake-api-production.up.railway.app`
2. Check health: `curl https://knowledge-lake-api-production.up.railway.app/health`
3. Review Railway deployment logs
4. If deploying, check for Next.js CVE build failures

### "Empty Google Sheets"

**Cause:** Property mapping mismatch or authentication issue

**Fix:**
1. Check n8n execution log for errors
2. Verify Google Sheets credential is valid
3. Test with a simple database first
4. Check "Transform to Sheets Format" node for errors

---

## 📊 Monitoring

### Daily Checks
- [ ] Open one Google Sheet → verify last sync timestamp
- [ ] Query Knowledge Lake → verify recent ingestions
- [ ] Check n8n execution history → any failed workflows?

### Weekly Review
```bash
# Get sync statistics from Knowledge Lake
curl -X POST https://knowledge-lake-api-production.up.railway.app/api/conversations/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Notion Sync agent:n8n-sync", "limit": 50}' | python -m json.tool
```

---

## 🎉 Success Criteria

You'll know it's working when:

✅ **Google Sheets auto-update** every 4 hours with latest Notion data
✅ **Knowledge Lake contains** Notion page content searchable semantically
✅ **Fred can access** Notion data via Google Sheets without API complexity
✅ **Manus can read** project info from Google Sheets
✅ **Gemini can query** Knowledge Lake for strategic insights
✅ **n8n logs show** successful executions consistently
✅ **No manual intervention** needed for weeks at a time

---

## 🚀 Next Steps After Setup

1. **Enable more databases** - Add to config and auto-create sheets
2. **Customize sync frequency** - Adjust based on usage patterns
3. **Add bidirectional sync** - Google Sheets → Notion (Phase 2)
4. **Setup real-time webhooks** - Instant sync instead of scheduled
5. **Add error notifications** - Email/Slack alerts when sync fails

---

## 📞 Getting Help

**If you get stuck:**
1. Check n8n execution log (shows exact error)
2. Review this guide's troubleshooting section
3. Ask CC to diagnose: "CC, check the n8n logs for sync errors"
4. Query Knowledge Lake to see if data is flowing
5. Check Railway logs if Knowledge Lake issues

**Common first-time issues:**
- Forgetting to share Notion databases with integration
- Using wrong Google Sheet ID (needs to be from URL, not name)
- Knowledge Lake API key not set in n8n credentials
- Parent folder ID not updated in workflow

---

## ⏱️ Estimated Time

| Phase | Time | Difficulty |
|-------|------|-----------|
| Phase 1: Discovery | 30 min | Easy |
| Phase 2: Auto-Create Sheets | 45 min | Medium |
| Phase 3: Notion → Drive | 1 hour | Medium |
| Phase 4: Notion → Knowledge Lake | 30 min | Easy |
| **Total** | **~3 hours** | **Medium** |

**Note:** First-time setup takes longer. Subsequent database additions take ~15 minutes each.

---

Good luck! 🚀
