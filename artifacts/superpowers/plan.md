# Implementation Plan: Organ Donation & Recipient Matching Platform

> **PRD Reference** - See [team-plan-organ-donation.md](file:///d:/organ_donater_system/team-plan-organ-donation.md) for detailed task breakdown.

## Goal

Build a **centralized, AI-powered web platform** for India's organ donation ecosystem with focus on:

1. **RAG Chatbot** - Actual AI assistant implementation with Vertex AI
2. **Matching Engine** - Donor-recipient matching with scoring algorithm
3. **Hospital Dashboard** - Recipient & donor management with health history uploads
4. **Admin Panel** - NOTTO/ROTTO analytics and reporting

**Target**: Reduce organ allocation time from 4-6 hours to under 30 minutes.

---

## Team

| Member | Role | Tasks |
|--------|------|-------|
| 🔵 **Vinod Krishna** | Backend | T1-T3, T5, T7-T8, T10-T11, T13-T14, T16-T19, T22-T25 |
| 🟢 **Venu Gopal** | Frontend 1 | T4, T6, T9, T20 |
| 🟠 **Sandeep** | Frontend 2 | T12, T15, T21 |

---

## Assumptions

| # | Assumption | Rationale |
|---|------------|-----------|
| 1 | GCP as cloud provider | Vertex AI for RAG, Cloud Run for services |
| 2 | Node.js/TypeScript backend | Common stack, good ecosystem |
| 3 | React/Next.js frontend | Modern web framework |
| 4 | MongoDB database | Flexible schema for medical data |
| 5 | Mongoose ODM | Type-safe MongoDB access |
| 6 | **Mock authentication** | Role selection dropdown; real auth deferred |
| 7 | Nodemailer for email | Simple SMTP-based notifications |
| 8 | SMS deferred | Future phase |

---

## Key Data Flows

| Actor | Action | Data |
|-------|--------|------|
| **Hospital Admin** | Uploads recipient details | Patient info, organ needed, health history, medical reports |
| **Consulting Hospital** | Uploads donor details | Donor info, donation type, health history, consent |
| **Donor** | Chooses donation type | **Living** (before death - 1 kidney only) OR **Deceased** (after death - multiple organs) |
| **System** | Auto-matches | Scores donor-recipient pairs based on compatibility |
| **Chatbot** | Answers queries | RAG-powered responses from NOTTO guidelines |

---

## Plan

### Phase 1: Project Setup (Steps 1-4)

---

#### Step 1: Initialize Monorepo Structure 🔵 **Vinod Krishna**
**Time**: 5 min

**Files**:
- `[NEW] package.json` (root workspace)
- `[NEW] .gitignore`, `.env.example`, `README.md`
- `[NEW] backend/package.json`
- `[NEW] frontend/package.json`

**Change**: Monorepo with npm workspaces. Backend: Express + TS. Frontend: Next.js 14.

**Verify**:
```bash
npm install; npm run build --workspaces --if-present
```

---

#### Step 2: Backend Scaffolding 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/index.ts`
- `[NEW] backend/src/config/env.ts`, `database.ts`
- `[NEW] backend/src/middleware/errorHandler.ts`

**Change**: Express server, health check, MongoDB connection.

**Verify**:
```bash
cd backend; npm run dev
curl http://localhost:3001/health
```

---

#### Step 3: Database Models 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/models/User.ts`
- `[NEW] backend/src/models/Hospital.ts`
- `[NEW] backend/src/models/Donor.ts` (with health history)
- `[NEW] backend/src/models/Recipient.ts` (with health history)
- `[NEW] backend/src/models/Organ.ts`
- `[NEW] backend/src/models/Match.ts`
- `[NEW] backend/src/models/AuditLog.ts`

**Change**: Mongoose schemas including:
- **Recipient**: bloodType, organNeeded, healthHistory[], medicalReports[], hospitalId
- **Donor**: donationType (LIVING/DECEASED), bloodType, healthHistory[], consentForm, consultingHospitalId
  - LIVING: Only kidney donation allowed
  - DECEASED: Multiple organs (kidney, liver, heart, lungs, etc.)

**Verify**:
```bash
cd backend; npm run dev
# Expected: "Connected to MongoDB"
```

---

#### Step 4: Frontend Scaffolding 🟢 **Venu Gopal**
**Time**: 10 min

**Files**:
- `[NEW] frontend/src/app/layout.tsx`, `page.tsx`, `globals.css`
- `[NEW] frontend/src/components/ui/` (shadcn/ui)
- `[NEW] frontend/src/lib/api.ts`

**Change**: Next.js 14, Tailwind CSS, shadcn/ui, dark mode.

**Verify**:
```bash
cd frontend; npm run dev
# Open http://localhost:3000
```

---

### Phase 2: Mock Auth & Role Selection (Steps 5-6)

---

#### Step 5: Mock Authentication Backend 🔵 **Vinod Krishna**
**Time**: 5 min

**Files**:
- `[NEW] backend/src/routes/auth.ts`
- `[NEW] backend/src/middleware/mockAuth.ts`

**Change**: Simple mock auth:
- GET /api/auth/roles → Returns available roles
- POST /api/auth/select-role → Sets role in session/cookie
- Roles: `HOSPITAL_ADMIN`, `CONSULTING_HOSPITAL`, `NOTTO_ADMIN`

> **Note**: No passwords, no JWT. Just role selection for MVP.

**Verify**:
```bash
curl http://localhost:3001/api/auth/roles
# Returns: ["HOSPITAL_ADMIN", "CONSULTING_HOSPITAL", "NOTTO_ADMIN"]
```

---

#### Step 6: Mock Auth Frontend 🟢 **Venu Gopal**
**Time**: 5 min

**Files**:
- `[NEW] frontend/src/app/login/page.tsx` (role selector)
- `[NEW] frontend/src/context/AuthContext.tsx`

**Change**: Role dropdown selector, stores in localStorage, redirects to appropriate dashboard.

**Verify**:
```bash
cd frontend; npm run dev
# Select role, verify redirect to correct dashboard
```

---

### Phase 3: Recipient Management - Hospital Admin (Steps 7-9)

---

#### Step 7: Recipient APIs 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/routes/recipients.ts`
- `[NEW] backend/src/controllers/recipientController.ts`
- `[NEW] backend/src/services/recipientService.ts`

**Change**:
- POST /api/recipients (create with health history)
- GET /api/recipients (list for hospital)
- GET /api/recipients/:id
- PUT /api/recipients/:id
- POST /api/recipients/:id/health-history (add health record)
- POST /api/recipients/:id/medical-reports (upload file)

**Verify**:
```bash
cd backend; npm run test:recipients
```

---

#### Step 8: Health History Upload 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/routes/uploads.ts`
- `[NEW] backend/src/services/uploadService.ts` (GCS or local)
- `[NEW] backend/src/types/healthHistory.ts`

**Change**: 
- File upload for medical reports (PDF, images)
- Health history schema: date, condition, treatment, hospital, notes

**Verify**:
```bash
curl -X POST http://localhost:3001/api/recipients/123/medical-reports \
  -F "file=@report.pdf"
```

---

#### Step 9: Recipient Management UI 🟢 **Venu Gopal**
**Time**: 15 min

**Files**:
- `[NEW] frontend/src/app/(hospital)/recipients/page.tsx`
- `[NEW] frontend/src/app/(hospital)/recipients/new/page.tsx`
- `[NEW] frontend/src/components/recipients/RecipientForm.tsx`
- `[NEW] frontend/src/components/recipients/HealthHistoryForm.tsx`

**Change**: 
- Recipient list with filters (organ, blood type, urgency)
- Add/Edit recipient form with health history section
- File upload for medical reports

**Verify**:
```bash
cd frontend; npm run dev
# Add recipient with health history, verify saved
```

---

### Phase 4: Donor Management - Consulting Hospital (Steps 10-12)

---

#### Step 10: Donor APIs 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/routes/donors.ts`
- `[NEW] backend/src/controllers/donorController.ts`
- `[NEW] backend/src/services/donorService.ts`

**Change**:
- POST /api/donors (create with donation type choice)
- GET /api/donors
- GET /api/donors/:id
- PUT /api/donors/:id
- POST /api/donors/:id/health-history
- POST /api/donors/:id/consent (upload consent form)

Donation types:
- **LIVING**: Before death, only 1 kidney allowed
- **DECEASED**: After death, multiple organs available

**Verify**:
```bash
cd backend; npm run test:donors
```

---

#### Step 11: Donor Validation Logic 🔵 **Vinod Krishna**
**Time**: 5 min

**Files**:
- `[NEW] backend/src/services/donorValidation.ts`

**Change**:
- If LIVING donor → Only allow kidney selection (max 1)
- If DECEASED donor → Allow multiple organs (kidney, liver, heart, lungs, cornea, etc.)
- Validate consent form uploaded

**Verify**:
```bash
cd backend; npm run test:donor-validation
# Test: LIVING donor with liver should fail
```

---

#### Step 12: Donor Registration UI 🟠 **Sandeep**
**Time**: 15 min

**Files**:
- `[NEW] frontend/src/app/(consulting)/donors/page.tsx`
- `[NEW] frontend/src/app/(consulting)/donors/register/page.tsx`
- `[NEW] frontend/src/components/donors/DonorForm.tsx`
- `[NEW] frontend/src/components/donors/DonationTypeSelector.tsx`

**Change**:
- Donation type selection (Living/Deceased) with explanation
- Organ selection (restricted for living donors)
- Health history form
- Consent form upload

**Verify**:
```bash
cd frontend; npm run dev
# Register living donor, verify only kidney available
# Register deceased donor, verify all organs available
```

---

### Phase 5: Matching Engine (Steps 13-15)

---

#### Step 13: Matching Algorithm 🔵 **Vinod Krishna**
**Time**: 15 min

**Files**:
- `[NEW] backend/src/services/matching/matchingEngine.ts`
- `[NEW] backend/src/services/matching/scoringRules.ts`
- `[NEW] backend/src/services/matching/bloodCompatibility.ts`

**Change**: 0-100 scoring:
- Blood type compatibility (mandatory filter)
- HLA matching (0-30 points)
- Urgency score (0-30 points)
- Geographic proximity (0-20 points)
- Waiting time (0-20 points)

**Verify**:
```bash
cd backend; npm run test:matching
```

---

#### Step 14: Match Generation APIs 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/routes/matches.ts`
- `[NEW] backend/src/controllers/matchController.ts`

**Change**:
- POST /api/matches/generate (triggered on donor registration)
- GET /api/matches?donorId=xxx
- PUT /api/matches/:id/accept
- PUT /api/matches/:id/reject

**Verify**:
```bash
cd backend; npm run test:matches
```

---

#### Step 15: Match View UI 🟠 **Sandeep**
**Time**: 10 min

**Files**:
- `[NEW] frontend/src/app/(hospital)/matches/page.tsx`
- `[NEW] frontend/src/components/matches/MatchCard.tsx`

**Change**: Match cards with score breakdown, accept/reject actions.

**Verify**:
```bash
cd frontend; npm run dev
# View matches, accept one, verify status update
```

---

### Phase 6: RAG Chatbot - Main Focus (Steps 16-20)

---

#### Step 16: Knowledge Base Setup 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] docs/knowledge/notto-guidelines.md`
- `[NEW] docs/knowledge/thoa-regulations.md`
- `[NEW] docs/knowledge/faq-donors.md`
- `[NEW] docs/knowledge/faq-recipients.md`
- `[NEW] docs/knowledge/organ-donation-process.md`

**Change**: Prepare knowledge documents covering:
- NOTTO/ROTTO/SOTTO guidelines
- THOA regulations
- Donation process (living vs deceased)
- Eligibility criteria
- FAQs for donors and recipients

**Verify**: Documents created and reviewed for accuracy.

---

#### Step 17: Vector Store Setup 🔵 **Vinod Krishna**
**Time**: 15 min

**Files**:
- `[NEW] backend/src/services/chatbot/vectorStore.ts`
- `[NEW] backend/src/services/chatbot/embeddings.ts`
- `[NEW] backend/src/scripts/indexKnowledge.ts`

**Change**:
- Use Vertex AI Embeddings to convert documents to vectors
- Store in Vertex AI Vector Search (or local Chroma for dev)
- Chunking strategy: 500 tokens with 50 token overlap

**Verify**:
```bash
cd backend; npm run index-knowledge
# Verify: Documents indexed, vector count logged
```

---

#### Step 18: RAG Pipeline 🔵 **Vinod Krishna**
**Time**: 15 min

**Files**:
- `[NEW] backend/src/services/chatbot/ragPipeline.ts`
- `[NEW] backend/src/services/chatbot/llmClient.ts` (Vertex AI Gemini)
- `[NEW] backend/src/services/chatbot/promptTemplates.ts`

**Change**:
1. User query → Generate embedding
2. Retrieve top-k relevant chunks from vector store
3. Construct prompt with context + query
4. Call Gemini for response
5. Add disclaimer: "This is informational only, not medical advice"

**Verify**:
```bash
cd backend; npm run test:rag
# Query: "What is the process for organ donation?"
# Verify: Accurate response with sources
```

---

#### Step 19: Chatbot API 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/routes/chatbot.ts`
- `[NEW] backend/src/controllers/chatbotController.ts`

**Change**:
- POST /api/chatbot/query (main query endpoint)
- GET /api/chatbot/history/:sessionId
- Response includes: answer, sources, confidence

**Verify**:
```bash
curl -X POST http://localhost:3001/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Can I donate my kidney while alive?"}'
```

---

#### Step 20: Chatbot UI 🟢 **Venu Gopal**
**Time**: 15 min

**Files**:
- `[NEW] frontend/src/components/chatbot/ChatWidget.tsx`
- `[NEW] frontend/src/components/chatbot/ChatMessage.tsx`
- `[NEW] frontend/src/components/chatbot/ChatInput.tsx`
- `[NEW] frontend/src/hooks/useChatbot.ts`

**Change**:
- Floating chat widget on all pages
- Message history
- Source citations
- "Not medical advice" disclaimer
- Loading states

**Verify**:
```bash
cd frontend; npm run dev
# Open chat, ask question, verify response renders with sources
```

---

### Phase 7: Admin Panel & Notifications (Steps 21-23)

---

#### Step 21: Admin Dashboard 🟠 **Sandeep**
**Time**: 10 min

**Files**:
- `[NEW] frontend/src/app/(admin)/dashboard/page.tsx`
- `[NEW] frontend/src/components/admin/StatsCards.tsx`
- `[NEW] frontend/src/components/admin/RecentActivity.tsx`

**Change**: NOTTO admin view with:
- Total donors, recipients, matches
- State-wise breakdown
- Recent activity log

**Verify**:
```bash
cd frontend; npm run dev
# Login as NOTTO_ADMIN, verify dashboard loads
```

---

#### Step 22: Analytics APIs 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/routes/analytics.ts`
- `[NEW] backend/src/controllers/analyticsController.ts`

**Change**:
- GET /api/analytics/overview
- GET /api/analytics/by-state
- GET /api/analytics/by-organ

**Verify**:
```bash
cd backend; npm run test:analytics
```

---

#### Step 23: Email Notifications 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/services/notifications/emailService.ts`
- `[NEW] backend/src/services/notifications/templates/`

**Change**: Nodemailer setup with templates:
- Match found notification
- Match accepted/rejected
- New donor registered

**Verify**:
```bash
cd backend; npm run test:email
```

---

### Phase 8: Polish & Testing (Steps 24-25)

---

#### Step 24: Integration Tests 🔵 **Vinod Krishna**
**Time**: 15 min

**Files**:
- `[NEW] backend/tests/integration/donor-flow.test.ts`
- `[NEW] backend/tests/integration/recipient-flow.test.ts`
- `[NEW] backend/tests/integration/chatbot.test.ts`

**Change**: E2E tests for:
- Donor registration → Match generation
- Recipient creation with health history
- Chatbot query-response

**Verify**:
```bash
cd backend; npm run test:integration
```

---

#### Step 25: API Documentation 🔵 **Vinod Krishna**
**Time**: 10 min

**Files**:
- `[NEW] backend/src/swagger.ts`
- `[NEW] docs/API.md`

**Change**: Swagger UI at /api/docs

**Verify**:
```bash
# Open http://localhost:3001/api/docs
```

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| GCP Vertex AI quota | Request quota increase; fallback to OpenAI |
| RAG accuracy | Curated knowledge base; human review |
| File upload size | Limit to 10MB; compress on client |
| Mock auth in production | Add auth flag; real auth in Phase 2 |

---

## Rollback Plan

| Phase | Strategy |
|-------|----------|
| Database | MongoDB snapshots |
| Backend | Git revert; redeploy |
| Frontend | Git revert; redeploy |
| Vector Store | Re-index from source docs |

---

*Generated by Superpowers Write Plan Workflow*
