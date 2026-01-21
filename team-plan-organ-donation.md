# 🚀 Team Orchestration Plan

**Project**: Organ Donation & Recipient Matching Platform
**Generated**: 2026-01-21
**PRD Reference**: [plan.md](file:///d:/organ_donater_system/artifacts/superpowers/plan.md)
**Team**: 3 members | **Tasks**: 25 | **Duration**: ~4-5 weeks

---

## 📋 Executive Summary

Build a centralized, AI-powered web platform for India's organ donation ecosystem featuring RAG chatbot, matching engine, hospital dashboards, and admin panel. The project uses mock authentication, MongoDB, and Vertex AI for RAG.

---

## 👥 Team Composition

| Member | Role | Tasks | Effort |
|--------|------|-------|--------|
| **Vinod Krishna** | Backend Developer | 12 | ~10 days |
| **Venu Gopal** | Frontend Developer 1 | 7 | ~7 days |
| **Sandeep** | Frontend Developer 2 | 6 | ~6 days |

---

## 📊 Task Assignment Matrix

| ID | Task | Assignee | Priority | Effort | Dependencies | Status |
|----|------|----------|----------|--------|--------------|--------|
| T1 | Initialize Monorepo | Vinod Krishna | P0 | S (30m) | - | 🔴 |
| T2 | Backend Scaffolding | Vinod Krishna | P0 | M (1d) | T1 | 🔴 |
| T3 | Database Models | Vinod Krishna | P0 | M (1d) | T2 | 🔴 |
| T4 | Frontend Scaffolding | Venu Gopal | P0 | M (1d) | T1 | 🔴 |
| T5 | Mock Auth Backend | Vinod Krishna | P0 | S (4h) | T3 | 🔴 |
| T6 | Mock Auth Frontend | Venu Gopal | P0 | S (4h) | T4, T5 | 🔴 |
| T7 | Recipient APIs | Vinod Krishna | P0 | M (1d) | T5 | 🔴 |
| T8 | Health History Upload | Vinod Krishna | P0 | M (1d) | T7 | 🔴 |
| T9 | Recipient Management UI | Venu Gopal | P0 | L (1.5d) | T6, T8 | 🔴 |
| T10 | Donor APIs | Vinod Krishna | P0 | M (1d) | T8 | 🔴 |
| T11 | Donor Validation Logic | Vinod Krishna | P1 | S (4h) | T10 | 🔴 |
| T12 | Donor Registration UI | Sandeep | P0 | L (1.5d) | T6, T11 | 🔴 |
| T13 | Matching Algorithm | Vinod Krishna | P0 | L (1.5d) | T10, T7 | 🔴 |
| T14 | Match Generation APIs | Vinod Krishna | P0 | M (1d) | T13 | 🔴 |
| T15 | Match View UI | Sandeep | P0 | M (1d) | T14 | 🔴 |
| T16 | Knowledge Base Setup | Vinod Krishna | P0 | M (1d) | - | 🔴 |
| T17 | Vector Store Setup | Vinod Krishna | P0 | L (1.5d) | T16 | 🔴 |
| T18 | RAG Pipeline | Vinod Krishna | P0 | L (1.5d) | T17 | 🔴 |
| T19 | Chatbot API | Vinod Krishna | P0 | M (1d) | T18 | 🔴 |
| T20 | Chatbot UI | Venu Gopal | P0 | L (1.5d) | T19 | 🔴 |
| T21 | Admin Dashboard UI | Sandeep | P1 | M (1d) | T6 | 🔴 |
| T22 | Analytics APIs | Vinod Krishna | P1 | M (1d) | T13 | 🔴 |
| T23 | Email Notifications | Vinod Krishna | P2 | M (1d) | T14 | 🔴 |
| T24 | Integration Tests | Vinod Krishna | P1 | L (1.5d) | T19, T14 | 🔴 |
| T25 | API Documentation | Vinod Krishna | P2 | S (4h) | T24 | 🔴 |

---

## 👤 Individual Assignments

---

## 👤 Vinod Krishna - Backend Developer

### Workload Summary
- **Total Tasks**: 12
- **Total Effort**: ~10 days
- **Priority Breakdown**: 10 P0, 1 P1, 1 P2

### Assigned Tasks

#### T1: Initialize Monorepo Structure
**Description**: Setup npm workspaces monorepo with backend/ and frontend/ packages.

**Deliverables**:
- [ ] Root `package.json` with workspaces
- [ ] `.gitignore`, `.env.example`, `README.md`
- [ ] `backend/package.json` with Express + TS deps
- [ ] `frontend/package.json` with Next.js deps

**Verify**: `npm install; npm run build --workspaces --if-present`
**Effort**: 30 min
**Dependencies**: None

---

#### T2: Backend Scaffolding
**Description**: Express server with TypeScript, MongoDB connection, health check.

**Deliverables**:
- [ ] `backend/src/index.ts` - Express entry
- [ ] `backend/src/config/env.ts` - Zod env validation
- [ ] `backend/src/config/database.ts` - Mongoose connection
- [ ] `backend/src/middleware/errorHandler.ts`

**Verify**: `curl http://localhost:3001/health` returns `{"status":"ok"}`
**Effort**: 1 day
**Dependencies**: T1

---

#### T3: Database Models
**Description**: Mongoose schemas for all entities with health history support.

**Deliverables**:
- [ ] `User.ts` - coordinators, admins
- [ ] `Hospital.ts` - transplant centers
- [ ] `Donor.ts` - with donationType (LIVING/DECEASED), healthHistory[]
- [ ] `Recipient.ts` - with organNeeded, healthHistory[], medicalReports[]
- [ ] `Organ.ts`, `Match.ts`, `AuditLog.ts`

**Verify**: MongoDB connection logs "Connected to MongoDB"
**Effort**: 1 day
**Dependencies**: T2

---

#### T5: Mock Authentication Backend
**Description**: Simple role-based mock auth (no JWT, no passwords).

**Deliverables**:
- [ ] GET /api/auth/roles - returns available roles
- [ ] POST /api/auth/select-role - sets role in cookie
- [ ] `mockAuth.ts` middleware

**Verify**: `curl /api/auth/roles` returns roles array
**Effort**: 4 hours
**Dependencies**: T3

---

#### T7: Recipient APIs
**Description**: CRUD for recipients with health history management.

**Deliverables**:
- [ ] POST /api/recipients
- [ ] GET /api/recipients (with filters)
- [ ] GET /api/recipients/:id
- [ ] PUT /api/recipients/:id
- [ ] POST /api/recipients/:id/health-history
- [ ] POST /api/recipients/:id/medical-reports

**Verify**: `npm run test:recipients`
**Effort**: 1 day
**Dependencies**: T5

---

#### T8: Health History Upload
**Description**: File upload service for medical reports.

**Deliverables**:
- [ ] `uploadService.ts` - handle file uploads (local/GCS)
- [ ] Health history schema with date, condition, treatment, notes

**Verify**: Upload PDF via curl, verify file stored
**Effort**: 1 day
**Dependencies**: T7

---

#### T10: Donor APIs
**Description**: CRUD for donors with donation type validation.

**Deliverables**:
- [ ] POST /api/donors (with donation type)
- [ ] GET /api/donors, GET /api/donors/:id
- [ ] PUT /api/donors/:id
- [ ] POST /api/donors/:id/health-history
- [ ] POST /api/donors/:id/consent

**Verify**: `npm run test:donors`
**Effort**: 1 day
**Dependencies**: T8

---

#### T11: Donor Validation Logic
**Description**: Validate organ selection based on donation type.

**Deliverables**:
- [ ] LIVING → only 1 kidney allowed
- [ ] DECEASED → multiple organs allowed
- [ ] Consent form validation

**Verify**: LIVING donor with liver selection should return 400
**Effort**: 4 hours
**Dependencies**: T10

---

#### T13: Matching Algorithm
**Description**: 0-100 scoring algorithm for donor-recipient matching.

**Deliverables**:
- [ ] `matchingEngine.ts` - main scoring logic
- [ ] `scoringRules.ts` - configurable weights
- [ ] `bloodCompatibility.ts` - ABO/Rh matching

**Verify**: Unit tests with known pairs
**Effort**: 1.5 days
**Dependencies**: T7, T10

---

#### T14: Match Generation APIs
**Description**: API endpoints for match operations.

**Deliverables**:
- [ ] POST /api/matches/generate
- [ ] GET /api/matches?donorId=xxx
- [ ] PUT /api/matches/:id/accept
- [ ] PUT /api/matches/:id/reject

**Verify**: `npm run test:matches`
**Effort**: 1 day
**Dependencies**: T13

---

#### T16-T19: RAG Chatbot (Knowledge → Vector → RAG → API)

**T16: Knowledge Base Setup** (1 day)
- [ ] NOTTO guidelines doc
- [ ] THOA regulations doc
- [ ] FAQs for donors/recipients

**T17: Vector Store Setup** (1.5 days)
- [ ] Vertex AI embeddings integration
- [ ] Document chunking (500 tokens)
- [ ] Vector indexing script

**T18: RAG Pipeline** (1.5 days)
- [ ] Query → embed → retrieve → generate flow
- [ ] Gemini LLM client
- [ ] Prompt templates with disclaimer

**T19: Chatbot API** (1 day)
- [ ] POST /api/chatbot/query
- [ ] GET /api/chatbot/history/:sessionId

**Verify**: Query "Can I donate my kidney while alive?" returns accurate response
**Total Effort**: 5 days
**Dependencies**: None (can start in parallel)

---

#### T22: Analytics APIs
**Description**: Reporting endpoints for admin dashboard.

**Deliverables**:
- [ ] GET /api/analytics/overview
- [ ] GET /api/analytics/by-state
- [ ] GET /api/analytics/by-organ

**Verify**: `npm run test:analytics`
**Effort**: 1 day
**Dependencies**: T13

---

#### T23: Email Notifications
**Description**: Nodemailer service with templates.

**Deliverables**:
- [ ] `emailService.ts` with SMTP config
- [ ] Templates: match found, accepted, rejected

**Verify**: `npm run test:email`
**Effort**: 1 day
**Dependencies**: T14

---

#### T24: Integration Tests
**Description**: E2E flow tests.

**Deliverables**:
- [ ] Donor registration → match generation test
- [ ] Recipient with health history test
- [ ] Chatbot query-response test

**Verify**: `npm run test:integration`
**Effort**: 1.5 days
**Dependencies**: T14, T19

---

#### T25: API Documentation
**Description**: Swagger UI setup.

**Deliverables**:
- [ ] `swagger.ts` with OpenAPI spec
- [ ] Swagger UI at /api/docs

**Verify**: Open http://localhost:3001/api/docs
**Effort**: 4 hours
**Dependencies**: T24

---

---

## 👤 Venu Gopal - Frontend Developer 1

### Workload Summary
- **Total Tasks**: 7
- **Total Effort**: ~7 days
- **Focus Areas**: Core UI, Auth, Recipient Management, Chatbot

### Assigned Tasks

#### T4: Frontend Scaffolding
**Description**: Next.js 14 project setup with Tailwind and shadcn/ui.

**Deliverables**:
- [ ] App router structure
- [ ] Tailwind CSS config with dark mode
- [ ] shadcn/ui component setup
- [ ] API client (`lib/api.ts`)

**Verify**: `npm run dev` - localhost:3000 renders landing page
**Effort**: 1 day
**Dependencies**: T1

---

#### T6: Mock Auth Frontend
**Description**: Role selector UI with AuthContext.

**Deliverables**:
- [ ] `/login` page with role dropdown
- [ ] `AuthContext.tsx` with localStorage persistence
- [ ] Redirect to appropriate dashboard per role

**Verify**: Select role, verify redirect works
**Effort**: 4 hours
**Dependencies**: T4, T5

---

#### T9: Recipient Management UI
**Description**: Hospital admin interface for managing recipients.

**Deliverables**:
- [ ] `/recipients` - list with filters (organ, blood type, urgency)
- [ ] `/recipients/new` - add recipient form
- [ ] `RecipientForm.tsx` with health history section
- [ ] `HealthHistoryForm.tsx` with file upload

**Verify**: Add recipient with health history, verify saved
**Effort**: 1.5 days
**Dependencies**: T6, T8

---

#### T20: Chatbot UI
**Description**: Floating chat widget with message history.

**Deliverables**:
- [ ] `ChatWidget.tsx` - floating button + panel
- [ ] `ChatMessage.tsx` - user/bot message bubbles
- [ ] `ChatInput.tsx` - input with submit
- [ ] `useChatbot.ts` hook
- [ ] Source citations display
- [ ] "Not medical advice" disclaimer

**Verify**: Open chat, ask question, verify response with sources
**Effort**: 1.5 days
**Dependencies**: T19

---

---

## 👤 Sandeep - Frontend Developer 2

### Workload Summary
- **Total Tasks**: 6
- **Total Effort**: ~6 days
- **Focus Areas**: Donor UI, Matches, Admin Dashboard

### Assigned Tasks

#### T12: Donor Registration UI
**Description**: Consulting hospital interface for donor registration.

**Deliverables**:
- [ ] `/donors` - donor list
- [ ] `/donors/register` - multi-step registration form
- [ ] `DonorForm.tsx` with health history
- [ ] `DonationTypeSelector.tsx` - Living/Deceased choice
- [ ] Dynamic organ selection (kidney only for living)
- [ ] Consent form upload

**Verify**: Register living donor (only kidney available), deceased donor (all organs)
**Effort**: 1.5 days
**Dependencies**: T6, T11

---

#### T15: Match View UI
**Description**: Match cards with accept/reject actions.

**Deliverables**:
- [ ] `/matches` page
- [ ] `MatchCard.tsx` with score breakdown
- [ ] Accept/Reject buttons with confirmation

**Verify**: View matches, accept one, verify status update
**Effort**: 1 day
**Dependencies**: T14

---

#### T21: Admin Dashboard UI
**Description**: NOTTO admin view with stats and activity.

**Deliverables**:
- [ ] `/admin/dashboard` page
- [ ] `StatsCards.tsx` - donors, recipients, matches count
- [ ] `RecentActivity.tsx` - activity log

**Verify**: Login as NOTTO_ADMIN, verify dashboard loads
**Effort**: 1 day
**Dependencies**: T6

---

---

## 🔗 Dependency Map

### Critical Path
```
T1 → T2 → T3 → T5 → T7 → T8 → T10 → T13 → T14 → T24
                            ↓
                          T11 → T12 (Sandeep)
```

### Parallel Tracks

**Track A: Backend Core** (Vinod Krishna)
```
T1 → T2 → T3 → T5 → T7 → T8 → T10 → T11 → T13 → T14
```

**Track B: Frontend Core** (Venu Gopal)
```
T4 → T6 → T9 → T20
```

**Track C: Donor & Admin UI** (Sandeep)
```
(after T6) → T12 → T15 → T21
```

**Track D: RAG Chatbot** (Vinod Krishna - can run parallel)
```
T16 → T17 → T18 → T19
```

### ⚠️ Bottlenecks
- **T5 (Mock Auth Backend)** blocks all frontend work
- **T11 (Donor Validation)** blocks T12 (Donor UI)
- **T14 (Match APIs)** blocks T15 (Match UI)
- **T19 (Chatbot API)** blocks T20 (Chatbot UI)

---

## 📅 Timeline

### Milestones

| Milestone | Target | Owner | Status |
|-----------|--------|-------|--------|
| Project Setup Complete | Week 1, Day 2 | Vinod + Venu | 🔴 |
| Auth & Core APIs Ready | Week 1, Day 4 | Vinod | 🔴 |
| Recipient/Donor Flows | Week 2 | All | 🔴 |
| Matching Engine | Week 2, Day 4 | Vinod | 🔴 |
| RAG Chatbot Complete | Week 3 | Vinod + Venu | 🔴 |
| Admin & Polish | Week 4 | All | 🔴 |

### Weekly Breakdown

**Week 1**
| Day | Vinod Krishna | Venu Gopal | Sandeep |
|-----|---------------|------------|---------|
| 1 | T1, T2 (start) | (blocked) | (blocked) |
| 2 | T2 (complete), T3 | T4 | (blocked) |
| 3 | T5 | T4 (complete) | (blocked) |
| 4 | T7 (start) | T6 | T12 (start) |
| 5 | T7, T8 (start) | T9 (start) | T12 |

**Week 2**
| Day | Vinod Krishna | Venu Gopal | Sandeep |
|-----|---------------|------------|---------|
| 1 | T8 (complete), T10 | T9 | T12 (complete) |
| 2 | T10, T11 | T9 (complete) | T15 |
| 3 | T13 | T20 (start) | T15 (complete) |
| 4 | T13 (complete), T14 | T20 | T21 |
| 5 | T14 (complete) | T20 (complete) | T21 (complete) |

**Week 3**
| Day | Vinod Krishna | Venu Gopal | Sandeep |
|-----|---------------|------------|---------|
| 1 | T16 | (buffer) | (buffer) |
| 2 | T17 | (buffer) | (buffer) |
| 3 | T17 (complete), T18 | (buffer) | (buffer) |
| 4 | T18 (complete), T19 | (buffer) | (buffer) |
| 5 | T22 | (buffer) | (buffer) |

**Week 4**
| Day | Vinod Krishna | Venu Gopal | Sandeep |
|-----|---------------|------------|---------|
| 1 | T23 | Polish | Polish |
| 2 | T24 | Bug fixes | Bug fixes |
| 3 | T24 (complete), T25 | Bug fixes | Bug fixes |
| 4-5 | Integration | Testing | Testing |

---

## ⚠️ Risks

| Risk | Owner | Mitigation |
|------|-------|------------|
| Vertex AI setup delays | Vinod | Use local Chroma for dev, switch to Vertex later |
| MongoDB schema changes | Vinod | Use flexible Mongoose schemas |
| Frontend blocked on APIs | Venu/Sandeep | Mock API responses while waiting |
| RAG accuracy issues | Vinod | Curate knowledge base carefully |

---

## ❓ Clarifications Needed

- [ ] MongoDB Atlas or local instance for development?
- [ ] GCP project ID for Vertex AI access?
- [ ] Email SMTP credentials for Nodemailer?
- [ ] Design system/brand guidelines?

---

*Generated by Team Orchestration Workflow*
