# LinkUp

A real-time chat application with group rooms, direct messages, follows, and user profiles. Built as a full-stack portfolio project.

**Live demo:** https://linkup-mu-nine.vercel.app/
**API:** https://linkup-api-42tq.onrender.com/

Demo accounts (password `demo1234` for both): `aria`, `marcus`

Note: the API runs on Render's free tier and sleeps when idle, so the first request after inactivity can take ~30 seconds to respond.

## Stack

- **Client:** React 19, Vite, React Router, Tailwind CSS, Socket.IO client, Axios
- **Server:** Node.js, Express 5, Socket.IO, Prisma 7, Zod
- **Database & storage:** Supabase (PostgreSQL via Supavisor pooler, `avatars` storage bucket)
- **Hosting:** Vercel (client), Render (API)
- **CI:** GitHub Actions (typecheck, lint, build on every PR)

## Architecture

```
Browser (React SPA)
  │  HTTPS/REST (Axios)          WSS (Socket.IO)
  ▼                              ▼
Vercel                     Render (Express + Socket.IO)
                                 │  Prisma + pg driver
                                 ▼
                           Supabase Postgres (Supavisor pooler)
                           Supabase Storage (avatars bucket)
```

- Auth is JWT-based (7-day expiry, bcrypt-hashed passwords). HTTP routes are guarded by `authMiddleware`; Socket.IO connections authenticate via the handshake token.
- Room messages and DMs are persisted to Postgres and broadcast over Socket.IO. Room sends require membership; DM sends validate the recipient.
- Avatar uploads go directly from the browser to Supabase Storage (`<userId>/avatar.<ext>`, image-only policies — see `supabase/storage.sql`).

## Features

- Register / login with validation (client + Zod on the server), rate-limited auth routes
- Group chat rooms: browse, join, real-time messaging with persisted history
- Direct messages with conversation list and per-conversation history
- Follow / unfollow users, follower lists, follow status
- Profiles: avatar upload, editable bio, join date
- Dark mode, responsive layout
- Security headers (Helmet), CORS allowlist, graceful shutdown

## Local setup

Prerequisites: Node 20+, a Supabase project.

```bash
# 1. Install dependencies
npm install --prefix server
npm install --prefix client

# 2. Configure environment (see .env.example files for every variable)
cp server/.env.example server/.env
cp client/.env.example client/.env
# Fill in: JWT_SECRET, DATABASE_URL (pooler), DIRECT_URL (direct),
# FRONTEND_URL, VITE_BACKEND_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# 3. Set up the database and storage
cd server
npx prisma migrate deploy
npx prisma db seed        # demo rooms, users, and welcome messages (idempotent)
cd ..

# Run supabase/storage.sql once in the Supabase SQL editor for the avatars bucket.

# 4. Start both apps
npm run dev               # API on :3000, client on :5173
```

Open http://localhost:5173/sign-in and log in with `aria / demo1234`.

## Environment variables

Server (`server/.env`):

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Signs auth tokens (`openssl rand -base64 32`) |
| `DATABASE_URL` | Pooled Postgres connection, used by the app at runtime |
| `DIRECT_URL` | Direct Postgres connection, used by migrations and seed |
| `PORT` | API port (Render injects this; defaults to 3000) |
| `FRONTEND_URL` | Allowed client origin(s), comma-separated; drives CORS + Socket.IO |

Client (`client/.env`):

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | API base URL — baked in at build time |
| `VITE_SUPABASE_URL` | Supabase project URL (avatar uploads) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (avatar uploads) |

## Deploy notes

- **API (Render):** native Node service, Root Directory `server`, build `npm ci && npm run build`, start `npm start`, health check `/`. See `render.yaml`. Set `JWT_SECRET` (generate), `DATABASE_URL`, `DIRECT_URL`, `FRONTEND_URL` (the Vercel URL, no trailing slash).
- **Client (Vercel):** import the repo with Root Directory `client/`. `client/vercel.json` pins the Vite build and SPA rewrites. Set `VITE_BACKEND_URL` plus the Supabase vars, then deploy (env changes require a redeploy).
- **Database:** run `prisma migrate deploy && prisma db seed` once against production (Render shell on paid tiers, or locally with the prod `DIRECT_URL`).
- New pushes to `main` deploy automatically on both hosts.

## Project structure

```
client/                 React + Vite SPA
  src/api/              Axios instance with auth interceptor
  src/auth/             Token helpers (decode, expiry) and logout
  src/components/       Chat, DM, profile, and shared UI
  src/hooks/            useCurrentUser, useMessagesSocket, useDarkMode
  src/pages/            Splash, SignIn, Register, Home, People,
                        ChatRooms, Messages, Profile
  src/sockets/          Socket.IO connection manager
server/                 Express + Socket.IO API
  prisma/               Schema, migrations, idempotent seed script
  src/config/           Prisma client, validated env
  src/middleware/       JWT auth, Zod validation
  src/routes/           auth, users, rooms, DMs, follows
  src/sockets/          Room and DM event handlers
  src/validation/       Zod schemas
supabase/               Storage bucket + policies SQL
.github/workflows/      CI: typecheck, lint, build
```
