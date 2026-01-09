# Dynamic Self-Learning Taxonomy System for Knowledge Lake
## Living Metadata That Evolves With Your Knowledge

**Created:** 2026-01-09
**Status:** Design Complete - Ready for Implementation
**Priority:** CRITICAL - Replaces Static Taxonomy Approach

---

## The Problem With Static Taxonomies

**Original Approach:**
```json
{
  "audienceRoles": ["Practice Manager", "Supervisor", "TPA", "Client", "Management", "Board"]
}
```

**Why This Fails:**
1. ❌ Hardcoded values become outdated immediately
2. ❌ Can't handle new organizations (what about RACGP? AHPRA? NMBA?)
3. ❌ Can't adapt to new business areas (Cancer Care? Mental Health?)
4. ❌ Requires manual updates every time Carla's work expands
5. ❌ Doesn't learn from the 2,460 conversations already in the lake

**The Real Problem:** Your Knowledge Lake spans 8+ months of diverse conversations across healthcare, education, business, technology, personal development. A static taxonomy can't capture that breadth - and won't scale as you expand into new territories.

---

## The Solution: Self-Learning Dynamic Taxonomy

### Core Concept

```
┌─────────────────────────────────────────────────────────────┐
│           GOOGLE SHEETS: Living Taxonomy Registry            │
│                   (Source of Truth)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬────────────────┐
        │             │             │                │
        ▼             ▼             ▼                ▼
   Sheet 1:      Sheet 2:      Sheet 3:        Sheet 4:
   Organizations  Audience     Business        Topic
                  Roles        Domains         Tags
        │             │             │                │
        └─────────────┴─────────────┴────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │    n8n Workflow: Metadata Extractor  │
        │  (Reads current taxonomy from Sheets) │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │   LLM: Analyze Conversation          │
        │   - Extract metadata                 │
        │   - Propose NEW values if needed     │
        └─────────────┬───────────────────────┘
                      │
            ┌─────────┴─────────┐
            │                   │
            ▼                   ▼
    Known Values          NEW Values
    (Apply directly)      (Add to Sheets)
            │                   │
            └─────────┬─────────┘
                      ▼
        ┌─────────────────────────────────────┐
        │   Updated Taxonomy in Google Sheets  │
        │   (Available for next extraction)    │
        └─────────────────────────────────────┘
```

**Key Innovation:** The system LEARNS new metadata values from conversations and adds them to the taxonomy automatically.

---

## Google Sheets Structure: Living Taxonomy Registry

### Sheet 1: Organizations

**URL:** `https://docs.google.com/spreadsheets/d/[ID]/edit#gid=0`

**Columns:**

| Organization Name | Business Domain | First Seen | Usage Count | Status | Notes |
|-------------------|-----------------|------------|-------------|--------|-------|
| ACRRM | Healthcare | 2025-05-12 | 247 | Active | Australian College of Rural & Remote Medicine |
| RACGP | Healthcare | 2025-06-03 | 89 | Active | Royal Australian College of GPs |
| MTMOT | Education | 2025-07-15 | 412 | Active | Mastermind Hub |
| AHPRA | Healthcare | 2025-08-20 | 34 | Active | Australian Health Practitioner Regulation Agency |
| NMBA | Healthcare | 2025-08-20 | 28 | Active | Nursing and Midwifery Board of Australia |
| GPSA | Healthcare | 2025-09-10 | 156 | Active | General Practice Supervisors Australia |
| CARLORBIZ | Business | 2025-05-01 | 89 | Active | Carla's consulting business |

**Purpose:**
- Track ALL organizations mentioned in conversations
- Auto-populate when new org detected
- Usage count helps prioritize common orgs
- Status allows deprecation (e.g., "Archived" for old clients)

### Sheet 2: Audience Roles

**Columns:**

| Role Name | Business Domain | Organization | First Seen | Usage Count | Description | Example Query |
|-----------|-----------------|--------------|------------|-------------|-------------|---------------|
| Practice Manager | Healthcare | ACRRM | 2025-05-12 | 143 | Day-to-day operations | Compliance, rostering |
| Supervisor | Healthcare | ACRRM, RACGP | 2025-05-15 | 98 | Training oversight | Supervision requirements |
| TPA | Healthcare | ACRRM | 2025-06-01 | 45 | Practice advisory | Accreditation guidance |
| Client | Healthcare | ACRRM | 2025-07-10 | 12 | Patients/trainees | Patient-facing info |
| Management | Healthcare | ACRRM, GPSA | 2025-05-12 | 89 | Senior leadership | Strategic planning |
| Board | Healthcare | ACRRM | 2025-08-03 | 23 | Governance | Policy decisions |
| Executive Coach | Education | MTMOT | 2025-07-20 | 67 | 1-on-1 coaching | Leadership development |
| Course Creator | Education | MTMOT | 2025-08-01 | 134 | Course development | Instructional design |
| Student | Education | MTMOT | 2025-08-05 | 89 | Learner | Course consumption |

**Purpose:**
- Dynamic role catalog that grows with usage
- Organization-specific roles (ACRRM Practice Manager ≠ RACGP Practice Manager)
- Descriptions help LLM understand when to apply each role

### Sheet 3: Business Domains & Subdomains

**Columns:**

| Domain | Subdomain | First Seen | Usage Count | Keywords | Example Organizations |
|--------|-----------|------------|-------------|----------|---------------------|
| Healthcare | Primary Care | 2025-05-12 | 456 | GP, general practice, rural health | ACRRM, RACGP |
| Healthcare | Allied Health | 2025-06-20 | 234 | physio, OT, nutrition, NDIS | GPSA, HPSA |
| Healthcare | Mental Health | 2025-07-15 | 123 | psychology, psychiatry, counseling | - |
| Healthcare | Research | 2025-08-10 | 67 | clinical trials, evidence, cancer | - |
| Healthcare | Administration | 2025-05-12 | 189 | practice management, compliance, accreditation | ACRRM, RACGP |
| Education | Course Development | 2025-07-15 | 312 | instructional design, modules, learning | MTMOT |
| Education | Coaching | 2025-07-20 | 198 | executive coaching, leadership | MTMOT |
| Education | Course Delivery | 2025-08-01 | 145 | student engagement, assessments | MTMOT |
| Business | Strategy | 2025-05-01 | 234 | planning, market analysis, growth | CARLORBIZ |
| Business | Operations | 2025-06-10 | 167 | process optimization, workflows | CARLORBIZ |
| Business | Commercial | 2025-09-05 | 89 | sales, partnerships, revenue | CARLORBIZ |
| Technology | Development | 2025-05-15 | 401 | AAE, apps, PWAs, coding | - |
| Technology | Infrastructure | 2025-06-20 | 178 | servers, databases, APIs, Railway | - |
| Technology | AI/ML | 2025-07-01 | 289 | LLMs, automation, agents, Nera | - |
| Personal | Health | 2025-08-15 | 45 | personal health journey, recovery | - |
| Personal | Development | 2025-09-01 | 67 | personal growth, identity | - |
| Personal | Recovery | 2025-09-10 | 34 | executive recovery, resilience | - |

**Purpose:**
- Hierarchical domain structure that expands automatically
- Keywords help LLM classify content
- Usage count tracks which domains are most active

### Sheet 4: Topic Tags (Dynamic)

**Columns:**

| Tag Name | Domain | Subdomain | First Seen | Usage Count | Related Tags |
|----------|--------|-----------|------------|-------------|--------------|
| Practice Management | Healthcare | Administration | 2025-05-12 | 234 | Compliance, Rostering, Operations |
| Compliance | Healthcare | Administration | 2025-05-12 | 198 | ACRRM Standards, Accreditation |
| ACRRM Standards | Healthcare | Primary Care | 2025-05-12 | 156 | Compliance, Practice Management |
| Supervision Requirements | Healthcare | Primary Care | 2025-05-15 | 89 | Training, Assessment, ACRRM |
| Course Architecture | Education | Course Development | 2025-07-15 | 123 | Instructional Design, Modules |
| Leadership Development | Education | Coaching | 2025-07-20 | 167 | Executive Coaching, Mindset |
| Knowledge Lake | Technology | AI/ML | 2025-05-15 | 312 | AAE, Qdrant, Semantic Search |
| n8n Workflows | Technology | Infrastructure | 2025-06-20 | 234 | Automation, AAE, Orchestration |
| Identity Reconstruction | Personal | Recovery | 2025-09-10 | 34 | Executive Recovery, Resilience |

**Purpose:**
- Unbounded tag system that grows organically
- Related tags help with semantic expansion
- Domain/subdomain context ensures precision

### Sheet 5: Content Types

**Columns:**

| Content Type | Description | First Seen | Usage Count | Typical Domains |
|--------------|-------------|------------|-------------|----------------|
| Requirements | Specs, standards, compliance | 2025-05-12 | 167 | Healthcare, Business |
| Discussion | Conversational exploration | 2025-05-01 | 823 | All |
| Decision | Architectural/strategic choice | 2025-05-15 | 234 | Technology, Business |
| Planning | Roadmaps, timelines, projects | 2025-06-01 | 198 | Business, Education |
| Research | Evidence, literature, findings | 2025-08-10 | 89 | Healthcare, Education |
| Course Content | Educational materials | 2025-07-15 | 267 | Education |
| Technical Documentation | Code, APIs, architecture | 2025-05-15 | 312 | Technology |
| Personal Reflection | Journaling, insights | 2025-09-01 | 67 | Personal |

---

## n8n Workflow: Dynamic Metadata Extractor

### Workflow Architecture

```
[1. Get Conversation]
       ↓
[2. Load Current Taxonomy from Google Sheets]
       ↓
[3. LLM Analysis with Dynamic Taxonomy]
       ↓
[4. Detect New Values]
       ↓
    ┌──┴──┐
    ↓     ↓
[5a. Apply    [5b. Add New
 Known Values]     Values to Sheets]
    │          ↓
    │     [Human Review
    │      if needed]
    │          ↓
    └──────┬───┘
           ↓
[6. Update Conversation Metadata]
       ↓
[7. Distribute to Topic Layer]
```

### Node 1: Get Conversation

**Input:** Conversation ID or content

**Output:**
```json
{
  "id": 2800,
  "topic": "ACRRM Practice Manager Compliance Requirements",
  "content": "...",
  "date": "2026-01-09",
  "agent": "Claude",
  "existingMetadata": {...}
}
```

### Node 2: Load Current Taxonomy from Google Sheets

**Google Sheets Nodes (5 parallel calls):**

```javascript
// Sheet 1: Organizations
GET https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/Organizations!A2:G

// Sheet 2: Audience Roles
GET .../values/AudienceRoles!A2:G

// Sheet 3: Business Domains
GET .../values/BusinessDomains!A2:F

// Sheet 4: Topic Tags
GET .../values/TopicTags!A2:F

// Sheet 5: Content Types
GET .../values/ContentTypes!A2:E
```

**Function Node: Parse into Lookup Objects**
```javascript
const taxonomy = {
  organizations: [],
  audienceRoles: [],
  businessDomains: [],
  topicTags: [],
  contentTypes: []
};

// Parse organizations sheet
const orgSheet = $('Google Sheets - Organizations').all();
taxonomy.organizations = orgSheet.map(row => ({
  name: row.json[0],
  domain: row.json[1],
  usageCount: parseInt(row.json[3]),
  status: row.json[4]
})).filter(org => org.status === 'Active');

// Parse audience roles sheet
const rolesSheet = $('Google Sheets - Audience Roles').all();
taxonomy.audienceRoles = rolesSheet.map(row => ({
  name: row.json[0],
  domain: row.json[1],
  organization: row.json[2],
  usageCount: parseInt(row.json[4]),
  description: row.json[5]
}));

// Parse business domains sheet
const domainsSheet = $('Google Sheets - Business Domains').all();
taxonomy.businessDomains = domainsSheet.map(row => ({
  domain: row.json[0],
  subdomain: row.json[1],
  usageCount: parseInt(row.json[3]),
  keywords: row.json[4].split(',').map(k => k.trim())
}));

// Parse topic tags sheet
const tagsSheet = $('Google Sheets - Topic Tags').all();
taxonomy.topicTags = tagsSheet.map(row => ({
  name: row.json[0],
  domain: row.json[1],
  subdomain: row.json[2],
  usageCount: parseInt(row.json[4]),
  relatedTags: row.json[5].split(',').map(t => t.trim())
}));

// Parse content types sheet
const typesSheet = $('Google Sheets - Content Types').all();
taxonomy.contentTypes = typesSheet.map(row => ({
  name: row.json[0],
  description: row.json[1],
  usageCount: parseInt(row.json[3]),
  typicalDomains: row.json[4].split(',').map(d => d.trim())
}));

return { taxonomy };
```

**Output:**
```json
{
  "taxonomy": {
    "organizations": [
      {"name": "ACRRM", "domain": "Healthcare", "usageCount": 247},
      {"name": "MTMOT", "domain": "Education", "usageCount": 412}
    ],
    "audienceRoles": [
      {"name": "Practice Manager", "domain": "Healthcare", "organization": "ACRRM", "description": "Day-to-day operations"},
      {"name": "Supervisor", "domain": "Healthcare", "organization": "ACRRM, RACGP"}
    ],
    "businessDomains": [
      {"domain": "Healthcare", "subdomain": "Primary Care", "keywords": ["GP", "general practice"]}
    ],
    "topicTags": [...],
    "contentTypes": [...]
  }
}
```

### Node 3: LLM Analysis with Dynamic Taxonomy

**Agent:** Simon (strat, claude) via FredCast routing

**Prompt:**
```
You are analyzing a conversation to extract multi-dimensional metadata.

CONVERSATION:
Topic: {{topic}}
Content: {{content}}
Date: {{date}}
Agent: {{agent}}

CURRENT TAXONOMY (from Google Sheets):

KNOWN ORGANIZATIONS:
{{taxonomy.organizations.map(o => `- ${o.name} (${o.domain})`).join('\n')}}

KNOWN AUDIENCE ROLES:
{{taxonomy.audienceRoles.map(r => `- ${r.name} (${r.domain}, ${r.organization}): ${r.description}`).join('\n')}}

KNOWN BUSINESS DOMAINS:
{{taxonomy.businessDomains.map(d => `- ${d.domain} > ${d.subdomain} [keywords: ${d.keywords.join(', ')}]`).join('\n')}}

KNOWN TOPIC TAGS:
{{taxonomy.topicTags.map(t => t.name).join(', ')}}

KNOWN CONTENT TYPES:
{{taxonomy.contentTypes.map(c => `- ${c.name}: ${c.description}`).join('\n')}}

---

TASK:
Extract metadata using the KNOWN values above when possible.
If the conversation mentions NEW values not in the taxonomy, propose them.

Return JSON in this format:
{
  "metadata": {
    "businessDomain": "Healthcare",  // Use KNOWN value or propose NEW
    "businessSubdomain": "Primary Care",  // Use KNOWN value or propose NEW
    "organization": "ACRRM",  // Use KNOWN value or propose NEW
    "contentType": "Requirements",  // Use KNOWN value or propose NEW
    "contentFormat": "Discussion",
    "deliverableType": null,
    "audienceRoles": ["Practice Manager", "Supervisor"],  // Use KNOWN values or propose NEW
    "audienceLevel": "Professional",
    "audienceSector": "Rural Health",
    "topicTags": ["Practice Management", "Compliance"],  // Use KNOWN values or propose NEW
    "useCase": "Compliance Planning",
    "actionable": true,
    "priority": "HIGH",
    "relatedOrganizations": ["ACRRM", "RACGP"],
    "relatedProducts": [],
    "relatedProjects": ["CareTrack"]
  },
  "newValues": {
    "organizations": [],  // Propose NEW organizations found in conversation
    "audienceRoles": [],  // Propose NEW audience roles not in taxonomy
    "businessDomains": [],  // Propose NEW domain/subdomain combinations
    "topicTags": [],  // Propose NEW topic tags
    "contentTypes": []  // Propose NEW content types
  },
  "confidence": "HIGH|MEDIUM|LOW"
}

IMPORTANT RULES:
1. PREFER KNOWN VALUES from the taxonomy
2. Only propose NEW values if conversation clearly introduces something not covered
3. For NEW values, provide justification:
   - newValues.organizations: [{"name": "AHPRA", "domain": "Healthcare", "reason": "Australian health regulator mentioned frequently"}]
4. Be comprehensive with audienceRoles array - include ALL relevant roles
5. Ensure semantic precision
```

**Output Example:**
```json
{
  "metadata": {
    "businessDomain": "Healthcare",
    "businessSubdomain": "Primary Care",
    "organization": "ACRRM",
    "contentType": "Requirements",
    "audienceRoles": ["Practice Manager", "Supervisor", "Management"],
    "topicTags": ["Practice Management", "Compliance", "ACRRM Standards"]
  },
  "newValues": {
    "organizations": [],  // All known
    "audienceRoles": [],  // All known
    "businessDomains": [],  // All known
    "topicTags": [
      {
        "name": "Telehealth Integration",
        "domain": "Healthcare",
        "subdomain": "Primary Care",
        "reason": "Conversation discusses new telehealth requirements for rural practices"
      }
    ],
    "contentTypes": []
  },
  "confidence": "HIGH"
}
```

### Node 4: Detect New Values

**IF Node:** Check if `newValues` has any arrays with length > 0

**Switch Node:**
- Route A: No new values → Go to Node 6 (apply metadata)
- Route B: New values detected → Go to Node 5b (add to sheets)

### Node 5a: Apply Known Values (Parallel to 5b)

**Function Node:** Add computed fields
```javascript
const metadata = $json.metadata;

// Calculate topic layer assignment
const primaryLayer = metadata.businessDomain;
let subLayer = metadata.businessSubdomain;
if (metadata.organization) {
  subLayer = `${subLayer}-${metadata.organization}`;
}
const microLayer = metadata.topicTags[0] || 'General';
const qdrantCollection = `layer_${primaryLayer.toLowerCase()}_${subLayer.toLowerCase().replace(/[\s-]+/g, '_')}`;

metadata.topicLayer = primaryLayer;
metadata.topicSubLayer = subLayer;
metadata.topicMicroLayer = microLayer;
metadata.qdrantCollection = qdrantCollection;
metadata.processingDate = new Date().toISOString();
metadata.metadataVersion = "2.0_dynamic_taxonomy";
metadata.processingAgent = "Simon-Strategic-Analyzer";

return { metadata };
```

### Node 5b: Add New Values to Google Sheets

**For Each New Value Type:**

#### Add New Organizations
```javascript
// IF newValues.organizations.length > 0
const newOrgs = $json.newValues.organizations;

for (const org of newOrgs) {
  // Append to Organizations sheet
  await GoogleSheets.append({
    spreadsheetId: TAXONOMY_SHEET_ID,
    range: 'Organizations!A:G',
    values: [[
      org.name,
      org.domain,
      new Date().toISOString().split('T')[0],  // First Seen
      1,  // Usage Count
      'Active',  // Status
      org.reason  // Notes
    ]]
  });
}
```

#### Add New Audience Roles
```javascript
// IF newValues.audienceRoles.length > 0
const newRoles = $json.newValues.audienceRoles;

for (const role of newRoles) {
  await GoogleSheets.append({
    spreadsheetId: TAXONOMY_SHEET_ID,
    range: 'AudienceRoles!A:G',
    values: [[
      role.name,
      role.domain,
      role.organization || '',
      new Date().toISOString().split('T')[0],
      1,  // Usage Count
      role.description || role.reason,
      role.exampleQuery || ''
    ]]
  });
}
```

#### Add New Topic Tags
```javascript
// IF newValues.topicTags.length > 0
const newTags = $json.newValues.topicTags;

for (const tag of newTags) {
  await GoogleSheets.append({
    spreadsheetId: TAXONOMY_SHEET_ID,
    range: 'TopicTags!A:F',
    values: [[
      tag.name,
      tag.domain,
      tag.subdomain,
      new Date().toISOString().split('T')[0],
      1,  // Usage Count
      tag.relatedTags || ''
    ]]
  });
}
```

#### Update Usage Counts for Existing Values

**Google Sheets Batch Update:**
```javascript
// For each metadata value used, increment its usage count in the sheet
const valuesToUpdate = [
  { sheet: 'Organizations', name: metadata.organization },
  { sheet: 'ContentTypes', name: metadata.contentType },
  ...metadata.audienceRoles.map(r => ({ sheet: 'AudienceRoles', name: r })),
  ...metadata.topicTags.map(t => ({ sheet: 'TopicTags', name: t }))
];

// Find row for each value and increment usage count
// (Implementation depends on Google Sheets capabilities)
```

#### Notification: New Values Added

**Slack/Email Node:**
```
🆕 New Taxonomy Values Added

Conversation: {{topic}} (ID: {{id}})

New Organizations: {{newValues.organizations.map(o => o.name).join(', ')}}
New Audience Roles: {{newValues.audienceRoles.map(r => r.name).join(', ')}}
New Topic Tags: {{newValues.topicTags.map(t => t.name).join(', ')}}

These values are now available in the taxonomy for future extractions.

[Review in Google Sheets] [Review Conversation]
```

### Node 6: Update Knowledge Lake Conversation

**HTTP Request:**
```
PATCH https://knowledge-lake-api-production.up.railway.app/api/conversations/{{id}}/metadata

Body:
{
  "metadata": {{metadata}}
}
```

### Node 7: Distribute to Topic Layer

**HTTP Request:**
```
POST https://knowledge-lake-api-production.up.railway.app/api/layers/{{metadata.qdrantCollection}}/add

Body:
{
  "conversationId": {{id}},
  "metadata": {{metadata}}
}
```

---

## Human Review Workflow (Optional Enhancement)

### When to Trigger Human Review:

**IF Node Conditions:**
1. `confidence === "LOW"` (LLM unsure of extraction)
2. `newValues.organizations.length > 0` (new organization detected)
3. `newValues.businessDomains.length > 0` (new domain/subdomain)
4. `priority === "CRITICAL"` (high-stakes content)

**Notion Task Creation:**
```
Database: Knowledge Lake Processing Review
Properties:
  - Conversation ID: {{id}}
  - Topic: {{topic}}
  - Status: 🔍 Review Required
  - Reason: {{reason}}
  - New Values Proposed: {{JSON.stringify(newValues)}}
  - Confidence: {{confidence}}
  - Assigned To: Carla / Manus
  - Due Date: +24 hours

Description:
  LLM proposed new taxonomy values for this conversation.
  Please review and approve/modify:

  **New Organizations:**
  {{newValues.organizations}}

  **New Audience Roles:**
  {{newValues.audienceRoles}}

  **Extracted Metadata:**
  {{metadata}}

  [View Conversation] [Edit in Google Sheets] [Approve] [Reject]
```

---

## Advantages of Dynamic Taxonomy

### 1. Self-Evolving Knowledge System
```
Week 1: 50 organizations, 80 roles, 200 tags
       ↓
Week 4: 75 organizations, 120 roles, 450 tags
       ↓
Week 12: 150 organizations, 250 roles, 1,200 tags
```

**The system learns from itself** - no manual taxonomy updates required.

### 2. Handles Breadth AND Depth

**Breadth:** New domains automatically discovered
- Healthcare → Primary Care → ACRRM
- Healthcare → Mental Health → Psychology (NEW)
- Healthcare → Allied Health → Physio (NEW)
- Technology → Blockchain → Web3 (NEW, if Carla explores that)

**Depth:** Organization-specific nuance
- ACRRM roles vs RACGP roles
- MTMOT courses vs external courses
- Carla's consulting vs client work

### 3. Usage-Weighted Relevance

Google Sheets tracks usage count → common values rank higher in LLM prompts:

```
When extracting metadata, consider these most common organizations:
1. MTMOT (412 conversations)
2. ACRRM (247 conversations)
3. GPSA (156 conversations)
...
```

LLM prioritizes likely matches, improving accuracy.

### 4. Audit Trail & Analytics

**Every new value has:**
- First Seen date
- Usage count
- Originating conversation

**Analytics queries:**
```sql
SELECT organization, COUNT(*) as mentions
FROM Organizations
WHERE domain = 'Healthcare'
ORDER BY mentions DESC;

-- What healthcare organizations does Carla work with most?
```

```sql
SELECT topicTag, domain, usageCount
FROM TopicTags
WHERE first_seen >= '2025-12-01'
ORDER BY usageCount DESC;

-- What new topics emerged in December?
```

### 5. Claude/Manus Can Curate Taxonomy

**Workflow: Weekly Taxonomy Cleanup**

**Trigger:** Scheduled (every Sunday)

**Process:**
1. Claude queries Google Sheets for low-usage values (< 3 mentions)
2. Analyzes if they're duplicates/typos
3. Proposes consolidation:
   - "Practice Mgr" → "Practice Manager"
   - "ACCRM" → "ACRRM" (typo)
4. Creates Notion task for approval
5. Batch update after approval

**Result:** Clean, deduplicated taxonomy without manual maintenance

---

## Implementation Checklist

### Phase 1: Google Sheets Setup
- [ ] Create "AAE Taxonomy Registry" Google Sheets
- [ ] Set up 5 sheets: Organizations, Audience Roles, Business Domains, Topic Tags, Content Types
- [ ] Add column headers and validation rules
- [ ] Share with n8n service account (edit permissions)
- [ ] Seed with initial values from current Knowledge Lake sample

### Phase 2: n8n Workflow Build
- [ ] Build Dynamic Metadata Extractor workflow
- [ ] Add Google Sheets read nodes (5 parallel)
- [ ] Build LLM prompt with dynamic taxonomy injection
- [ ] Add new value detection logic
- [ ] Build Google Sheets append nodes
- [ ] Add usage count increment logic
- [ ] Test with 10 sample conversations

### Phase 3: Human Review Integration
- [ ] Build Notion review task creation
- [ ] Add approval/rejection webhook endpoints
- [ ] Build Slack notification for new values
- [ ] Test review workflow

### Phase 4: Bulk Backfill
- [ ] Run on first 100 conversations
- [ ] Review taxonomy growth (how many new values?)
- [ ] Refine LLM prompts based on accuracy
- [ ] Process remaining 2,360 conversations in batches

### Phase 5: Maintenance Automation
- [ ] Build weekly taxonomy cleanup workflow (Claude/Manus)
- [ ] Add analytics dashboard in Google Sheets
- [ ] Set up monitoring for taxonomy growth rate
- [ ] Document taxonomy curation guidelines

---

## Example: How It Evolves

### Conversation 1 (May 2025): ACRRM Discussion

**Extracted Metadata:**
```json
{
  "organization": "ACRRM",
  "audienceRoles": ["Practice Manager", "Supervisor"],
  "topicTags": ["Practice Management", "Compliance"]
}
```

**Added to Sheets:**
- Organizations: ACRRM (NEW)
- Audience Roles: Practice Manager (NEW), Supervisor (NEW)
- Topic Tags: Practice Management (NEW), Compliance (NEW)

### Conversation 500 (August 2025): New Mental Health Work

**Extracted Metadata:**
```json
{
  "businessDomain": "Healthcare",
  "businessSubdomain": "Mental Health",  // NEW subdomain
  "organization": "RACGP",  // NEW organization
  "audienceRoles": ["Psychologist", "GP"],  // Psychologist is NEW
  "topicTags": ["Mental Health Assessment", "Therapy"]  // Both NEW
}
```

**Added to Sheets:**
- Business Domains: Healthcare > Mental Health (NEW subdomain)
- Organizations: RACGP (NEW)
- Audience Roles: Psychologist (NEW)
- Topic Tags: Mental Health Assessment (NEW), Therapy (NEW)

### Conversation 1200 (November 2025): AAE Development

**Extracted Metadata:**
```json
{
  "businessDomain": "Technology",
  "businessSubdomain": "Development",
  "organization": null,
  "audienceRoles": ["Developer"],  // NEW
  "topicTags": ["Knowledge Lake", "n8n", "AAE"]  // All NEW
}
```

**Added to Sheets:**
- Audience Roles: Developer (NEW)
- Topic Tags: Knowledge Lake (NEW), n8n (NEW), AAE (NEW)

### Conversation 2800 (January 2026): Same ACRRM Discussion

**Extracted Metadata:**
```json
{
  "organization": "ACRRM",  // KNOWN (usage count: 247 → 248)
  "audienceRoles": ["Practice Manager", "Supervisor"],  // KNOWN
  "topicTags": ["Practice Management", "Compliance"]  // KNOWN
}
```

**No new values added** - system recognizes known entities and increments usage counts.

---

## Success Metrics

### Taxonomy Growth
- ✅ Grows organically with Knowledge Lake content
- ✅ 0 manual taxonomy updates required
- ✅ New domains/orgs/roles added automatically

### Semantic Precision
- ✅ Zero false matches (ACRRM ≠ Cancer Research)
- ✅ Multi-role support (Practice Manager + Supervisor + TPA)
- ✅ Organization-specific context (ACRRM Supervisor ≠ RACGP Supervisor)

### Maintenance Efficiency
- ✅ Automated cleanup by Claude/Manus
- ✅ Usage-weighted relevance (common values prioritized)
- ✅ Audit trail for all taxonomy changes

### Scalability
- ✅ Handles 2,460 conversations now
- ✅ Scales to 10,000+ conversations
- ✅ Adapts to new business areas automatically

---

## Why This Solves Carla's Concern

**Carla's Concern:**
> "It's far too restrictive and won't work for Nera's future (or current) purposes"

**How Dynamic Taxonomy Solves This:**

1. **Not Restrictive:** System learns new values from every conversation
2. **Future-Proof:** As Carla explores new territories, taxonomy expands automatically
3. **Current Breadth:** Handles 8+ months of diverse conversations across healthcare, education, business, tech, personal
4. **Nera-Ready:** When Nera queries, she gets precise results using up-to-date taxonomy
5. **Low Maintenance:** Claude/Manus curate taxonomy, Carla approves/rejects, no manual categorization

**The Knowledge Lake becomes self-aware of its own content** - exactly what an AI-native system should be.

---

## Next Steps

1. **Create Google Sheets** - AAE Taxonomy Registry with 5 sheets
2. **Seed Initial Values** - Import from current Knowledge Lake sample
3. **Build n8n Workflow** - Dynamic Metadata Extractor
4. **Test with 10 conversations** - Validate taxonomy growth
5. **Run backfill on 2,460 conversations** - Let system learn from existing content
6. **Monitor & Refine** - Watch taxonomy evolve, adjust LLM prompts as needed

**Estimated Setup Time:** 4-6 hours (one-time)
**Ongoing Maintenance:** ~30 min/week (reviewing new values)

Ready to build the self-learning Knowledge Lake?
