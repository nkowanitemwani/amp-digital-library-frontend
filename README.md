# Amplify Digital Library — Frontend

> Web interface for the Amplify Digital Library — a cloud-based accessible learning platform for visually impaired primary school students in Zambia.

Built with **Next.js 16 · TypeScript · Tailwind CSS**

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Pages and Routes](#pages-and-routes)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Overview

This is the frontend for the Amplify Digital Library, a capstone project built at Mulungushi University, Zambia. The web application serves two types of users:

- **School administrators (teachers)** — upload PDF textbooks, manage grades and subject categories, preview audio, and monitor student quiz progress.
- **Students (grade accounts)** — browse their grade's library, listen to AI-generated audio lessons, listen to AI teaching dialogues, and take accessible keyboard-driven quizzes.

The system is designed specifically for **school computer lab environments**. Students are visually impaired primary school learners (ages 6–13) who access the library through shared grade accounts on standard school computers with headphones. No specialist hardware is required.

---

## Architecture

```
Student / Teacher Browser
         │
         │ HTTPS
         ▼
  Next.js Frontend (Vercel)
         │
         │ REST API calls (JWT Bearer token)
         ▼
  Go/Gin Backend API (Render)
         │
         ├──► PostgreSQL (Render Managed DB)
         ├──► AWS S3 (audio file presigned URLs streamed directly to browser)
         ├──► ElevenLabs (TTS — handled server-side)
         └──► Groq (LLM — handled server-side)
```

Audio files are **never proxied through this frontend**. The backend generates time-limited presigned S3 URLs which the browser uses to stream MP3 audio directly from AWS S3.

---

## Project Structure

```
.
├── app/
│   ├── page.tsx                  # Landing page
│   ├── login/
│   │   └── page.tsx              # Admin login
│   ├── register/
│   │   └── page.tsx              # School registration
│   ├── student/
│   │   └── login/
│   │       └── page.tsx          # Student / grade login
│   ├── dashboard/
│   │   └── page.tsx              # Role-based dashboard (admin or student view)
│   ├── player/
│   │   └── page.tsx              # Audio player (standard and dialogue modes)
│   └── quiz/
│       └── page.tsx              # Keyboard-driven accessible quiz
├── public/                       # Static assets
├── .env.local                    # Local environment variables (not committed)
├── .env.example                  # Example environment file
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Prerequisites

- Node.js 20+
- npm or yarn
- The backend API running locally or deployed on Render

---

## Local Development

**1. Clone the repository**

```bash
git clone https://github.com/nkowanitemwani/amp-digital-library-frontend
cd amp-digital-library-frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_URL to your backend URL
```

For local development with the backend also running locally:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

For local development pointing at the deployed Render backend:

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

**4. Run the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | **Yes** |

> The `NEXT_PUBLIC_` prefix means this value is embedded into the browser bundle at build time. Do not store secrets here.

**`.env.example`**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Pages and Routes

| Route | Description | Auth required |
|---|---|---|
| `/` | Landing page — describes the system, links to login | None |
| `/login` | Admin / teacher login (email + password) | None |
| `/register` | School registration | None |
| `/student/login` | Grade account login (school ID + username + password) | None |
| `/dashboard` | Role-based dashboard — shows admin or student view based on JWT role | JWT |
| `/player` | Audio player — supports `mode=standard` and `mode=dialogue` | JWT |
| `/quiz` | Accessible quiz — keyboard-driven, audio-first | JWT |

### Dashboard behaviour

The dashboard reads the `role` claim from the stored JWT and renders the appropriate view:

- `role: "admin"` → Admin dashboard with grade management, book uploads, category management, and quiz progress.
- `role: "grade"` → Student dashboard with subject browsing, three listening modes per book, and quiz access.

### Audio player modes

The player accepts a `mode` query parameter:

- `mode=standard` — plays the standard audio lesson (single voice). The `audioUrl` parameter carries the presigned S3 URL directly.
- `mode=dialogue` — plays the AI teaching dialogue (two voices). The `bookId` parameter is used to fetch the presigned URL from the backend at runtime.

### Quiz interaction model

The quiz page is designed to be fully operable without sight:

- Question audio plays automatically when each question loads.
- Press **1 2 3 4** to select an answer option.
- Press **Enter** to confirm the selected answer.
- Press **R** to replay the question audio.
- No mouse interaction is required at any point.

---

## Deployment

The frontend is deployed on **Vercel** using Next.js automatic deployment.

| Field | Value |
|---|---|
| **Framework** | Next.js (auto-detected) |
| **Build Command** | `next build` (Vercel default) |
| **Output Directory** | `.next` (Vercel default) |
| **Node version** | 20.x |

### Setting the API URL on Vercel

1. Go to your project in the Vercel dashboard.
2. Navigate to **Settings → Environment Variables**.
3. Add `NEXT_PUBLIC_API_URL` with the value of your Render backend URL:
   ```
   https://your-backend-name.onrender.com
   ```
4. Redeploy for the variable to take effect.

### Automatic deployments

Every push to the `main` branch triggers a new Vercel deployment automatically. Preview deployments are created for pull requests.

---

## Known Limitations

- **JWT stored in localStorage.** The token is stored in `localStorage` for simplicity. For a higher-security production deployment, an `httpOnly` cookie would be more appropriate as it is not accessible to JavaScript.

- **No offline support.** The application requires an active internet connection. Audio files are streamed from AWS S3 via presigned URLs and are not cached locally.

- **Presigned URLs expire after 1 hour.** If a student leaves a book open for longer than one hour without refreshing, the audio URL will expire. Refreshing the page generates a new URL.

- **CORS.** The backend currently allows all origins. Once the Vercel deployment URL is stable, the backend `FRONTEND_URL` environment variable should be updated to restrict CORS to this domain only.

- **Render cold starts.** The free Render tier spins the backend down after 15 minutes of inactivity. The first request after a period of inactivity may take 30–60 seconds to respond while the server restarts. This affects the login page in demo conditions — warn the panel before demonstrating.

---

## Related Repositories

| Repository | Description |
|---|---|
| [amp-digital-library-backend](https://github.com/nkowanitemwani/amp-digital-library-backend) | Go/Gin REST API, background processor, database schema |

---

## Licence

This project was developed as a final-year capstone project at Mulungushi University, Zambia.