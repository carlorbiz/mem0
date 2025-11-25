# ACRRM Practice Manager Decision Tree Architecture

**Project:** Interactive Decision Support Tool for Rural Generalist Training Post Management  
**Client:** Carla Taylor / ACRRM  
**Date:** 25 November 2025  
**Author:** Manus (AAE Council)  
**Repository:** GitHub (carlorbiz/mem0) - Branch: `acrrm-decision-tree-architecture`

---

## Overview

This repository contains the complete architectural wireframe for an interactive decision tree that will serve as a comprehensive decision support tool for Practice Managers and Practice Owners managing ACRRM rural generalist training posts.

The decision tree synthesizes the restructured 6-part Practice Manager Handbook with embedded NTCER 2026.1 compliance requirements, creating a navigable, context-specific guidance system that addresses the complex, competing priorities inherent in training post management.

---

## Critical Design Principle

**Unlike traditional decision support tools that present simplified "best practice" recommendations, this decision tree explicitly surfaces the tensions and conflicts that arise when four competing priorities clash:**

1. **NTCER Compliance Requirements** (mandatory regulatory obligations)
2. **Training Quality Delivery** (educational outcomes and registrar development)
3. **Business Sustainability** (operational efficiency and financial viability)
4. **Registrar Experience & Retention** (workforce development and rural retention outcomes)

**The decision tree does not gloss over conflicts—it provides Practice Managers with frameworks for ethical and strategic decision-making when trade-offs are necessary.**

---

## Architecture Documents

### [Document 00: Executive Summary & Architecture Overview](./00-executive-summary.md)
**Purpose:** High-level overview of the project, architecture, and document structure

**Key Contents:**
- Project overview and critical design principle
- Summary of all architecture documents
- Decision tree structure at a glance (18 branches, 4 lifecycle phases)
- Six conflict types
- User entry points
- Priority decision nodes for implementation
- Implementation timeline and success metrics

---

### [Document 01: Hierarchical Decision Framework](./01-hierarchical-decision-framework.md)
**Purpose:** Establishes the decision tree structure

**Key Contents:**
- 18 primary decision branches (A-R) organized around the Training Post Lifecycle Model
- Tier-1, Tier-2, and Tier-3 question hierarchy
- Natural workflow integration (6 common workflows)
- Handbook integration points
- Cross-referencing architecture (forward, backward, lateral references)
- Scalability and future expansion considerations

**Key Insight:** The decision tree follows the natural administrative workflows that Practice Managers experience, from pre-placement through end-of-term.

---

### [Document 02: Multi-Layer Integration Schema](./02-multi-layer-integration-schema.md)
**Purpose:** Defines how the four competing priority layers are integrated into each decision node

**Key Contents:**
- Detailed description of each priority layer (Compliance, Training Quality, Business Sustainability, Registrar Experience)
- Integration methodology and decision node template structure
- Priority alignment analysis framework
- NTCER 2026.1 clause mapping to decision nodes
- Conflict recognition triggers (4 types)
- Multi-layer decision consequence framework
- Visual integration schema (color-coding and icons)

**Key Insight:** Every decision node integrates all four priority layers, making competing priorities visible and explicit.

---

### [Document 03: Conflict Recognition Architecture](./03-conflict-recognition-architecture.md)
**Purpose:** Establishes how conflicts between competing priorities are surfaced and managed

**Key Contents:**
- Conflict typology (6 primary conflict types)
- Conflict detection node structure
- Conflict resolution decision support framework (7 steps)
- Escalation pathways (TPA, ACRRM, Practice Owner, External Mediation)
- Conflict anticipation and prevention nodes
- Ethical decision-making framework
- Conflict case studies
- Visual conflict indicators

**Key Insight:** Conflicts are not failures—they are inherent features of complex systems. The decision tree helps Practice Managers recognize conflicts early and make informed trade-off decisions.

---

### [Document 04: Question-Answer Mapping Template](./04-question-answer-mapping-template.md)
**Purpose:** Provides the standardized template for each decision node

**Key Contents:**
- Complete decision node template structure (11 sections)
- Decision context (user question, lifecycle phase, handbook reference)
- Multi-layer integration (all 4 priority layers)
- Conflict recognition (if applicable)
- Decision options with multi-layer consequences
- Stakeholder engagement guidance
- Escalation pathways
- Documentation and follow-up actions
- Related decision nodes (forward, backward, lateral references)
- Case studies and FAQs
- Additional resources (templates, tools, contacts)
- **Example: Fully populated Decision Node I.1 (Employment Contract Template Selection)**
- Template validation checklist

**Key Insight:** The template ensures consistency, comprehensiveness, and usability across all decision nodes.

---

### [Document 05: Handbook Integration Crosswalk](./05-handbook-integration-crosswalk.md)
**Purpose:** Provides bidirectional mapping between the 6-part handbook and the decision tree

**Key Contents:**
- Handbook → Decision Tree mapping (which decision nodes are informed by each handbook section)
- Decision Tree → Handbook mapping (which handbook sections support each decision node)
- Part-by-part integration analysis (Parts 1-6)
- Appendices integration (Glossary, Touchpoints, Resources, Contacts)
- Bidirectional navigation implementation guidance
- Content synchronization protocol

**Key Insight:** The handbook and decision tree are complementary, not redundant. The crosswalk enables seamless navigation between both resources.

---

### [Document 06: Implementation Roadmap](./06-implementation-roadmap.md)
**Purpose:** Outlines the phases, tasks, resources, and timeline for populating and deploying the decision tree

**Key Contents:**
- 6 implementation phases:
  1. Architecture Validation & Pilot Node Development (2-3 weeks)
  2. Content Population - Priority Nodes (4-6 weeks)
  3. Content Population - Remaining Nodes (4-6 weeks)
  4. User Testing & Refinement (3-4 weeks)
  5. Platform Development & Deployment (4-6 weeks)
  6. Training, Launch, & Continuous Improvement (Ongoing)
- Priority decision node tiers (Tier 1: Must-Have, Tier 2: Important, Tier 3: Nice-to-Have)
- Content development process and quality review workflow
- User testing approach with realistic scenarios
- Platform development options and requirements
- Training, launch, and continuous improvement strategy
- Resource requirements (personnel, budget, tools)
- Risk management and success metrics

**Key Insight:** Implementation should be phased and iterative, with early user testing to validate the architecture. Estimated timeline: 4-6 months.

---

## Decision Tree Structure

### 18 Primary Decision Branches

| Branch | Title | Lifecycle Phase |
|--------|-------|-----------------|
| **A** | Practice Accreditation Readiness | Pre-Placement |
| **B** | Supervisor Capability Assessment | Pre-Placement |
| **C** | Cultural Safety & Specialist Context | Pre-Placement |
| **D** | Business Sustainability Planning | Pre-Placement |
| **E** | Registrar Placement Workflow | Onboarding |
| **F** | Mutual Fit & Interview Process | Onboarding |
| **G** | Onboarding Action Plan & Checklist | Onboarding |
| **H** | Week 5 Check-In & Early Support | Onboarding |
| **I** | Employment & Financial Compliance | During Term |
| **J** | Supervision Model Implementation | During Term |
| **K** | Teaching Requirements & Scheduling | During Term |
| **L** | Educational Leave Management | During Term |
| **M** | ACRRM Fellowship Education Programme | During Term |
| **N** | Administrative Timeline & Reporting | End of Term |
| **O** | Supporting Assessment | End of Term |
| **P** | Respectful Workplaces & Wellbeing | Any Phase |
| **Q** | Troubleshooting & Escalation | Any Phase |
| **R** | Retention Strategies | End of Term |

---

## Implementation Timeline

**Total Estimated Timeline:** 17-25 weeks (approximately 4-6 months)

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1** | 2-3 weeks | Validated architecture, 3-5 fully populated pilot nodes |
| **Phase 2** | 4-6 weeks | 30-40 high-priority nodes fully populated |
| **Phase 3** | 4-6 weeks | All decision nodes fully populated |
| **Phase 4** | 3-4 weeks | User feedback integrated, decision tree refined |
| **Phase 5** | 4-6 weeks | Interactive decision tree platform deployed |
| **Phase 6** | Ongoing | Practice Managers trained, decision tree launched, feedback loop established |

---

## Key Innovations

1. **Multi-Layer Integration:** Every decision node integrates four competing priority layers
2. **Conflict Recognition & Resolution:** Explicit surfacing of conflicts with ethical decision-making frameworks
3. **Bidirectional Handbook Integration:** Seamless navigation between interactive guidance and comprehensive reference material
4. **Lifecycle-Based Navigation:** Follows natural administrative workflows
5. **Stakeholder Engagement Guidance:** Explicit guidance on when to consult stakeholders
6. **Escalation Pathways:** Clear pathways when conflicts cannot be resolved internally
7. **Case Studies & Real-World Scenarios:** Practical, evidence-based guidance

---

## Next Steps

### Immediate Actions
1. **Stakeholder Review:** Distribute Documents 00-06 to ACRRM Project Team for review
2. **Feedback Collection:** Gather feedback on architecture and implementation roadmap
3. **Pilot Node Selection:** Confirm which 3-5 pilot decision nodes will be developed in Phase 1
4. **Resource Allocation:** Identify content developers and subject matter experts
5. **Budget Approval:** Secure budget approval for implementation phases

### Phase 1 Kickoff
1. **Architecture Refinement:** Incorporate stakeholder feedback
2. **Content Developer Training:** Train on Decision Node Template and Handbook Integration Crosswalk
3. **Pilot Node Development:** Begin populating 3-5 pilot decision nodes
4. **User Testing Recruitment:** Recruit 3-5 Practice Managers for pilot node user testing

---

## Contact & Support

**Project Lead:** Carla Taylor (ACRRM)  
**Architecture Developer:** Manus (AAE Council)  
**Repository:** https://github.com/carlorbiz/mem0/tree/acrrm-decision-tree-architecture  
**Date:** 25 November 2025

---

## License

This architectural wireframe is proprietary to ACRRM and AAE Council. All rights reserved.

---

## Document Navigation

- [00-executive-summary.md](./00-executive-summary.md) - Start here for project overview
- [01-hierarchical-decision-framework.md](./01-hierarchical-decision-framework.md) - Decision tree structure
- [02-multi-layer-integration-schema.md](./02-multi-layer-integration-schema.md) - Priority layer integration
- [03-conflict-recognition-architecture.md](./03-conflict-recognition-architecture.md) - Conflict management
- [04-question-answer-mapping-template.md](./04-question-answer-mapping-template.md) - Decision node template
- [05-handbook-integration-crosswalk.md](./05-handbook-integration-crosswalk.md) - Handbook mapping
- [06-implementation-roadmap.md](./06-implementation-roadmap.md) - Implementation plan
