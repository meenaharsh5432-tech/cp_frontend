# ContentPilot

AI content repurposing tool that adapts to your voice profile. One long-form piece → Twitter thread, LinkedIn post, newsletter, and hook — written in your voice.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or Railway/Neon/Supabase)
- Google OAuth credentials
- OpenAI API key
- Razorpay account (for payments — works in India & internationally)

### 1. Clone & install

```bash
# Backend
cd cp_backend
cp .env.example .env    # fill in your values
npm install

# Frontend
cd ../cp_frontend
cp .env.example .env    # fill in your values
npm install
```

### 2. Set up the database

```bash
cd cp_backend
npm run db:generate     # generate Prisma client
npm run db:push         # push schema to DB (dev)
# or: npm run db:migrate (production)
```

### 3. Run in development

```bash
# Terminal 1 — backend
cd cp_backend && npm run dev

# Terminal 2 — frontend
cd cp_frontend && npm run dev
```

App runs at http://localhost:5173, API at http://localhost:3000.

---

## Environment Variables

### Backend (`cp_backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Random 32+ char secret for JWT signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `OPENAI_API_KEY` | OpenAI API key (GPT-4o) |
| `RAZORPAY_KEY_ID` | Razorpay API key ID (`rzp_live_...` or `rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook signing secret |
| `RAZORPAY_PLAN_SOLO` | Razorpay plan ID for Solo plan |
| `RAZORPAY_PLAN_TEAM` | Razorpay plan ID for Team plan |
| `RAZORPAY_PLAN_SCALE` | Razorpay plan ID for Scale plan |
| `FRONTEND_URL` | Frontend origin (e.g. `https://yourapp.vercel.app`) |
| `BACKEND_URL` | Backend origin (e.g. `https://yourapi.railway.app`) |

### Frontend (`cp_frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (leave empty for Vite proxy in dev) |

---

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Authorised redirect URIs:
   - Dev: `http://localhost:3000/api/auth/google/callback`
   - Prod: `https://yourapi.railway.app/api/auth/google/callback`

---

## Razorpay Setup

Razorpay supports payments from India (UPI, NetBanking, Wallets, cards) and internationally (credit/debit cards).

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Subscriptions → Plans** and create 3 plans:
   - Solo — ₹1,900/mo (or your currency equivalent), monthly interval
   - Team — ₹4,900/mo, monthly interval
   - Scale — ₹9,900/mo, monthly interval
3. Copy each plan ID (`plan_...`) into your backend `.env`
4. Go to **Settings → API Keys** and generate a key pair — copy into `.env`
5. Go to **Settings → Webhooks** and add an endpoint:
   - URL: `POST https://yourapi.railway.app/api/billing/webhook`
   - Events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.expired`
   - Copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`

For local webhook testing, use [ngrok](https://ngrok.com) to expose localhost:
```bash
ngrok http 3000
# Use the ngrok URL as your webhook endpoint in Razorpay dashboard
```

### Payment flow

1. User clicks upgrade → backend creates a Razorpay subscription
2. Razorpay checkout modal opens in browser (no redirect needed)
3. User completes payment via UPI / card / NetBanking / wallet
4. Backend verifies the payment signature and upgrades the user tier immediately
5. Razorpay also sends webhook events for async confirmation and renewals

---

## Deployment

### Backend → Render

1. Push the repo to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo and select the root of the monorepo
4. Render will auto-detect `render.yaml` and pre-fill the settings — confirm:
   - **Root directory:** `cp_backend`
   - **Build command:** `npm install && npm run db:generate && npm run db:push`
   - **Start command:** `npm start`
5. Add all environment variables in the Render dashboard (Settings → Environment):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `JWT_SECRET` | Random 32+ char secret |
   | `GOOGLE_CLIENT_ID` | From Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
   | `OPENAI_API_KEY` | Your OpenAI key |
   | `RAZORPAY_KEY_ID` | `rzp_live_...` |
   | `RAZORPAY_KEY_SECRET` | Razorpay secret |
   | `RAZORPAY_WEBHOOK_SECRET` | Your webhook secret |
   | `RAZORPAY_PLAN_SOLO` | `plan_...` |
   | `RAZORPAY_PLAN_TEAM` | `plan_...` |
   | `RAZORPAY_PLAN_SCALE` | `plan_...` |
   | `FRONTEND_URL` | `https://your-app.vercel.app` |
   | `BACKEND_URL` | `https://your-api.onrender.com` |
   | `PORT` | `10000` |

6. Deploy. Your API will be live at `https://your-api.onrender.com`

> **Database:** Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for a free hosted PostgreSQL — copy the connection string into `DATABASE_URL`.

> **Cold starts:** Free tier Render services spin down after inactivity. Upgrade to a paid plan or use Render's "health check" keep-alive to avoid this.

---

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `cp_frontend`
3. Framework preset will auto-detect as **Vite**
4. Add environment variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-api.onrender.com` |

5. Deploy. Vercel handles SPA routing automatically via `vercel.json`.

---

### Post-deploy checklist

- [ ] Update Google OAuth **Authorised redirect URIs** to include `https://your-api.onrender.com/api/auth/google/callback`
- [ ] Update Razorpay webhook URL to `https://your-api.onrender.com/api/billing/webhook`
- [ ] Set `FRONTEND_URL` on Render to your Vercel URL (for CORS)
- [ ] Set `VITE_API_URL` on Vercel to your Render URL

---

## Architecture

```
contentpilot/
├── cp_backend/
│   └── src/
│       ├── server.js          # Fastify entry point
│       ├── routes/            # Route registration
│       ├── controllers/       # Request handlers
│       ├── services/
│       │   ├── voiceProfiles.js  # System prompts per voice
│       │   ├── scraper.js        # Content extraction
│       │   ├── openai.js         # GPT-4o generation (Promise.all)
│       │   └── quota.js          # Monthly quota enforcement
│       ├── middleware/
│       │   ├── auth.js           # JWT cookie verification
│       │   └── errorHandler.js   # Clean error responses
│       └── prisma/
│           └── schema.prisma
└── cp_frontend/
    └── src/
        ├── App.jsx            # Router + protected routes
        ├── pages/             # Full page components
        ├── components/        # Reusable UI components
        ├── hooks/             # useAuth, useJobs
        └── lib/               # API client, voice profile data
```

## Voice Profiles

| Profile | Audience | Style |
|---|---|---|
| Developer | Dev advocates, engineers | Technical, peer-to-peer, precise |
| Creator | Content creators, influencers | Hook-driven, conversational, emotional |
| Founder | Startup founders, operators | Insight-led, data-driven, first-person |
| Marketing | Marketers, growth teams | Benefit-focused, persuasive, CTA-driven |
