# ZeroTrace

Zero-knowledge, burn-on-read secret sharing. Paste sensitive text, get a single-use link, and the encrypted record is destroyed the moment it is opened.

## Stack

- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS + Lucide icons
- AES-256-GCM via Node `crypto`
- PostgreSQL
- Standalone Node output for self-hosting

## Quick start

```bash
# 1. Start Postgres (runs schema.sql on first boot)
docker compose up -d

# 2. Configure env
cp .env.example .env.local
# set ENCRYPTION_KEY to: openssl rand -hex 32

# 3. Install and run
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `ENCRYPTION_KEY` | 64 hex chars (32-byte AES key) |
| `NEXT_PUBLIC_APP_URL` | Base URL used in generated links |
| `CRON_SECRET` | Optional bearer token for `/api/prune` |

## API

- `POST /api/secrets` — `{ "secret": "..." }` → `{ id, url }`
- `GET /api/secrets/:id` — decrypts and permanently deletes the row
- `POST /api/prune` — deletes unread secrets older than 7 days

## Production

```bash
npm run build
npm run start
```

Build produces a standalone Node server (`output: "standalone"`). Put TLS in front with Caddy or Nginx, or run the included Dockerfile.
