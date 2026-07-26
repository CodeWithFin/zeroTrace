import { Pool, type QueryResultRow } from "pg";
import { getDatabaseUrl } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __zeroTracePool: Pool | undefined;
}

function getPool(): Pool {
  if (!global.__zeroTracePool) {
    global.__zeroTracePool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 10,
    });
  }
  return global.__zeroTracePool;
}

export type SecretRow = {
  id: string;
  encrypted_payload: string;
  iv: string;
  auth_tag: string;
  created_at: Date;
};

export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return getPool().query<T>(text, params);
}

export async function insertSecret(input: {
  encryptedPayload: string;
  iv: string;
  authTag: string;
}): Promise<string> {
  const result = await query<{ id: string }>(
    `INSERT INTO secrets (encrypted_payload, iv, auth_tag)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [input.encryptedPayload, input.iv, input.authTag],
  );
  return result.rows[0].id;
}

/**
 * Atomically fetch and destroy a secret.
 * DELETE ... RETURNING guarantees only one concurrent reader succeeds.
 */
export async function burnSecret(id: string): Promise<SecretRow | null> {
  const result = await query<SecretRow>(
    `DELETE FROM secrets WHERE id = $1 RETURNING *`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function pruneExpiredSecrets(): Promise<number> {
  const result = await query(
    `DELETE FROM secrets WHERE created_at < NOW() - INTERVAL '7 days'`,
  );
  return result.rowCount ?? 0;
}
