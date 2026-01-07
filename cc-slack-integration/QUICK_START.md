# CC Slack Integration - Quick Start Guide

Get up and running in 15 minutes! Command Claude Code from anywhere via Slack.

## Prerequisites

- ✅ Slack workspace with admin access
- ✅ Notion account with integration token
- ✅ n8n running on localhost:5678
- ✅ Claude Code installed
- ✅ Windows laptop (stays on while traveling)

## 5-Step Setup

### 1️⃣ Create Notion Database (3 min)

1. Go to your Notion workspace
2. Create new database: **CC Inbox**
3. Add these properties (see README.md for details):
   - Name (Title)
   - Status (Select): Pending, Processing, Completed
   - Wake CC (Checkbox)
   - Priority (Select): Low, Medium, High, Urgent
   - Source, Slack Thread Link, Slack Channel ID, Slack Message TS (all Text/URL)
   - Created Time, Processed Time (auto)
   - Response, Project Key (Text)
 
4. **Copy the database ID** from URL:
   ```
   https://notion.so/[workspace]/[DATABASE_ID]?v=...
                                  ^^^^^^^^^^^
   ```

5. Update `check-inbox.py`:
   ```python
   CC_INBOX_DB_ID = "paste-your-database-id-here"
   ```

### 2️⃣ Configure Slack in Zapier MCP (2 min)

1. Add Slack tools at: https://mcp.zapier.com/mcp/servers/[YOUR_ID]/config
2. Select these actions:
   - Send Channel Message
   - Send Direct Message
   - Get Channel Messages
   - Add Reaction to Message
3. Authorize your Slack workspace
4. Save

### 3️⃣ Import n8n Workflow (5 min)

1. Open n8n: http://localhost:5678
2. Click **Import from File**
3. Select: `n8n-workflow-slack-to-notion-cc-inbox.json`
4. Configure nodes:
   - **Slack Trigger**: Add Slack credentials, select channel(s) to monitor
   - **Create CC Inbox Item**: Add Notion credentials, paste database ID
   - **Slack Confirmation**: Use same Slack credentials
5. **Activate** the workflow
6. Test: Send "CC — hello" in Slack, check Notion for new item

### 4️⃣ Setup Task Scheduler (2 min)

Run PowerShell **as Administrator**:

```powershell
cd C:\Users\carlo\Development\mem0-sync\mem0\cc-slack-integration
.\setup-task-scheduler.ps1
```

This creates a task that checks every 5 minutes for CC wake flags.

### 5️⃣ Set Environment Variables (1 min)

Set Notion API key:

```powershell
# Temporary (current session):
$env:NOTION_API_KEY = "your-notion-integration-token"

# Permanent (all sessions):
[System.Environment]::SetEnvironmentVariable("NOTION_API_KEY", "your-token", "User")
```

Get your Notion integration token: https://www.notion.so/my-integrations

## Validate Setup

Run the validation script:

```powershell
.\validate-setup.ps1
```

Fix any errors or warnings before proceeding.

## Test End-to-End

### Test 1: Manual Inbox Check

```powershell
python check-inbox.py
```

Should show "Inbox clear - no items to process"

### Test 2: Create Inbox Item

In Slack, send:
```
CC — test the system
```

Check Notion - you should see a new CC Inbox item with:
- Wake CC = ✅
- Status = Pending

### Test 3: Trigger CC Manually

```powershell
Start-ScheduledTask -TaskName "CC Wake Check"
```

Within a minute, check:
- Slack: CC's response in your thread
- Notion: Status = Completed, Wake CC = unchecked

### Test 4: Automatic Wake-Up

1. Send another Slack message: `CC — what time is it?`
2. Wait up to 5 minutes
3. CC should automatically respond

## Usage

### From Phone/Any Device

Send Slack messages with "CC —" prefix:

```
CC — summarize the latest Knowledge Lake updates

CC — URGENT check if the API server is running

CC — [PROJECT: AAE] update Notion sync status
```

### Response Time

- **Automatic**: Within 5 minutes (polling interval)
- **Manual**: Instant if you trigger the task manually
- **Interactive**: Instant if already in CC terminal

### Check Status

View logs:
```powershell
Get-Content cc-wake-log.txt -Tail 20
```

View pending items:
```powershell
python check-inbox.py
```

## Troubleshooting

### No Response from CC

```powershell
# Check task is running
Get-ScheduledTask -TaskName "CC Wake Check"

# Manually trigger
Start-ScheduledTask -TaskName "CC Wake Check"

# Check logs
Get-Content cc-wake-log.txt -Tail 50
```

### Slack Not Creating Inbox Items

1. Check n8n workflow is **Active**
2. Check n8n execution history for errors
3. Verify Slack credentials in n8n
4. Test Slack trigger with "CC — test"

### Python Errors

```powershell
# Install dependencies
pip install requests

# Test Notion connection
python -c "import requests; print('OK')"
```

## Next Steps

Once working:

- [ ] Customize polling interval (default 5 min)
- [ ] Add more Slack channels to monitor
- [ ] Create custom CC command templates
- [ ] Set up email notifications on completion
- [ ] Configure priority-based processing

## Support

- Full docs: `README.md`
- Validate setup: `.\validate-setup.ps1`
- Check inbox: `python check-inbox.py`
- View logs: `Get-Content cc-wake-log.txt`

---

**Pro Tip**: Keep your laptop plugged in and sleeping (not hibernating) while traveling. Set Windows power settings to "Never sleep when plugged in" for best reliability.
