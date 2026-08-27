# NexusMail — Production Deployment Guide

> **Comprehensive deployment instructions for NexusMail (React 19 + Framer Motion + Express + Neon PostgreSQL + Google Gemini 3.5 Flash Lite).**

---

## 🌐 Production Architecture

```text
  ┌────────────────────────────────────────────────────────┐
  │                 Users & Web Browsers                   │
  └──────────────────────────┬─────────────────────────────┘
                             │ HTTPS / TLS 1.3
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │             Frontend (Vercel / Netlify / CDN)          │
  │          • React 19 + Framer Motion (Vite Build)       │
  │          • URL: https://nexusmail.yourdomain.com        │
  └──────────────────────────┬─────────────────────────────┘
                             │ /api/* Proxied or CORS REST
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │        Backend Service (Render / Railway / Fly.io)     │
  │          • Node.js / Express Runtime                   │
  │          • AES-256-GCM Token Encryption Vault          │
  │          • URL: https://api.nexusmail.yourdomain.com   │
  └─────────────┬──────────────────────────┬───────────────┘
                │                          │
                ▼                          ▼
  ┌──────────────────────────┐  ┌──────────────────────────┐
  │  Neon PostgreSQL Cloud   │  │   External Cloud APIs    │
  │  • Serverless Database   │  │   • Google OAuth 2.0     │
  │  • Prisma Schema Models  │  │   • Gmail API v1         │
  │  • SSL Mode Required     │  │   • Gemini 3.5 AI Studio │
  └──────────────────────────┘  └──────────────────────────┘
```

---

## 📋 Prerequisites & Credentials Checklist

Before deploying, ensure you have gathered the following:

- [ ] **Neon PostgreSQL Connection URI**: Created at [neon.tech](https://neon.tech) (ensure `?sslmode=require` is appended).
- [ ] **Google Gemini API Key**: Created at [Google AI Studio](https://aistudio.google.com/).
- [ ] **Google Cloud OAuth 2.0 Client ID & Secret**: Created at [Google Cloud Console](https://console.cloud.google.com/).
- [ ] **32+ Character Random Session Secret**: For signing session cookies.
- [ ] **64-Hex Character Encryption Key**: 32-byte hexadecimal key for AES-256-GCM token encryption.

---

## 🔑 Generating Cryptographic Keys

Run the following command in your terminal to generate cryptographically strong random secrets:

```bash
# Generate 64-hex character AES-256 ENCRYPTION_KEY
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate 32+ character SESSION_SECRET
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(24).toString('base64'))"
```

---

## 🔐 Environment Variables Matrix

### Backend Server Environment (`server/.env`)

| Variable | Description | Example (Production) |
| :--- | :--- | :--- |
| `PORT` | Backend port | `5000` or assigned by host (`process.env.PORT`) |
| `NODE_ENV` | Environment mode | `production` |
| `CLIENT_URL` | Production Frontend Origin (No trailing slash) | `https://nexusmail.yourdomain.com` |
| `DATABASE_URL` | Neon PostgreSQL pooled connection URI | `postgresql://user:pass@ep-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Web Client ID | `123456789-xyz.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Web Client Secret | `GOCSPX-xxxxxxxxxxxx` |
| `GOOGLE_REDIRECT_URI` | Full production OAuth callback URL | `https://api.nexusmail.yourdomain.com/api/auth/google/callback` |
| `SESSION_SECRET` | Random string for signing cookies (min 32 chars) | `k9J3xL8mP2qR5vT7wY1zB4cD6fH8jK0n` |
| `ENCRYPTION_KEY` | 64-character hexadecimal key (AES-256-GCM) | `e4d909c290d0fb1ca068ffaddf22cbd0a...` |
| `AI_PROVIDER` | AI Service Provider | `gemini` |
| `AI_API_KEY` | Google AI Studio Gemini API Key | `AIzaSyB...` |
| `AI_MODEL` | Gemini Model Identifier | `gemini-3.5-flash-lite` |

### Frontend Client Environment (`client/.env`)

| Variable | Description | Example (Production) |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend API base path | `/api` (if rewrites configured) or `https://api.nexusmail.yourdomain.com/api` |

---

## 🚀 Option 1: Deploying to Netlify (Frontend) + Render / Railway (Backend)

### Step 1: Deploy Neon PostgreSQL Database
1. Go to [neon.tech](https://neon.tech) and create a free project (e.g., `nexusmail-db`).
2. Copy the **Connection String** with pooled connection enabled.

### Step 2: Deploy Backend to Render / Railway
1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
5. Add all Environment Variables listed in the **Backend Server Environment** table above.
6. Deploy the service and note your backend URL: `https://nexusmail-api.onrender.com`.

### Step 3: Configure Google Cloud OAuth 2.0 Redirects
1. Open [Google Cloud Console](https://console.cloud.google.com/) -> **Credentials**.
2. Edit your **OAuth 2.0 Client ID**.
3. Add to **Authorized JavaScript origins**:
   - `https://your-site-name.netlify.app` (your Netlify site URL)
   - `https://nexusmail.yourdomain.com` (if using custom domain)
4. Add to **Authorized redirect URIs**:
   - `https://nexusmail-api.onrender.com/api/auth/google/callback`
   - `https://api.nexusmail.yourdomain.com/api/auth/google/callback`
5. Save changes.

### Step 4: Deploy Frontend to Netlify
1. Log in to [Netlify](https://app.netlify.com/) and click **Add new site** -> **Import an existing project**.
2. Connect your **GitHub** account and select the `Intelligent_Email_Assistant` repository.
3. Configure Build Settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist` (or `dist`)
4. In `client/netlify.toml`, replace the backend destination with your deployed Render/Railway backend URL:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://nexusmail-api.onrender.com/api/:splat"
     status = 200
     force = true

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
5. In Netlify Site Settings -> **Environment variables**, add:
   - `VITE_API_BASE_URL`: `/api`
6. Click **Deploy Site**.
7. Update `CLIENT_URL` in your Render/Railway backend environment variables with your final Netlify URL (e.g. `https://your-site-name.netlify.app`).

---

## ⚡ Option 2: Deploying to Vercel (Frontend) + Render / Railway (Backend)

### Step 1: Deploy Frontend to Vercel
1. Open [Vercel Dashboard](https://vercel.com/) -> **Add New Project**.
2. Select your repository and set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Add `vercel.json` in `client/` for routing & proxy rewrites:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://nexusmail-api.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: `/api`
6. Click **Deploy**.

---

## 🐳 Option 2: Docker Container Deployment

You can containerize the application for unified cloud hosting (AWS ECS, Google Cloud Run, DigitalOcean App Platform):

### Server `Dockerfile` (`server/Dockerfile`)

```dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["npm", "start"]
```

### Client `Dockerfile` (`client/Dockerfile`)

```dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Nginx Production Stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Unified `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - NODE_ENV=production
      - CLIENT_URL=http://localhost:80
      - DATABASE_URL=${DATABASE_URL}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GOOGLE_REDIRECT_URI=${GOOGLE_REDIRECT_URI}
      - SESSION_SECRET=${SESSION_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - AI_PROVIDER=gemini
      - AI_API_KEY=${AI_API_KEY}
      - AI_MODEL=gemini-3.5-flash-lite

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## 🔄 Database Migration & Schema Updates in Production

Whenever you modify `server/prisma/schema.prisma`:

```bash
# In your CI/CD Pipeline or Deployment Hook:
cd server
npx prisma generate
npx prisma db push
```

> **Tip:** For production environments with strict change auditing, use `npx prisma migrate deploy` with pre-generated migration files.

---

## 🔒 Production Security Checklist

- [x] **HTTPS Everywhere**: Ensure SSL certificates are active for both frontend and API domains.
- [x] **Secure Cookie Headers**: Signed cookies are configured with `httpOnly: true`, `secure: true`, and `sameSite: 'lax'` in production.
- [x] **AES-256-GCM Token Encryption**: User refresh and access tokens are encrypted with authenticated tags before storing in PostgreSQL.
- [x] **CORS Allowlist**: Set `CLIENT_URL` strictly to your production domain to reject unauthorized cross-origin requests.
- [x] **Rate Limiting**: Configured with `express-rate-limit` on `/api/ai/*` and `/api/auth/*` to prevent brute-force attacks.
- [x] **Prompt-Injection Sandboxing**: Untrusted email bodies are quarantined in delimited blocks before dispatching to Gemini AI.

---

## 🩺 Verifying Deployment & Health Checks

Once deployed, verify your production installation:

1. **Verify Backend Health**:
   ```bash
   curl -I https://api.nexusmail.yourdomain.com/api/auth/me
   # Expected: 401 Unauthorized (API is live and rejecting unauthenticated requests)
   ```

2. **Verify Google OAuth Flow**:
   - Open `https://nexusmail.yourdomain.com`
   - Click **Sign In with Google**
   - Verify consent screen shows your verified domain name
   - Complete Google login and verify redirection to `/inbox`

3. **Verify Gemini 3.5 AI Generation**:
   - Open any email thread in `/inbox`
   - Click **Generate Executive Summary**
   - Confirm Gemini 3.5 Flash Lite delivers takeaways, action items, and deadline pills in < 1.5 seconds.
