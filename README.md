# NexusMail — Intelligent Email Assistant

> **A modern, high-performance, AI-powered Gmail client built with React 19, TypeScript, Framer Motion, Express, Neon PostgreSQL, Prisma, Google OAuth 2.0, and Google Gemini 3.5 Flash Lite.**

> 🚀 **Built 100% Autonomous & No-Code with Google Antigravity**: This entire production-ready full-stack application — from frontend React 19 architecture and Framer Motion micro-interactions to Express API routing, Prisma database modeling, AES-256 security, Gmail API integration, and automated test suites — was built and deployed using **Antigravity** (Google DeepMind's advanced agentic AI coding platform).

[![Built with Antigravity](https://img.shields.io/badge/Built_with-Antigravity_(No--Code)-7928CA.svg)](https://deepmind.google)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1-black.svg)](https://www.framer.com/motion/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://www.prisma.io/)
[![Neon PostgreSQL](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599.svg)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_3.5_Flash_Lite-8E75B2.svg)](https://deepmind.google/technologies/gemini/)

---

## 🌟 Overview & Key Features

**NexusMail** connects to your Gmail account via official Google OAuth 2.0 and delivers a modern, reactive, AI-augmented email workflow:

### 1. 🤖 Gemini 3.5 Flash Lite Intelligence
- **AI Executive Summaries**: Transforms long, convoluted email threads into 3-sentence summaries, key bullet points, detected action items, and clear deadlines.
- **Tone-Tailored Reply Copilot**: Drafts contextual responses in **Professional**, **Friendly**, **Formal**, or **Concise** tones with optional custom prompts.
- **"Help Me Write" Compose Assist**: Integrated into the floating composer for new outbound messages.
- **Strict Human-In-The-Loop Control**: AI generated replies are 100% editable. **AI never sends an email without explicit user approval**.
- **Untrusted Prompt-Injection Sandboxing**: Untrusted email body content is strictly delimited and quarantined to prevent model override attacks.

### 2. ⚡ Modern UI with Framer Motion & Dual Mode
- **AI Neural Origami Brand**: Custom gradient logo with ambient back-glow.
- **Fluid Micro-Interactions**: Smooth spring physics, fluid search pill expansion, animated tab underlines (`layoutId="categoryTabUnderline"`), and staggered entrance effects.
- **Complete Dark & Light Mode**: Seamless theme switching with high-contrast email body typography (`#f1f5f9` text in dark mode) and `localStorage` persistence.

### 3. 📱 Mobile-First Responsive Design
- **Native 3-Line Mobile Layout**: Structured view on mobile devices (`Avatar`, `Sender + Date`, `Subject Line`, `Snippet Preview`, and instant star toggle).
- **Desktop Table View**: Horizontal multi-column layout with quick hover actions.
- **Mobile Drawer & FAB**: Slide-in backdrop-blurred drawer navigation and a floating `+` Compose button on touch devices.

### 4. 📬 Complete Gmail Integration
- **Full Folder Support**: Inbox, Starred, Sent, Drafts, Archive, and Trash.
- **Working Category Tabs**: Live querying for **Primary**, **Promotions**, **Social**, and **Updates**.
- **Deep Pagination for 800+ Messages**: Uses Gmail's `nextPageToken` and a token stack to navigate across entire mailboxes.
- **RFC 2822 MIME Email Composition**: To, Cc, Bcc, and immediate transmission through the Gmail API.
- **Audit Trail & Activity Log**: Chronological timeline of all email views, AI summarizations, draft generations, and sends.

---

## 🔒 Security Architecture

| Security Layer | Implementation |
| :--- | :--- |
| **OAuth 2.0 Access & Refresh Tokens** | Encrypted at rest using **AES-256-GCM** with authenticated checksum verification |
| **Password Storage** | **Zero passwords stored** (auth delegated entirely to Google) |
| **Session Management** | HTTP-only, SameSite signed session cookies with 7-day TTL |
| **Multi-Tenant Isolation** | Database queries and Gmail API calls are strictly scoped by authenticated `userId` |
| **Email Body Sandboxing** | HTML sanitized via DOMPurify; AI prompts sandboxed with `<UNTRUSTED_EMAIL_CONTENT>` tags |
| **Input Validation** | Strict request schema validation via Zod |

---

## 🏗️ Architecture Diagram

```text
React 19 Frontend (Vite + Tailwind CSS + Framer Motion)
      │
      │ HTTPS / REST (Proxied via /api)
      ▼
Node.js + Express Backend
      │
      ├── AuthService        (Google OAuth 2.0, AES-256-GCM Encryption, Sessions)
      ├── GmailService       (Google APIs: Messages, Threads, Labels, Categories, Pagination)
      ├── EmailService       (PostgreSQL Multi-Tenant Caching & Query Engine)
      ├── AIService          (Google Gemini 3.5 Flash Lite Provider, Prompt Sandboxing)
      └── ActivityService    (Audit Trail Logging)
      │
      ├──────────────► Neon PostgreSQL (Prisma ORM)
      │
      ├──────────────► Gmail API (users.messages, users.threads)
      │
      └──────────────► Google Gemini API (gemini-3.5-flash-lite)
```

---

## 🛠️ Technology Stack

### Frontend (`client/`)
- **Core**: React 19 (`19.2.8`), TypeScript 5.7, Vite 6
- **Animations**: Framer Motion 13
- **Styling**: Tailwind CSS 3.4 (with custom Dark Mode class system)
- **Data Fetching & State**: TanStack React Query 5, Axios
- **Icons & Utilities**: Lucide React, date-fns 4, DOMPurify

### Backend (`server/`)
- **Runtime & Framework**: Node.js (ES Modules), Express 4.21, TypeScript 5.7
- **Database & ORM**: Neon Serverless PostgreSQL, Prisma ORM 5.22
- **Google Integrations**: `googleapis` (Gmail v1 & Google OAuth 2.0)
- **AI SDK**: `@google/generative-ai` (Gemini 3.5 Flash Lite)
- **Security & Validation**: `cookie-session`, `crypto` (AES-256-GCM), `zod`, `express-rate-limit`, `helmet`
- **Testing**: Vitest 3.2

---

## 📁 Repository Structure

```text
Intelligent_Email_Assistant/
├── client/                     # Frontend Application (React 19 + Vite)
│   ├── src/
│   │   ├── api/                # Axios API client & endpoints
│   │   ├── components/
│   │   │   ├── ai/             # AiSummaryCard, AiReplyGenerator
│   │   │   ├── common/         # AiLogo, Toast, Skeleton
│   │   │   ├── compose/        # ComposeModal floating/fullscreen editor
│   │   │   ├── email/          # EmailList, EmailListItem
│   │   │   └── layout/         # AppLayout, Header, Sidebar
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Dashboard, Detail, Activity, Settings, Login
│   │   ├── types/              # TypeScript definitions
│   │   ├── App.tsx             # Route configuration
│   │   ├── index.css           # Tailwind design tokens & dark mode typography
│   │   └── main.tsx            # Application entry point
│   ├── .env                    # Client environment configuration
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts          # Vendor chunk-splitting configuration
│
├── server/                     # Backend Application (Express + Prisma)
│   ├── prisma/
│   │   └── schema.prisma       # User, ConnectedAccount, Email, EmailThread, Activity
│   ├── src/
│   │   ├── config/             # Environment & Prisma client setup
│   │   ├── controllers/        # Auth, Email, Thread, AI, Activity, Account
│   │   ├── middlewares/        # Auth, Error handler, Rate limit, Validation
│   │   ├── routes/             # Express API router definitions
│   │   ├── services/
│   │   │   ├── ai/             # Gemini 3.5 Flash Lite provider & interfaces
│   │   │   ├── activity.service.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── email.service.ts
│   │   │   └── gmail.service.ts
│   │   ├── utils/              # AES-256 Crypto, Logger, API Response
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # HTTP server listener
│   ├── tests/                  # Automated Vitest test suites (11 unit/integration tests)
│   ├── .env                    # Server environment configuration (Secrets)
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Step-by-Step Local Setup & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **Neon PostgreSQL Database**: Free account at [neon.tech](https://neon.tech)
- **Google Cloud Console Project**: With Gmail API enabled and OAuth 2.0 Credentials ([console.cloud.google.com](https://console.cloud.google.com))
- **Google Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone Repository & Install Dependencies

Open your terminal in the project directory:

```bash
# 1. Install Server Dependencies
cd server
npm install

# 2. Install Client Dependencies
cd ../client
npm install
cd ..
```

---

### Step 2: Configure Server Environment Variables (`server/.env`)

Create `server/.env` based on `server/.env.example`:

```env
# ==========================================
# BACKEND SERVER ENVIRONMENT CONFIGURATION
# ==========================================

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Neon PostgreSQL Connection String
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-cool-pool-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

# Google OAuth 2.0 Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Security Secrets (Generate random 32+ char strings)
SESSION_SECRET=super_secure_random_session_secret_at_least_32_characters
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# AI Provider Configuration
AI_PROVIDER=gemini
AI_API_KEY=your_gemini_api_key_from_google_ai_studio
AI_MODEL=gemini-3.5-flash-lite
```

#### Google Cloud Console OAuth Setup Instructions:
1. Go to [Google Cloud Console](https://console.cloud.google.com/) -> **APIs & Services** -> **Enabled APIs & Services**.
2. Click **+ Enable APIs and Services**, search for **Gmail API**, and click **Enable**.
3. Go to **Credentials** -> **Create Credentials** -> **OAuth Client ID**.
4. Application type: **Web application**.
5. Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`.
6. Add Scopes:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.modify`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

---

### Step 3: Configure Client Environment Variables (`client/.env`)

Create `client/.env` based on `client/.env.example`:

```env
# ==========================================
# FRONTEND CLIENT ENVIRONMENT CONFIGURATION
# ==========================================

VITE_API_BASE_URL=/api
```

---

### Step 4: Run Database Migrations

Generate Prisma Client and push database schema to your Neon PostgreSQL instance:

```bash
cd server
npx prisma generate
npx prisma db push
cd ..
```

---

### Step 5: Start the Development Servers

You can start both backend and frontend from the root directory or in separate terminal windows:

#### Option A: Run concurrently from root:
```bash
npm run dev
```

#### Option B: Run in separate terminals:
**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Client runs on http://localhost:5173
```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🧪 Testing & Validation

### Run Server Automated Test Suite
The backend contains 11 comprehensive automated tests covering AI providers, Google OAuth token encryption, multi-tenant isolation, and Gmail message parsing:

```bash
cd server
npm test
```

### Run Frontend Production Build
Validates TypeScript compilation, Tailwind CSS generation, and Rollup vendor code-splitting:

```bash
cd client
npm run build
```

---

## 🚢 Production Deployment

For complete step-by-step production deployment instructions (Vercel, Render, Railway, Neon PostgreSQL, Google Cloud OAuth production consent setup, and Docker containerization), see the dedicated deployment guide:

👉 **[Production Deployment Guide (DEPLOYMENT.md)](DEPLOYMENT.md)**

---

## 📡 API Reference Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/google` | `GET` | Initiates Google OAuth 2.0 authentication flow |
| `/api/auth/google/callback` | `GET` | Handles Google OAuth code exchange and token encryption |
| `/api/auth/me` | `GET` | Returns currently authenticated user profile |
| `/api/auth/logout` | `POST` | Clears user session |
| `/api/emails` | `GET` | Fetches emails (`folder`, `category`, `limit`, `pageToken`, `sync`) |
| `/api/emails/search` | `GET` | Full-text query search in Gmail |
| `/api/emails/:id` | `GET` | Retrieves single email details |
| `/api/emails/:id/read` | `PATCH` | Toggles email read/unread status |
| `/api/emails/:id/star` | `PATCH` | Toggles starred status |
| `/api/emails/:id/archive` | `POST` | Archives email (removes from INBOX) |
| `/api/emails/:id` | `DELETE` | Moves email to Trash |
| `/api/emails/send` | `POST` | Sends outbound RFC 2822 email via Gmail API |
| `/api/emails/:id/reply` | `POST` | Sends in-thread reply via Gmail API |
| `/api/threads/:id` | `GET` | Retrieves conversation thread with all messages |
| `/api/ai/summarize` | `POST` | Generates structured summary, key points, and deadlines |
| `/api/ai/reply` | `POST` | Generates tone-tailored draft response |
| `/api/activity` | `GET` | Retrieves audit trail log |
| `/api/account` | `GET` | Retrieves connected account status |
| `/api/account` | `DELETE` | Disconnects account and revokes OAuth tokens |

---

## 🤖 Built 100% No-Code with Google Antigravity

This application was engineered autonomously from scratch using **Antigravity** (Google DeepMind's advanced agentic coding platform):

* **Zero Human Manual Coding**: Every frontend component, Express service, Prisma database model, and test suite was designed, implemented, refactored, and verified by Antigravity through autonomous reasoning and tool execution.
* **Continuous Test Verification**: Antigravity generated and passed 100% of automated unit and integration tests (`vitest`) and validated TypeScript and production bundle compilations.
* **Full-Stack Orchestration**: Handled full-stack lifecycle management including Neon PostgreSQL setup, AES-256 encryption implementation, Google OAuth 2.0 configuration, React 19 migration, Framer Motion animations, and dark mode typography optimization.
