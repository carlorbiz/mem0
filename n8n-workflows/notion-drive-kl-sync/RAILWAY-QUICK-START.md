# Railway n8n Quick Start Guide

## 🎯 For Your Railway Deployment

This is the **fastest path** to get Notion-Drive-KL sync working on your Railway n8n instance.

---

## ⚡ 5-Minute Compatibility Check

**Before importing anything:**

```bash
# 1. Check n8n is accessible
curl http://localhost:5678/healthz

# 2. Run compatibility checker
bash check-n8n-compatibility.sh

# 3. Note your n8n version
# Look for output like: "n8n version: 1.19.0"
```

**Decision:**
- Version 1.0.0+ → Can use either Standard or SAFE
- Version < 1.0.0 → **Must use SAFE**
- Can't determine → **Use SAFE** (safer choice)

---

## 🚀 Recommended Path for Railway

### Phase 1: Test Compatibility (15 min)

1. **Import SAFE version of workflow 02**
   - File: `02-notion-to-drive-sync-workflow-SAFE.json`
   - Why: Maximum compatibility, works with older n8n

2. **Check for import errors**
   - Open workflow in n8n
   - All nodes should be green
   - If red nodes → See troubleshooting below

3. **Configure credentials** (don't execute yet)
   - Add Notion API credential
   - Add Google Sheets credential
   - Add Knowledge Lake HTTP auth

### Phase 2: First Sync Test (30 min)

1. **Prepare Google Sheet**
   - Create new sheet: "Master AI System Test"
   - Copy sheet ID from URL
   - Update workflow node with sheet ID

2. **Update workflow configuration**
   - Edit "Query Notion Database" node
   - Set database ID: `24f9440556f78033a2e0e8f4eee6f341`
   - Save

3. **Manual test execution**
   - **Disable** Schedule Trigger
   - Add Manual Trigger at start
   - Click "Execute Workflow"
   - Check results

4. **Verify success**
   - Check Google Sheet → Data appeared?
   - Check Knowledge Lake → Sync logged?
   - Check n8n execution log → No errors?

### Phase 3: Enable Automation (10 min)

1. **Switch back to Schedule Trigger**
   - Remove Manual Trigger
   - Re-enable Schedule Trigger (every 4 hours)
   - Save

2. **Activate workflow**
   - Toggle "Active" switch on
   - Workflow will now run automatically

3. **Monitor first scheduled run**
   - Wait for next 4-hour mark
   - Check execution log
   - Verify sync completed

---

## 📋 Checklist Before Starting

### Prerequisites

- [ ] n8n running on Railway (accessible via URL)
- [ ] Notion integration API key (with read+write)
- [ ] Google Cloud service account JSON
- [ ] Knowledge Lake API accessible
- [ ] At least 1 Notion database to sync
- [ ] At least 1 Google Sheet created (or ready to create)

### Railway-Specific

- [ ] Railway environment variables set (if needed)
- [ ] n8n version is known (or compatibility check run)
- [ ] Webhook URL configured (if using webhooks)

---

## 🐛 Troubleshooting Railway-Specific Issues

### Issue: Cannot import workflow

**Symptom:** Import fails or workflow appears empty

**Cause:** JSON format or n8n version incompatibility

**Fix:**
1. Try SAFE version instead of Standard
2. Check n8n logs in Railway dashboard
3. Verify file isn't corrupted (re-download from repo)

### Issue: "Unknown node type"

**Symptom:** Red nodes after import, says "node type not found"

**Cause:** Node doesn't exist in your n8n version

**Fix:**
1. Confirm using SAFE version
2. Check n8n version in Railway logs
3. If < v0.180.0 → Need to upgrade n8n
4. Report to CC with version number

### Issue: Credentials not working

**Symptom:** "Invalid credentials" or authentication errors

**Cause:** Credential type mismatch or Railway environment

**Fix:**
1. Re-create credentials in n8n UI (don't import)
2. For Notion: Use "Notion API" credential type
3. For Google: Use "Google Sheets OAuth2 API"
4. For Knowledge Lake: Use "HTTP Header Auth"
   - Header: `Authorization`
   - Value: `Bearer YOUR_KEY`

### Issue: Workflow executes but no data appears

**Symptom:** Execution shows success but Google Sheet empty

**Cause:** Property mapping issue or API limits

**Fix:**
1. Check n8n execution log → Look for errors in transform node
2. Verify Notion database is shared with integration
3. Check Google Sheet ID is correct
4. Try reducing limit (query fewer pages first)

### Issue: Railway app sleeping/timeout

**Symptom:** First execution after idle fails

**Cause:** Railway free tier may sleep apps

**Fix:**
1. Upgrade Railway plan (removes sleep)
2. Or: Use external uptime monitor (pings app)
3. Or: Increase timeout in workflow settings

---

## 🎯 Railway-Optimized Configuration

### Recommended Sync Schedule

For Railway deployments:

```javascript
// Every 6 hours (lighter load)
"cronExpression": "0 */6 * * *"

// Or daily at specific time (if low-volume)
"cronExpression": "0 2 * * *"  // 2am daily
```

**Why?**
- Reduces Railway resource usage
- Stays within API rate limits
- Sufficient for most use cases

### Resource Considerations

**Railway Free Tier:**
- 500 hours/month execution time
- Limited memory (512MB-1GB)
- May sleep after inactivity

**Optimization:**
- Sync fewer databases initially
- Use longer intervals (6+ hours)
- Monitor Railway resource dashboard

**Scaling:**
- Once proven working, add more databases
- Adjust frequency based on needs
- Consider upgrading Railway plan if needed

---

## ✅ Success Criteria for Railway

You'll know it's working when:

✅ **Import succeeds** - No red nodes, all nodes recognized
✅ **Manual test works** - Data appears in Google Sheet
✅ **Schedule runs** - First automated execution completes
✅ **No Railway alerts** - No resource/memory warnings
✅ **Consistent execution** - Runs every 4-6 hours without fails
✅ **Knowledge Lake logs** - Sync events visible in KL

---

## 📊 What to Monitor (Railway)

### Daily (2 min)
- Railway dashboard → Check app status (should be running)
- n8n executions → Check recent runs succeeded
- Google Sheet → Spot-check latest data

### Weekly (5 min)
- Railway resource usage → Memory and CPU normal?
- n8n execution history → Failure rate < 5%?
- Knowledge Lake → Sync logs present and recent?

---

## 🚀 Next Steps After First Success

Once workflow 02 is working:

1. **Add more databases** → Update config, add to workflow
2. **Enable workflow 03** → Notion → Knowledge Lake sync
3. **Automate sheet creation** → Import workflow 04
4. **Optimize schedule** → Adjust based on data freshness needs
5. **Setup monitoring** → Add Railway status notifications

---

## 💡 Railway-Specific Pro Tips

1. **Use SAFE workflows initially** → Broader compatibility, easier troubleshooting
2. **Test with 1 database first** → Verify working before scaling
3. **Monitor Railway logs** → Check for memory/CPU issues
4. **Keep sync simple** → Don't sync everything at once
5. **Schedule during low-traffic** → 2am-6am for heavy syncs
6. **Set up Railway alerts** → Get notified of deployment issues

---

## 📞 Getting Help

**If stuck on Railway:**

1. **Check Railway logs first**
   - Railway Dashboard → Your n8n app → Logs
   - Look for errors during workflow execution

2. **Check n8n execution log**
   - n8n UI → Executions → Failed executions
   - Copy error message

3. **Report to CC with details**
   - n8n version: `[from Railway logs]`
   - Railway plan: `free/hobby/pro`
   - Error: `[paste error]`
   - Workflow: `02-SAFE or 02-Standard`

4. **Railway-specific issues**
   - Tag with: "Railway deployment"
   - Include: Resource usage stats
   - Mention: Any Railway alerts received

---

## ⏱️ Estimated Time (Railway)

| Phase | Time | Notes |
|-------|------|-------|
| Compatibility Check | 5 min | One-time |
| Import & Configure | 15 min | Per workflow |
| First Test | 30 min | With troubleshooting buffer |
| Enable Automation | 10 min | One-time |
| **Total First Setup** | **~1 hour** | For 1 database |
| Each Additional DB | 15 min | After first working |

---

## 🎉 Quick Win Goal

**Target for first session:** Get ONE database syncing successfully

✅ Workflow 02-SAFE imported
✅ Master AI System → Google Sheet
✅ Manual test successful
✅ Schedule enabled
✅ First automated run completed

**Everything else can wait!** Once this works, the rest is just repetition.

---

**Last Updated:** 2026-01-09
**Status:** Ready for Railway deployment ✅
**Recommended workflow:** `02-notion-to-drive-sync-SAFE.json`
