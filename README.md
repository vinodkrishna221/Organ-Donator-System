# 🫀 Organ Donation & Recipient Matching Platform (India)

A centralized, AI-powered platform to revolutionize India's organ donation ecosystem. By connecting hospitals, donors, recipients, and regulatory bodies (NOTTO/ROTTO/SOTTO), we aim to reduce organ allocation time from hours to minutes and save thousands of lives annually.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🤖 RAG-Powered Chatbot
- AI assistant powered by Google Vertex AI
- Answers stakeholder queries using official THOA & NOTTO guidelines
- Context-aware responses with source citations

### 🎯 Automated Matching Engine
- Real-time organ-recipient matching
- Scoring based on blood type compatibility, HLA matching, urgency level, and geographical proximity
- Prioritization algorithms aligned with NOTTO protocols

### 🏥 Hospital Dashboard
- Manage recipient waitlists
- Track organ availability
- Coordinate transplant logistics

### 🩺 Consulting Hospital Portal
- Streamlined donor registration
- Digital consent management
- Medical documentation workflow

### 📊 Admin Analytics
- Real-time insights for NOTTO/ROTTO/SOTTO
- Donation statistics and trends
- Compliance monitoring

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **AI/ML** | Google Vertex AI (Embeddings, Gemini) |
| **Authentication** | Role-based access control (Mock auth for MVP) |
| **Email** | Nodemailer with SMTP |
| **Validation** | Zod schema validation |

---

## 📂 Project Structure

```
Organ-Donator-System/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Database & environment config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth & error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   │   ├── chatbot/       # RAG pipeline & vector store
│   │   │   ├── matching/      # Organ matching engine
│   │   │   └── notifications/ # Email service
│   │   └── index.ts           # Server entry point
│   └── package.json
│
├── frontend/                   # Next.js web application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── (admin)/       # Admin dashboard routes
│   │   │   ├── (consulting)/  # Consulting hospital routes
│   │   │   ├── (hospital)/    # Hospital portal routes
│   │   │   └── login/         # Authentication page
│   │   ├── components/        # React components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── chatbot/       # Chat widget
│   │   │   ├── donors/        # Donor management
│   │   │   ├── matches/       # Match display
│   │   │   ├── recipients/    # Recipient management
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   └── lib/               # Utilities & API client
│   └── package.json
│
├── docs/                       # Documentation
│   ├── API.md                 # API reference
│   ├── VERTEX_AI_RAG_GUIDE.md # RAG setup guide
│   └── knowledge/             # Knowledge base for chatbot
│       ├── faq-donors.md
│       ├── faq-recipients.md
│       ├── notto-guidelines.md
│       ├── organ-donation-process.md
│       └── thoa-regulations.md
│
├── .env.example               # Environment variables template
├── package.json               # Root package with workspaces
└── README.md                  # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (local instance or MongoDB Atlas account)
- **Git**

Optional (for AI features):
- **Google Cloud Platform** account with Vertex AI enabled
- **GCP Service Account** with appropriate permissions

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vinodkrishna221/Organ-Donator-System.git
cd Organ-Donator-System
```

### 2. Install Dependencies

The project uses npm workspaces to manage both frontend and backend:

```bash
# Install all dependencies (root, backend, and frontend)
npm install
```

Or install separately:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Configure Variables

Edit `.env` with your configuration:

```env
# Backend Server
NODE_ENV=development
PORT=3001

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/organ-donation
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/organ-donation

# Google Cloud Platform (for AI features)
GCP_PROJECT_ID=your-gcp-project-id
GCP_REGION=us-central1
VERTEX_AI_LOCATION=us-central1

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@organdonation.in

# Frontend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## ▶️ Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
# From root directory
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend (runs on http://localhost:3001)
cd backend
npm run dev

# Terminal 2 - Frontend (runs on http://localhost:3000)
cd frontend
npm run dev
```

### Production Build

```bash
# Build both projects
npm run build

# Start backend
cd backend
npm start

# Start frontend (in another terminal)
cd frontend
npm start
```

### Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api |
| API Health Check | http://localhost:3001/api/health |

---

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Authentication** |||
| POST | `/auth/login` | Mock login with role selection |
| POST | `/auth/logout` | Clear session |
| **Donors** |||
| GET | `/donors` | List all donors |
| POST | `/donors` | Register new donor |
| GET | `/donors/:id` | Get donor details |
| PUT | `/donors/:id` | Update donor |
| **Recipients** |||
| GET | `/recipients` | List all recipients |
| POST | `/recipients` | Register new recipient |
| GET | `/recipients/:id` | Get recipient details |
| PUT | `/recipients/:id` | Update recipient |
| **Matches** |||
| GET | `/matches` | Get all matches |
| POST | `/matches/generate` | Generate matches for an organ |
| PUT | `/matches/:id/status` | Update match status |
| **Chatbot** |||
| POST | `/chatbot/query` | Send query to RAG chatbot |
| **Analytics** |||
| GET | `/analytics/dashboard` | Get dashboard statistics |

For detailed API documentation, see [docs/API.md](docs/API.md).

---

## 🧪 Testing

### Run All Tests

```bash
cd backend
npm test
```

### Run Specific Test Suites

```bash
# Recipient tests
npm run test:recipients

# Donor tests
npm run test:donors

# Matching engine tests
npm run test:matching

# RAG pipeline tests
npm run test:rag

# Integration tests
npm run test:integration
```

### Linting

```bash
# Lint all workspaces
npm run lint

# Or separately
cd backend && npm run lint
cd frontend && npm run lint
```

---

## 👥 User Roles

The platform supports three user roles:

| Role | Access | Features |
|------|--------|----------|
| **Hospital** | Hospital Portal | Manage recipients, view matches, coordinate transplants |
| **Consulting** | Consulting Portal | Register donors, manage consent, upload documents |
| **Admin** | Admin Dashboard | View analytics, manage users, system configuration |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [NOTTO](https://notto.gov.in/) - National Organ & Tissue Transplant Organisation
- [THOA 1994](https://legislative.gov.in/sites/default/files/A1994-42.pdf) - Transplantation of Human Organs Act
- Google Cloud Platform for Vertex AI services

---

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

<p align="center">Made with ❤️ for saving lives</p>
