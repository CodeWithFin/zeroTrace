# ZeroTrace

**Share sensitive text once. Then it’s gone.**

ZeroTrace is a zero-knowledge, burn-on-read utility for API keys, `.env` files, passwords, and temporary tokens. Paste a secret, get a single-use link, and the encrypted record is permanently destroyed the moment someone opens it — so credentials stop living forever in Slack, Teams, or email.

---

## Why it exists

Teams share secrets over chat every day. Those messages get indexed, searched, and retained indefinitely. That is secrets sprawl.

ZeroTrace replaces durable paste dumps with disposable links:

1. You create a link — no account required  
2. Ciphertext is stored — plaintext never touches the database  
3. The recipient opens it once — decrypt and delete happen together  
4. A second open finds nothing

---

## Features

- **No signup** — create and open links without authentication  
- **AES-256-GCM** — encrypted in memory before any write  
- **Atomic burn-on-read** — `DELETE … RETURNING` so concurrent requests cannot double-read  
- **7-day TTL** — unread secrets are pruned automatically  
- **Self-hostable** — you own the encryption key and the database  
- **Standalone deploy** — Next.js `output: "standalone"` for VPS, Docker, or PM2  

---

## How it works

```
┌─────────────┐     encrypt      ┌──────────────┐     share      ┌─────────────┐
│  Plaintext  │ ───────────────► │  PostgreSQL  │ ─────────────► │  One-time   │
│  (in RAM)   │   AES-256-GCM    │  ciphertext  │     /s/:id     │    link     │
└─────────────┘                  └──────────────┘                └─────────────┘
                                        │
                                        │ first GET
                                        ▼
                                 decrypt + DELETE
                                 (same request)
```

| Step | What happens |
| --- | --- |
| Create | Secret is encrypted with AES-256-GCM; only ciphertext, IV, and auth tag are stored |
| Share | Recipient gets a UUID link like `/s/a1b2c3…` |
| Reveal | First successful fetch decrypts the payload and deletes the row atomically |
| Gone | Further requests return `410` — nothing left to show |

---

## Tech stack

| Layer | Choice |
| --- | --- |
| App | Next.js (App Router) · React 19 · TypeScript |
| UI | Tailwind CSS · Lucide icons |
| Crypto | Node.js `crypto` · `aes-256-gcm` |
| Data | PostgreSQL |
| Runtime | Standalone Node server |

---

## Quick start

**Requirements:** Node.js 20+, Docker (for Postgres)

```bash
# Start Postgres (applies sql/schema.sql on first boot)
docker compose up -d

# Configure environment
cp .env.example .env.local
```

Set `ENCRYPTION_KEY` to a fresh 32-byte key:

```bash
openssl rand -hex 32
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Default compose maps Postgres to host port **5436**. Change `DATABASE_URL` if you use a different host or port.

---

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ENCRYPTION_KEY` | Yes | 64 hex characters (32-byte AES-256 key) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public base URL used in generated share links |
| `CRON_SECRET` | No | Bearer token required by `POST /api/prune` when set |

Example `.env.local`:

```env
DATABASE_URL=postgresql://zerotrace:zerotrace@localhost:5436/zerotrace
ENCRYPTION_KEY=your_64_character_hex_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build + standalone assets |
| `npm run start` | Run standalone server |
| `npm run db:up` | Start Postgres via Docker Compose |
| `npm run db:down` | Stop Postgres |
| `npm run prune` | Delete unread secrets older than 7 days |

---

## API

### Create a secret

```http
POST /api/secrets
Content-Type: application/json

{ "secret": "sk_live_••••••••" }
```

```json
{
  "id": "ec9e645e-64e8-449a-9d38-9e11c297c62c",
  "url": "http://localhost:3000/s/ec9e645e-64e8-449a-9d38-9e11c297c62c"
}
```

### Reveal and burn

```http
GET /api/secrets/:id
```

**Success (first read)**

```json
{
  "secret": "sk_live_••••••••",
  "burned": true
}
```

**Already burned / missing** — `410 Gone`

```json
{
  "error": "This secret has already been viewed or no longer exists.",
  "burned": true
}
```

### Prune expired secrets

```http
POST /api/prune
Authorization: Bearer <CRON_SECRET>
```

```json
{ "deleted": 3 }
```

Schedule this daily (or run `npm run prune`) to clear unread secrets older than 7 days.

---

## Security model

| Guarantee | Detail |
| --- | --- |
| Zero-knowledge storage | Plaintext is never written to disk or Postgres |
| Integrity | GCM auth tags reject tampered ciphertext |
| Single read | Atomic `DELETE … RETURNING` under concurrency |
| Key custody | `ENCRYPTION_KEY` stays on your server — rotate by redeploying with a new key |
| Transport | Terminate TLS at Nginx/Caddy (Let’s Encrypt) in production |

**Not a password manager.** ZeroTrace is for ephemeral handoff, not long-term vaulting. Anyone with the link can burn the secret — treat links like the secret itself.

---

## Database

Schema lives in [`sql/schema.sql`](sql/schema.sql):

```sql
CREATE TABLE IF NOT EXISTS secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_payload TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_secrets_created_at ON secrets(created_at);
```

---

## Production deploy

### Node (standalone)

```bash
npm run build
npm run start
```

Serve behind Nginx or Caddy with HTTPS. Point `NEXT_PUBLIC_APP_URL` at your public domain.

### Docker

```bash
docker compose up -d          # database
docker build -t zerotrace .
docker run --env-file .env.local -p 3000:3000 zerotrace
```

### Suggested layout

- **App:** PM2 or Docker  
- **Proxy:** Caddy / Nginx + Let’s Encrypt  
- **Cleanup:** daily cron → `POST /api/prune` or `npm run prune`

---

## Project layout

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Create secret UI
│   │   ├── s/[id]/page.tsx       # Reveal / burn UI
│   │   └── api/
│   │       ├── secrets/          # Create + burn endpoints
│   │       └── prune/            # TTL cleanup
│   ├── components/
│   └── lib/
│       ├── crypto.ts             # AES-256-GCM
│       ├── db.ts                 # Postgres + atomic burn
│       └── env.ts
├── sql/schema.sql
├── scripts/prune.mjs
├── docker-compose.yml
├── Dockerfile
└── prd.md
```

---

## License

Private project — all rights reserved unless otherwise stated.
