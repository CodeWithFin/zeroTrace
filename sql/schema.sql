CREATE TABLE IF NOT EXISTS secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encrypted_payload TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_secrets_created_at ON secrets(created_at);

-- Run daily to prune unread secrets older than 7 days:
-- DELETE FROM secrets WHERE created_at < NOW() - INTERVAL '7 days';
