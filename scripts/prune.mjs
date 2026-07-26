#!/usr/bin/env node
/**
 * Optional daily cleanup for unread secrets older than 7 days.
 * Usage: node --import tsx scripts/prune.ts
 * Or call POST /api/prune with Authorization: Bearer $CRON_SECRET
 */

import { Pool } from "pg";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const result = await pool.query(
      `DELETE FROM secrets WHERE created_at < NOW() - INTERVAL '7 days'`,
    );
    console.log(`Pruned ${result.rowCount ?? 0} expired secret(s).`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
