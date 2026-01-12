# 🚨 CC URGENT TASK: Fix Knowledge Lake API Offset Bug

**Priority:** CRITICAL - Blocking all batch operations  
**Assigned to:** CC (Claude Code)  
**Created:** 12 January 2026  
**Estimated time:** 30 minutes

---

## The Problem

The `/api/conversations` endpoint **completely ignores the `offset` parameter**.

### Evidence:
```bash
# All three return IDENTICAL results - same IDs!
curl ".../api/conversations?userId=1&limit=5&offset=0"    → IDs: [2729, 2727, 2728, 2726, 2725]
curl ".../api/conversations?userId=1&limit=5&offset=100"  → IDs: [2729, 2727, 2728, 2726, 2725]
curl ".../api/conversations?userId=1&limit=5&offset=500"  → IDs: [2729, 2727, 2728, 2726, 2725]
```

### Impact:
- Cannot paginate through 2,700+ conversations
- Export scripts cycle through same 100 records forever
- Carla wasted 24+ hours on this blocker
- Metadata tagging project completely stalled

---

## The Fix

### Location
`api_server.py` in the Knowledge Lake repo (deployed to Railway)

### Find the conversations list endpoint
Look for something like:
```python
@app.route('/api/conversations', methods=['GET'])
def get_conversations():
```

### Current (BROKEN) Code - likely looks like:
```python
# Offset is ACCEPTED but not USED in query
limit = request.args.get('limit', 100, type=int)
offset = request.args.get('offset', 0, type=int)  # ← Captured but...

query = """
    SELECT * FROM conversations 
    WHERE "userId" = %s 
    ORDER BY id DESC 
    LIMIT %s
"""  # ← ...not used here!
cursor.execute(query, (user_id, limit))
```

### Fixed Code:
```python
limit = request.args.get('limit', 100, type=int)
offset = request.args.get('offset', 0, type=int)

query = """
    SELECT * FROM conversations 
    WHERE "userId" = %s 
    ORDER BY id DESC 
    LIMIT %s OFFSET %s
"""
cursor.execute(query, (user_id, limit, offset))
```

---

## Verification Steps

After deploying the fix:

```bash
# Test 1: First page
curl "https://knowledge-lake-api-production.up.railway.app/api/conversations?userId=1&limit=5&offset=0"
# Should return IDs like: [2729, 2728, 2727, 2726, 2725]

# Test 2: Second page - MUST be DIFFERENT IDs
curl "https://knowledge-lake-api-production.up.railway.app/api/conversations?userId=1&limit=5&offset=5"
# Should return IDs like: [2724, 2723, 2722, 2721, 2720]

# Test 3: Later page
curl "https://knowledge-lake-api-production.up.railway.app/api/conversations?userId=1&limit=5&offset=100"
# Should return IDs in the 2600s range

# If all three return different IDs, the fix is working!
```

---

## Context

- **API Version:** 2.2.0_performance_optimization
- **Railway URL:** https://knowledge-lake-api-production.up.railway.app
- **Total conversations:** 2,728
- **Health endpoint:** Working fine, not affected

---

## After Fixing

1. Push to GitHub → Railway auto-deploys
2. Run verification tests above
3. Notify Carla the API is fixed
4. Ingest to Knowledge Lake:
   ```
   Topic: "COUNCIL UPDATE: Knowledge Lake API Offset Bug Fixed"
   Content: "Fixed the /api/conversations endpoint to properly use OFFSET parameter in SQL query. Pagination now works correctly for batch export operations."
   ```

---

## Additional Context

Carla is using a temporary PostgreSQL direct export to get her data NOW, but the API fix is needed for:
- Future exports
- n8n workflows that paginate
- Any client applications
- The tag-push-back workflow planned for after tagging

**This is a one-line SQL fix. Don't overthink it.**
