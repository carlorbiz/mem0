# 🚨 CC TASK: Fix API Offset Bug + PostgreSQL Architecture Decision

**Priority:** HIGH  
**Created:** 12 January 2026  
**Status:** Ready for implementation

---

## Part 1: Fix the API Offset Bug

### The Problem

The `/api/conversations` endpoint **completely ignores the `offset` parameter**.

```bash
# All three return IDENTICAL results - offset is ignored
curl ".../api/conversations?userId=1&limit=5&offset=0"   → IDs: [2729, 2727, 2728, 2726, 2725]
curl ".../api/conversations?userId=1&limit=5&offset=100" → IDs: [2729, 2727, 2728, 2726, 2725]
curl ".../api/conversations?userId=1&limit=5&offset=500" → IDs: [2729, 2727, 2728, 2726, 2725]
```

### Impact
- Cannot paginate through conversations via API
- Bulk exports broken (same 100 conversations returned repeatedly)
- 24+ hours of Carla's time wasted debugging this

### The Fix

**Location:** `api_server.py` in the Knowledge Lake repo

**Find** the `/api/conversations` GET endpoint. The SQL query is missing OFFSET:

```python
# Current (broken):
query = "SELECT * FROM conversations WHERE user_id = %s ORDER BY id DESC LIMIT %s"
cursor.execute(query, (user_id, limit))

# Fixed - add OFFSET:
query = "SELECT * FROM conversations WHERE user_id = %s ORDER BY id DESC LIMIT %s OFFSET %s"
cursor.execute(query, (user_id, limit, offset))
```

**Important:** The database uses `user_id` (snake_case), not `userId` (camelCase).

### Also Check
- `/api/conversations/search` endpoint - likely has same bug
- Any other endpoints that accept `offset` parameter

### Verification
```bash
# After fix, these should return DIFFERENT IDs:
curl ".../api/conversations?userId=1&limit=5&offset=0"
curl ".../api/conversations?userId=1&limit=5&offset=5"
```

---

## Part 2: Architectural Decision - PostgreSQL Direct Access

### Discovery

While debugging the API, we successfully bypassed it by connecting directly to PostgreSQL:

```
Host: gondola.proxy.rlwy.net
Port: 42273
Database: railway
User: postgres
Password: dbTkhBmeUoLtoMMQHKGduImxwXnjHwkE
```

**Result:** Exported all 2,728 conversations in 30 seconds (vs 24 hours of failed API attempts).

### Recommendation: Hybrid Architecture

| Operation Type | Use | Reason |
|----------------|-----|--------|
| **Bulk export** (1000+ records) | PostgreSQL direct | Fast, reliable, no pagination bugs |
| **Bulk updates/tagging** | PostgreSQL direct | Transaction support, atomic operations |
| **Batch reporting** | PostgreSQL direct | Complex JOINs, aggregations |
| **Single conversation ingest** | API | Simpler, includes mem0 indexing |
| **Real-time search** | API | Semantic search via mem0/Qdrant |
| **MCP tools** | API | Convenience for Claude/Nera |

### Database Schema (Actual)

The database uses **snake_case** column names:

```sql
conversations (
    id              INTEGER PRIMARY KEY,
    agent           TEXT,
    topic           TEXT,
    date            DATE,
    content         TEXT,
    user_id         INTEGER,      -- NOT userId
    created_at      TIMESTAMP,    -- NOT createdAt
    metadata        JSONB
)
```

### Implications for n8n

**Current Problem:**  
n8n workflows using HTTP Request node to call `/api/conversations` will hit the same pagination bug.

**Solutions:**

1. **Fix the API** (this task) - n8n HTTP workflows will work

2. **Add PostgreSQL node to n8n** (recommended for bulk ops):
   - Add credentials: Host, Port, Database, User, Password (above)
   - Use "Postgres" node instead of HTTP Request for:
     - Bulk exports
     - Batch metadata updates
     - Reporting queries
   - Benefits: Faster, more reliable, native pagination via LIMIT/OFFSET

3. **Hybrid approach in n8n:**
   - HTTP Request → API for: ingest, single lookups, semantic search
   - PostgreSQL node → Direct DB for: bulk operations, exports, reports

### Action Items for CC

1. **Fix API offset bug** (30 mins)
   - Update SQL query in `/api/conversations` endpoint
   - Test pagination works
   - Check other endpoints for same bug

2. **Document PostgreSQL access** (15 mins)
   - Add connection details to project README
   - Note snake_case column names
   - Recommend when to use API vs PostgreSQL

3. **Consider n8n PostgreSQL integration** (optional, 30 mins)
   - Add PostgreSQL credentials to n8n
   - Create example workflow for bulk export
   - Document when to use which approach

---

## Verification Checklist

After completing fixes:

- [ ] `/api/conversations?offset=0` returns different data than `offset=100`
- [ ] Can paginate through all 2,728 conversations via API
- [ ] `/api/conversations/search` pagination also works (if applicable)
- [ ] PostgreSQL connection details documented
- [ ] Decision on n8n approach documented

---

## Context

- Knowledge Lake has 2,728 conversations
- Carla is running Gemini tagging on full export right now
- Direct PostgreSQL export (`export_knowledge_lake_direct.py`) is the workaround
- API fix still needed for MCP tools and simpler use cases

---

*Task created by Claude GUI - 12 January 2026*
