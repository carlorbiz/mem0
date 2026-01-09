# Knowledge Lake Metadata Intelligence System
## Multi-Dimensional Tagging for Precise Semantic Retrieval

**Created:** 2026-01-09
**Updated:** 2026-01-09 - Superseded by Dynamic Taxonomy System
**Status:** ⚠️ DEPRECATED - See N8N_DYNAMIC_TAXONOMY_SYSTEM.md for Implementation
**Priority:** CRITICAL - Enables Topic Layer Architecture

---

## ⚠️ IMPORTANT UPDATE

This document has been **superseded by the Dynamic Taxonomy System**.

**Why:** Static taxonomies (hardcoded in workflows) don't scale for Carla's breadth of work across healthcare, education, business, technology, and personal domains. The Knowledge Lake needs to learn new categories automatically as conversations expand into new territories.

**New Approach:** [N8N_DYNAMIC_TAXONOMY_SYSTEM.md](N8N_DYNAMIC_TAXONOMY_SYSTEM.md)
- Taxonomy stored in **Google Sheets** (living source of truth)
- n8n workflows **read current taxonomy** from sheets
- LLM **proposes new values** when analyzing conversations
- New values **automatically added** to taxonomy
- System **self-learns** from 2,460 conversations

**Use This Document For:** Understanding metadata schema structure and semantic precision concepts

**Use Dynamic Taxonomy System For:** Actual n8n workflow implementation

---

## The Problem: Single-Dimension Tagging Causes False Matches

**Current State:**
```json
{
  "businessArea": "Healthcare"
}
```

**Query Problem:**
```
User asks Nera: "Show me ACRRM Practice Manager requirements"
    ↓
Searches businessArea: "Healthcare"
    ↓
Returns: ACRRM + Cancer Research + GPSA + Clinical Notes
    ❌ FALSE MATCHES - Too broad!
```

**What We Need:**
```
User asks Nera: "Show me ACRRM Practice Manager requirements"
    ↓
Searches:
    - domain: "Healthcare"
    - subdomain: "Primary Care"
    - organization: "ACRRM"
    - contentType: "Requirements"
    - audience: "Practice Managers"
    ↓
Returns: ONLY ACRRM Practice Manager content
    ✅ PRECISE MATCH
```

---

## Multi-Dimensional Metadata Schema

### Core Metadata Structure

```json
{
  "conversationId": 2800,
  "topic": "ACRRM Practice Manager Compliance Requirements",
  "content": "...",

  "metadata": {
    // DIMENSION 1: Business Domain (Primary Classification)
    "businessDomain": "Healthcare",
    "businessSubdomain": "Primary Care",
    "organization": "ACRRM",

    // DIMENSION 2: Content Type (What kind of content)
    "contentType": "Requirements",
    "contentFormat": "Discussion",
    "deliverableType": null,

    // DIMENSION 3: Audience (Who is this for) - ARRAY to support multiple roles
    "audienceRoles": [
      "Practice Manager",
      "Supervisor",
      "Management"
    ],
    "audienceLevel": "Professional",
    "audienceSector": "Rural Health",

    // DIMENSION 4: Topic Specificity (Semantic tags)
    "topicTags": [
      "Practice Management",
      "Compliance",
      "ACRRM Standards",
      "Administrative"
    ],

    // DIMENSION 5: Use Case (Why/How it's used)
    "useCase": "Compliance Planning",
    "actionable": true,
    "priority": "HIGH",

    // DIMENSION 6: Source & Processing
    "appSource": null,
    "processingAgent": "Claude",
    "ingestionDate": "2026-01-09",

    // DIMENSION 7: Topic Layer Assignment (Auto-calculated)
    "topicLayer": "Healthcare",
    "topicSubLayer": "ACRRM-Primary-Care",

    // DIMENSION 8: Relationships (What else is this related to)
    "relatedOrganizations": ["ACRRM", "RACGP"],
    "relatedProducts": [],
    "relatedProjects": ["CareTrack"]
  }
}
```

---

## Metadata Taxonomy: Complete Value Sets

⚠️ **NOTE:** These taxonomies are **examples for schema design**. In production, use the **Dynamic Taxonomy System** which stores values in Google Sheets and grows automatically.

See [N8N_DYNAMIC_TAXONOMY_SYSTEM.md](N8N_DYNAMIC_TAXONOMY_SYSTEM.md) for implementation.

### DIMENSION 1: Business Domain

| businessDomain | businessSubdomain | Example Use Cases |
|----------------|-------------------|-------------------|
| Healthcare | Primary Care | ACRRM, RACGP, GP consulting |
| Healthcare | Specialist Care | Oncology, cardiology |
| Healthcare | Allied Health | Physio, OT, nutrition |
| Healthcare | Mental Health | Psychology, psychiatry, counseling |
| Healthcare | Administration | Practice management, compliance |
| Healthcare | Research | Clinical trials, evidence synthesis |
| Education | Course Development | MTMOT courses, learning design |
| Education | Course Delivery | Student engagement, assessments |
| Education | Coaching | Executive coaching, leadership |
| Business | Strategy | Business planning, market analysis |
| Business | Operations | Process optimization, workflows |
| Business | Commercial | Sales, partnerships, revenue |
| Technology | Development | AAE, apps, PWAs |
| Technology | Infrastructure | Servers, databases, APIs |
| Technology | AI/ML | LLMs, automation, agents |
| Personal | Health | Personal health journeys |
| Personal | Development | Personal growth, identity |
| Personal | Recovery | Executive recovery, resilience |

### DIMENSION 2: Content Type

| contentType | Description | Example |
|-------------|-------------|---------|
| Requirements | Specifications, standards, compliance | ACRRM practice standards |
| Discussion | Conversational exploration | Strategic planning chat |
| Decision | Architectural or strategic decision | "We chose HeyGen over Speechify" |
| Planning | Roadmaps, timelines, project plans | Q1 2026 launch plan |
| Research | Evidence, literature, findings | Felix research synthesis |
| Course Content | Educational materials | Module scripts, activities |
| Technical Documentation | Code, APIs, architecture | Knowledge Lake API docs |
| Personal Reflection | Journaling, insights | Executive recovery journal |
| Creative Work | Marketing, branding, storytelling | Course marketing copy |
| Administrative | Tasks, processes, logistics | Notion database setup |

### DIMENSION 3: Audience (Multi-Role Support)

**IMPORTANT:** `audienceRoles` is an ARRAY - content can serve multiple roles simultaneously.

#### ACRRM-Specific Roles
| audienceRole | Description | Example Use Case |
|--------------|-------------|------------------|
| Practice Manager | Day-to-day operations | Compliance implementation, staff rostering |
| Supervisor | Oversees training | Supervision requirements, trainee assessment |
| Training Practice Advisor (TPA) | Advises practices | Best practice guidance, accreditation prep |
| Client | ACRRM patients/trainees | Patient-facing info, trainee resources |
| Management | Senior leadership | Strategic planning, budget approval |
| Board | Governance | Policy decisions, risk oversight |

#### General Healthcare Roles
| audienceRole | audienceLevel | audienceSector |
|--------------|---------------|----------------|
| GP/Doctor | Professional | Primary Care |
| Nurse | Professional | Clinical |
| Allied Health Professional | Professional | Allied Health |
| Specialist | Professional | Specialist Care |
| Healthcare Administrator | Professional | Administration |

#### Other Domains
| audienceRole | audienceLevel | audienceSector |
|--------------|---------------|----------------|
| Executive | Senior | Leadership |
| Coach | Professional | Coaching |
| Student/Learner | Learning | Education |
| Developer | Technical | Technology |
| Researcher | Academic | Research |
| Business Owner | Strategic | Business |
| Marketing Professional | Professional | Marketing |
| Operations Manager | Professional | Operations |

### DIMENSION 4: Topic Tags

**Dynamic array - extracted from content analysis**

Examples:
- Healthcare: `["Practice Management", "Compliance", "ACRRM", "Rural Health"]`
- Course: `["Leadership Development", "AI Learning", "Executive Coaching"]`
- AAE: `["Knowledge Lake", "n8n Workflows", "MCP Servers"]`
- Personal: `["Identity Reconstruction", "Health Crisis Recovery", "Resilience"]`

### DIMENSION 5: Use Case

| useCase | Description |
|---------|-------------|
| Compliance Planning | Meeting regulatory requirements |
| Course Creation | Building educational content |
| Strategic Planning | Business/product strategy |
| Technical Implementation | Building systems/features |
| Content Marketing | Promotional materials |
| Personal Development | Self-improvement, recovery |
| Research Synthesis | Evidence gathering and analysis |
| Workflow Automation | Process optimization |
| Client Consultation | Professional advice/services |

---

## Topic Layer Routing Logic

### Proposed Topic Layers (Refined)

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN KNOWLEDGE LAKE                       │
│                  (2,460+ conversations)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌───────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐
│   HEALTHCARE  │  │   EDUCATION   │  │   BUSINESS   │  │  TECHNOLOGY  │
│     LAYER     │  │     LAYER     │  │    LAYER     │  │     LAYER    │
└───────┬───────┘  └───────┬───────┘  └──────┬───────┘  └──────┬───────┘
        │                  │                  │                 │
        ▼                  ▼                  ▼                 ▼
   SUB-LAYERS         SUB-LAYERS        SUB-LAYERS        SUB-LAYERS
```

### Healthcare Layer Sub-Layers

```
Healthcare Layer (businessDomain: Healthcare)
    ├── Primary-Care (subdomain: Primary Care)
    │   ├── ACRRM (organization: ACRRM)
    │   │   ├── Practice-Management (topicTags contains "Practice Management")
    │   │   └── Clinical-Standards (topicTags contains "Clinical")
    │   └── RACGP (organization: RACGP)
    │
    ├── Allied-Health (subdomain: Allied Health)
    │   ├── NDIS (topicTags contains "NDIS")
    │   └── RTW (topicTags contains "Return to Work")
    │
    ├── Research (subdomain: Research)
    │   ├── Cancer (topicTags contains "Cancer", "Oncology")
    │   └── Clinical-Trials (topicTags contains "Clinical Trial")
    │
    └── Mental-Health (subdomain: Mental Health)
```

### Education Layer Sub-Layers

```
Education Layer (businessDomain: Education)
    ├── Course-Development (subdomain: Course Development)
    │   ├── MTMOT-Courses (organization: MTMOT)
    │   └── Professional-Development
    │
    ├── Coaching (subdomain: Coaching)
    │   ├── Executive-Coaching (audienceRole: Executive)
    │   └── Leadership-Development (topicTags contains "Leadership")
    │
    └── Course-Delivery (subdomain: Course Delivery)
```

### Routing Algorithm

```javascript
function determineTopicLayers(metadata) {
  const layers = [];

  // Primary layer from businessDomain
  const primaryLayer = metadata.businessDomain; // e.g., "Healthcare"

  // Sub-layer from subdomain + organization
  let subLayer = metadata.businessSubdomain; // e.g., "Primary Care"

  if (metadata.organization) {
    subLayer += `-${metadata.organization}`; // e.g., "Primary Care-ACRRM"
  }

  // Micro-layer from topicTags (most specific)
  const microLayer = metadata.topicTags[0]; // First/primary tag

  layers.push({
    primary: primaryLayer,
    sub: subLayer,
    micro: microLayer,
    qdrantCollection: `layer_${primaryLayer.toLowerCase()}_${subLayer.toLowerCase().replace(/\s+/g, '_')}`
  });

  return layers;
}
```

**Example Output:**
```javascript
// For ACRRM Practice Manager conversation
{
  primary: "Healthcare",
  sub: "Primary Care-ACRRM",
  micro: "Practice Management",
  qdrantCollection: "layer_healthcare_primary_care_acrrm"
}

// For Cancer Research conversation
{
  primary: "Healthcare",
  sub: "Research",
  micro: "Cancer",
  qdrantCollection: "layer_healthcare_research"
}
```

**Result:** ACRRM queries search `layer_healthcare_primary_care_acrrm`, NOT `layer_healthcare_research` ✅

---

## n8n Workflow: Metadata Intelligence Analyzer

### Workflow 1: Intelligent Metadata Extractor

⚠️ **DEPRECATED:** This workflow uses static taxonomy. Use the **Dynamic Metadata Extractor** workflow in [N8N_DYNAMIC_TAXONOMY_SYSTEM.md](N8N_DYNAMIC_TAXONOMY_SYSTEM.md) instead.

**Key Difference:**
- **Static (this doc):** Taxonomy hardcoded in LLM prompt
- **Dynamic (new system):** Taxonomy loaded from Google Sheets, self-learning

---

**Trigger:** Manual (for backfill) OR New Conversation Webhook

**Nodes:**

#### 1. Get Conversation Content
```
Input: Conversation ID or full conversation object
Output: {
  id, topic, content, date, agent, userId, existingMetadata
}
```

#### 2. LLM Analysis - Extract Multi-Dimensional Metadata

**Agent:** Simon (strat, claude) via FredCast routing

**Prompt:**
```
Analyze this conversation and extract metadata across 8 dimensions:

CONVERSATION:
Topic: {{topic}}
Content: {{content}}
Agent: {{agent}}
Date: {{date}}

Extract the following metadata in JSON format:

{
  "businessDomain": "Healthcare|Education|Business|Technology|Personal",
  "businessSubdomain": "Primary Care|Specialist Care|Course Development|...",
  "organization": "ACRRM|RACGP|MTMOT|...|null",
  "contentType": "Requirements|Discussion|Decision|Planning|Research|...",
  "contentFormat": "Discussion|Documentation|Plan|...",
  "deliverableType": "Course|App|Document|null",
  "audienceRoles": ["Practice Manager", "Supervisor", "Management"],
  "audienceLevel": "Professional|Senior|Learning|Technical|...",
  "audienceSector": "Rural Health|Primary Care|Leadership|Technology|...",
  "topicTags": ["tag1", "tag2", "tag3"],
  "useCase": "Compliance Planning|Course Creation|Strategic Planning|...",
  "actionable": true|false,
  "priority": "HIGH|MEDIUM|LOW",
  "relatedOrganizations": ["org1", "org2"],
  "relatedProducts": ["product1", "product2"],
  "relatedProjects": ["project1", "project2"]
}

IMPORTANT RULES:
1. Be SPECIFIC - "Primary Care" not just "Healthcare"
2. Extract organization names explicitly (ACRRM, RACGP, MTMOT, etc.)
3. Topic tags should be 3-5 specific descriptors
4. Use null for fields that don't apply
5. audienceRoles is ALWAYS an ARRAY - identify ALL roles this content serves
   - For ACRRM: ["Practice Manager", "Supervisor", "TPA", "Client", "Management", "Board"]
   - A single conversation can serve multiple roles
   - Be comprehensive - include all relevant roles
6. Ensure semantic precision - distinguish between:
   - ACRRM Practice Management ≠ Cancer Research (both healthcare)
   - Executive Coaching ≠ Course Development (both education)
   - Strategic Planning ≠ Technical Implementation (both business)
```

**Output:**
```json
{
  "metadata": {
    "businessDomain": "Healthcare",
    "businessSubdomain": "Primary Care",
    "organization": "ACRRM",
    "contentType": "Requirements",
    "contentFormat": "Discussion",
    "deliverableType": null,
    "audienceRoles": [
      "Practice Manager",
      "Supervisor",
      "Management",
      "TPA"
    ],
    "audienceLevel": "Professional",
    "audienceSector": "Rural Health",
    "topicTags": [
      "Practice Management",
      "Compliance",
      "ACRRM Standards",
      "Administrative"
    ],
    "useCase": "Compliance Planning",
    "actionable": true,
    "priority": "HIGH",
    "relatedOrganizations": ["ACRRM", "RACGP"],
    "relatedProducts": [],
    "relatedProjects": ["CareTrack"]
  }
}
```

#### 3. Calculate Topic Layer Assignment

**Function Node:**
```javascript
// Input: metadata from LLM
const metadata = $json.metadata;

// Determine primary layer
const primaryLayer = metadata.businessDomain;

// Determine sub-layer
let subLayer = metadata.businessSubdomain;
if (metadata.organization) {
  subLayer = `${subLayer}-${metadata.organization}`;
}

// Determine micro-layer (most specific tag)
const microLayer = metadata.topicTags[0] || 'General';

// Generate Qdrant collection name
const qdrantCollection = `layer_${primaryLayer.toLowerCase()}_${subLayer.toLowerCase().replace(/[\s-]+/g, '_')}`;

// Add to metadata
metadata.topicLayer = primaryLayer;
metadata.topicSubLayer = subLayer;
metadata.topicMicroLayer = microLayer;
metadata.qdrantCollection = qdrantCollection;

// Calculate processing metadata
metadata.processingDate = new Date().toISOString();
metadata.metadataVersion = "2.0_multi_dimensional";
metadata.processingAgent = "Simon-Strategic-Analyzer";

return { metadata };
```

**Output:**
```json
{
  "metadata": {
    // ... all previous fields ...
    "topicLayer": "Healthcare",
    "topicSubLayer": "Primary Care-ACRRM",
    "topicMicroLayer": "Practice Management",
    "qdrantCollection": "layer_healthcare_primary_care_acrrm",
    "processingDate": "2026-01-09T04:30:00Z",
    "metadataVersion": "2.0_multi_dimensional",
    "processingAgent": "Simon-Strategic-Analyzer"
  }
}
```

#### 4. Validate Metadata Quality

**Agent:** Tess (sys, claude) via FredCast routing

**Prompt:**
```
Validate this metadata for completeness and accuracy:

{{metadata}}

Check:
1. All required fields present?
2. Values match allowed taxonomies?
3. Topic layer assignment makes sense?
4. Semantic precision achieved? (no false match risk)
5. topicTags are specific enough?

Return JSON:
{
  "valid": true|false,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1"],
  "confidence": "HIGH|MEDIUM|LOW"
}
```

#### 5. Human Review Checkpoint (IF confidence < HIGH)

**Condition:** IF validation.confidence !== "HIGH"

**Action:** Create Notion task in AAE Project Review
```
Title: Review Metadata - Conversation {{conversationId}}
Status: To Review
Priority: {{metadata.priority}}
Description:
  Automated metadata extraction needs review.

  Topic: {{topic}}
  Issues: {{validation.issues}}
  Suggestions: {{validation.suggestions}}

  [Link to conversation in Knowledge Lake]
```

#### 6. Update Knowledge Lake Conversation

**HTTP Request Node:**
```
POST https://knowledge-lake-api-production.up.railway.app/api/conversations/{{conversationId}}/metadata

Headers:
  Content-Type: application/json

Body:
{
  "metadata": {{metadata}}
}
```

#### 7. Distribute to Topic Layer (If topic layers exist)

**HTTP Request Node:**
```
POST https://knowledge-lake-api-production.up.railway.app/api/layers/{{metadata.qdrantCollection}}/add

Body:
{
  "conversationId": {{conversationId}},
  "metadata": {{metadata}}
}
```

#### 8. Log Results to Notion

**Create Notion Page:**
```
Database: Knowledge Lake Processing Log
Properties:
  - Conversation ID: {{conversationId}}
  - Topic: {{topic}}
  - Processing Date: {{metadata.processingDate}}
  - Topic Layer: {{metadata.topicLayer}}
  - Sub-Layer: {{metadata.topicSubLayer}}
  - Status: ✅ Complete / ⚠️ Needs Review
  - Validation Confidence: {{validation.confidence}}
```

---

## Workflow 2: Bulk Backfill Orchestrator

⚠️ **DEPRECATED:** Use the dynamic backfill workflow in [N8N_DYNAMIC_TAXONOMY_SYSTEM.md](N8N_DYNAMIC_TAXONOMY_SYSTEM.md) instead, which learns from conversations and builds the taxonomy automatically.

---

### Purpose
Process ALL 2,460 conversations to add multi-dimensional metadata

### Nodes:

#### 1. Get All Conversations Needing Metadata

**HTTP Request:**
```
GET https://knowledge-lake-api-production.up.railway.app/api/conversations?limit=100&offset={{offset}}

Loop through pagination until all conversations fetched
```

#### 2. Filter: Missing or Incomplete Metadata

**Function Node:**
```javascript
// Check if conversation needs metadata enhancement
const needsUpdate = (conv) => {
  const meta = conv.metadata || {};

  // Missing multi-dimensional structure
  if (!meta.metadataVersion || meta.metadataVersion !== "2.0_multi_dimensional") {
    return true;
  }

  // Missing critical fields
  if (!meta.businessDomain || !meta.topicTags || meta.topicTags.length === 0) {
    return true;
  }

  return false;
};

return $input.all().filter(item => needsUpdate(item.json));
```

#### 3. Batch Processing (100 at a time)

**Split In Batches Node:**
```
Batch Size: 100
```

#### 4. Call Metadata Intelligence Analyzer (Sub-workflow)

**Execute Workflow Node:**
```
Workflow: Intelligent Metadata Extractor
Parameters:
  conversationId: {{$json.id}}
  topic: {{$json.topic}}
  content: {{$json.content}}
  date: {{$json.date}}
  agent: {{$json.agent}}
  existingMetadata: {{$json.metadata}}
```

#### 5. Progress Tracking

**Update Notion Dashboard:**
```
Page: Knowledge Lake Backfill Progress
Properties:
  - Total Conversations: 2460
  - Processed: {{$node["Split In Batches"].context.processedItems}}
  - Remaining: {{2460 - $node["Split In Batches"].context.processedItems}}
  - Current Batch: {{$node["Split In Batches"].context.currentBatch}}
  - Est. Completion: {{estimatedTime}}
```

#### 6. Error Handling

**On Error:**
```
1. Log to Notion Error Log
2. Continue with next batch (don't halt entire process)
3. Flag conversation for manual review
4. Send Slack notification if error rate > 5%
```

---

## Workflow 3: Real-Time Metadata Enhancement

⚠️ **DEPRECATED:** Use the dynamic real-time workflow in [N8N_DYNAMIC_TAXONOMY_SYSTEM.md](N8N_DYNAMIC_TAXONOMY_SYSTEM.md) instead, which loads current taxonomy from Google Sheets.

---

### Trigger
Webhook: New conversation ingested to Knowledge Lake

### Process
```
New Conversation Ingested
    ↓
Call: Intelligent Metadata Extractor
    ↓
Auto-assign multi-dimensional metadata
    ↓
Distribute to appropriate topic layer
    ↓
No human intervention needed (unless validation confidence < HIGH)
```

---

## Query Enhancement: Semantic Precision Examples

### Query 1: ACRRM Practice Manager Requirements

**User Query:** "Show me ACRRM practice manager requirements"

**n8n Search Logic:**
```javascript
// Parse user intent
const intent = {
  domain: "Healthcare",
  subdomain: "Primary Care",
  organization: "ACRRM",
  audienceRole: "Practice Manager",
  contentType: "Requirements"
};

// Build precise filter with array support
const filter = {
  "metadata.businessDomain": "Healthcare",
  "metadata.businessSubdomain": "Primary Care",
  "metadata.organization": "ACRRM",
  "metadata.audienceRoles": { "$contains": "Practice Manager" }, // Array search
  "metadata.contentType": "Requirements"
};

// Query specific Qdrant collection
const collection = "layer_healthcare_primary_care_acrrm";
```

**Results:** ACRRM content relevant to Practice Managers ✅

**Will also return content tagged for:**
- Practice Manager + Supervisor + Management (multi-role content)
- Practice Manager + TPA (shared relevance)

**Does NOT return:**
- Cancer research (different subdomain)
- RACGP requirements (different organization)
- Clinical content ONLY for doctors (different audienceRoles, Practice Manager not in array)

### Query 2: MTMOT Course Development

**User Query:** "Find MTMOT course development discussions"

**Filter:**
```javascript
{
  "metadata.businessDomain": "Education",
  "metadata.businessSubdomain": "Course Development",
  "metadata.organization": "MTMOT"
}
```

**Collection:** `layer_education_course_development_mtmot`

**Does NOT return:**
- Executive coaching content (different subdomain)
- Personal development journaling (different domain)

### Query 3: ACRRM Multi-Role Query

**User Query:** "Show me ACRRM content for supervisors and TPAs"

**Filter:**
```javascript
{
  "metadata.businessDomain": "Healthcare",
  "metadata.organization": "ACRRM",
  "metadata.audienceRoles": {
    "$containsAny": ["Supervisor", "TPA"]
  }
}
```

**Returns:**
- Content tagged for Supervisor only
- Content tagged for TPA only
- Content tagged for BOTH Supervisor + TPA
- Content tagged for Supervisor + Practice Manager + TPA (multi-role)

**Semantic Precision:** All ACRRM Supervisor/TPA content, zero false matches from other organizations

### Query 4: AAE Technical Architecture

**User Query:** "Show me AAE architecture decisions"

**Filter:**
```javascript
{
  "metadata.businessDomain": "Technology",
  "metadata.contentType": "Decision",
  "metadata.relatedProjects": { "$contains": "AAE" }
}
```

**Collection:** `layer_technology_development`

**Does NOT return:**
- Course technology content (different project)
- Personal tech reflections (different domain)

---

## Implementation Checklist

⚠️ **Use Dynamic Taxonomy System Implementation Checklist** in [N8N_DYNAMIC_TAXONOMY_SYSTEM.md](N8N_DYNAMIC_TAXONOMY_SYSTEM.md) instead.

### Phase 1: Schema & Workflow Design ✅
- [x] Define multi-dimensional metadata schema
- [x] Create metadata taxonomy (value sets) → **REPLACED by Google Sheets dynamic taxonomy**
- [x] Design topic layer routing logic
- [x] Design n8n workflows (3 workflows) → **REPLACED by dynamic workflow with Sheets integration**

### Phase 2: n8n Workflow Build (NEXT)
- [ ] Build Workflow 1: Intelligent Metadata Extractor
- [ ] Build Workflow 2: Bulk Backfill Orchestrator
- [ ] Build Workflow 3: Real-Time Metadata Enhancement
- [ ] Test with sample conversations
- [ ] Integrate FredCast persona routing (Simon, Tess)

### Phase 3: Knowledge Lake API Updates (CC Task)
- [ ] Add `PATCH /api/conversations/:id/metadata` endpoint
- [ ] Add support for multi-dimensional metadata in search
- [ ] Add filter capabilities for new metadata fields
- [ ] Update Qdrant schema to support new dimensions

### Phase 4: Topic Layer Infrastructure (Week 2)
- [ ] Create Qdrant collections per sub-layer
- [ ] Build distribution logic
- [ ] Test semantic precision (ACRRM ≠ Cancer)
- [ ] Build fallback to main lake

### Phase 5: Backfill Execution (Week 2-3)
- [ ] Run bulk backfill on all 2,460 conversations
- [ ] Human review queue for low-confidence extractions
- [ ] Validation and quality assurance
- [ ] Update Notion tracking

---

## Success Metrics

### Metadata Quality
- ✅ 100% of conversations have multi-dimensional metadata
- ✅ 95%+ validation confidence rate
- ✅ < 5% requiring human review
- ✅ All 8 dimensions populated (or explicit null)

### Semantic Precision
- ✅ Zero false matches on test queries
- ✅ ACRRM queries return ONLY ACRRM content
- ✅ Course queries return ONLY course content
- ✅ Personal vs Professional content clearly separated

### Query Performance
- ✅ Topic layer queries 10x faster than main lake
- ✅ Sub-layer queries 50x faster than main lake
- ✅ Relevant results in top 5 (precision)
- ✅ No missing relevant results (recall)

---

## Next Steps

⚠️ **SUPERSEDED** - Follow implementation steps in [N8N_DYNAMIC_TAXONOMY_SYSTEM.md](N8N_DYNAMIC_TAXONOMY_SYSTEM.md)

**New Implementation Path:**

1. **Create Google Sheets** - AAE Taxonomy Registry (5 sheets)
2. **Seed Initial Values** - Import from Knowledge Lake sample
3. **Build Dynamic n8n Workflow** - Loads taxonomy from Sheets
4. **Test with 10 conversations** - Validate self-learning
5. **Run backfill** on 2,460 conversations
6. **Monitor taxonomy growth** - Let system learn organically

**Why This Matters:**
- Static taxonomy → requires manual updates, can't scale
- Dynamic taxonomy → self-learning, adapts to Carla's evolving work

Ready to proceed with **dynamic** n8n workflow implementation?
