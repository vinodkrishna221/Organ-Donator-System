# Organ Donation Platform - API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

The platform uses mock authentication with role-based access. Set the role via:

1. **Header**: `X-User-Role: HOSPITAL_ADMIN`
2. **Header**: `X-Hospital-Id: <hospital_id>` (optional)

Or use the `/api/auth/select-role` endpoint to set a cookie.

### Roles
- `HOSPITAL_ADMIN` - Manage recipients and view matches
- `CONSULTING_HOSPITAL` - Register donors
- `NOTTO_ADMIN` - View analytics and manage system

---

## Endpoints

### Auth

#### GET /api/auth/roles
Get available roles.

**Response:**
```json
{
  "success": true,
  "data": [
    { "value": "HOSPITAL_ADMIN", "label": "Hospital Admin", "description": "..." }
  ]
}
```

#### POST /api/auth/select-role
Select a role (mock login).

**Body:**
```json
{ "role": "HOSPITAL_ADMIN", "hospitalId": "optional" }
```

#### GET /api/auth/me
Get current user info.

#### POST /api/auth/logout
Clear session.

---

### Recipients

**Requires:** `HOSPITAL_ADMIN` or `NOTTO_ADMIN` role

#### POST /api/recipients
Create a new recipient.

**Body:**
```json
{
  "name": "John Doe",
  "age": 45,
  "gender": "MALE",
  "bloodType": "A+",
  "organNeeded": "KIDNEY",
  "urgencyLevel": "HIGH",
  "contact": { "phone": "...", "emergencyContact": "..." },
  "address": { "city": "Mumbai", "state": "Maharashtra", "pincode": "400001" }
}
```

#### GET /api/recipients
List recipients (filters: organNeeded, bloodType, urgencyLevel, status).

#### GET /api/recipients/:id
Get recipient by ID.

#### PUT /api/recipients/:id
Update recipient.

#### POST /api/recipients/:id/health-history
Add health history entry.

#### POST /api/recipients/:id/medical-reports
Add medical report (after uploading file).

---

### Donors

**Requires:** `CONSULTING_HOSPITAL` role

#### POST /api/donors
Register a new donor.

**Body:**
```json
{
  "name": "Jane Doe",
  "age": 35,
  "gender": "FEMALE",
  "bloodType": "O+",
  "donationType": "LIVING",  
  "organsAvailable": ["KIDNEY"],
  "contact": { "phone": "...", "emergencyContact": "..." },
  "address": { "city": "Delhi", "state": "Delhi", "pincode": "110001" }
}
```

> **Note:** LIVING donors can only donate 1 KIDNEY. DECEASED donors can donate multiple organs.

#### GET /api/donors
List donors.

#### GET /api/donors/:id
Get donor by ID.

#### PUT /api/donors/:id
Update donor.

#### POST /api/donors/:id/health-history
Add health history entry.

#### POST /api/donors/:id/consent
Add consent form URL.

---

### Matches

#### POST /api/matches/generate
Generate matches for a donor.

**Body:**
```json
{ "donorId": "..." }
```

#### GET /api/matches?donorId=xxx
Get matches by donor.

#### GET /api/matches?recipientId=xxx
Get matches by recipient.

#### PUT /api/matches/:id/accept
Accept a match.

#### PUT /api/matches/:id/reject
Reject a match.

**Body:**
```json
{ "reason": "Optional rejection reason" }
```

#### GET /api/matches/stats
Get match statistics (NOTTO_ADMIN only).

---

### Uploads

#### POST /api/uploads/medical-report
Upload a medical report file.

**Form Data:**
- `file`: File (PDF, JPEG, PNG, DOC, DOCX; max 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "uuid.pdf",
    "originalName": "report.pdf",
    "url": "http://localhost:3001/uploads/medical-reports/uuid.pdf"
  }
}
```

#### POST /api/uploads/consent-form
Upload a consent form.

---

### Chatbot

#### POST /api/chatbot/query
Query the RAG chatbot.

**Body:**
```json
{
  "query": "What is the organ donation process?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "...",
    "answer": "...",
    "sources": ["faq-donors.md", "organ-donation-process.md"],
    "confidence": "HIGH"
  }
}
```

#### GET /api/chatbot/history/:sessionId
Get chat history.

#### DELETE /api/chatbot/history/:sessionId
Clear chat history.

---

### Analytics

**Requires:** `NOTTO_ADMIN` role

#### GET /api/analytics/overview
Get platform overview statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalDonors": 150,
      "totalRecipients": 500,
      "totalMatches": 200,
      "acceptedMatches": 50,
      "pendingMatches": 100,
      "successRate": "25.0%"
    }
  }
}
```

#### GET /api/analytics/by-state
Get statistics by state.

#### GET /api/analytics/by-organ
Get statistics by organ type.

#### GET /api/analytics/recent
Get recent activity feed.

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

Common HTTP status codes:
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## Health Check

```
GET /health
```

Returns server status and environment info.
