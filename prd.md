# Product Requirements Document (PRD): ZeroTrace

## 1. Executive Summary
**The Problem:** Developers, system administrators, and client teams regularly share sensitive credentials (API keys, `.env` files, database passwords, temporary access tokens) across persistent messaging platforms (Slack, Teams, Email). These credentials remain indexed in chat logs indefinitely, creating severe security vulnerabilities ("secrets sprawl").

**The Solution:** **ZeroTrace** is a zero-knowledge, web-based utility that generates secure, single-use, self-destructing links for sensitive text. The application operates on a strict **"burn-on-read"** architecture: the moment an encrypted payload is retrieved, its database record is permanently purged in the same transaction cycle.

---

## 2. Product Objectives & Core Constraints

* **Frictionless Experience:** Zero user onboarding or authentication required to generate or consume secret links.
* **Atomic Destruction:** Guarantee single-read access under all concurrency conditions. Race conditions (e.g., simultaneous HTTP requests) must never allow duplicate reads.
* **Zero-Knowledge Data Layer:** Plaintext secrets must never touch the database or persistent storage. Payloads are encrypted in memory before write and decrypted only upon authorized fetch.
* **Self-Hosted Capability:** Designed for standalone deployment on private VPS/cloud infrastructure to ensure total administrative sovereignty over encryption keys.

---

## 3. Technology Stack

### Application & Frontend
* **Framework:** Next.js (App Router, React 19) with TypeScript
* **Styling:** Tailwind CSS + Lucide React Icons
* **Execution Model:** Standalone Node.js server (`output: 'standalone'`)

### Cryptography & Database
* **Encryption Module:** Native Node.js `crypto` (`aes-256-gcm`)
* **Persistence Layer:** PostgreSQL (via Supabase or self-hosted PostgreSQL)

### Production Infrastructure
* **Host Operating System:** Linux (Arch Linux, Ubuntu 24.04 LTS, or Debian)
* **Process Manager:** PM2 or Docker Container
* **Reverse Proxy:** Nginx or Caddy
* **Transport Security:** Let's Encrypt SSL/TLS (`Certbot`)

---

## 4. Database Schema & Data Lifecycle

The application requires a single, optimized table within PostgreSQL.

### Table Name: `secrets`

| Column | Data Type | Constraints / Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, `default: gen_random_uuid()` | Unique payload identifier exposed in the URL slug. |
| `encrypted_payload` | `TEXT` | `NOT NULL` | Base64/Hex encoded cipher text encrypted with AES-256-GCM. |
| `iv` | `TEXT` | `NOT NULL` | Hex-encoded 12-byte Initialization Vector. |
| `auth_tag` | `TEXT` | `NOT NULL` | Hex-encoded 16-byte Authentication Tag for GCM integrity checks. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Creation timestamp used for automated background pruning. |

### Data Pruning Policy
An automated PostgreSQL Cron job or server-side scheduled script runs every 24 hours to delete unread secrets where `created_at < NOW() - INTERVAL '7 days'`.

```sql
CREATE TABLE IF NOT EXISTS secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_payload TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup and automated TTL cleanup
CREATE INDEX IF NOT EXISTS idx_secrets_created_at ON secrets(created_at);