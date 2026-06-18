-- ============================================================
-- Migration: Hash API keys instead of storing them in plaintext
-- ============================================================
-- Stores only a SHA-256 hash of the token plus a non-secret prefix
-- for display. Existing plaintext keys are migrated to hashes and the
-- plaintext column is cleared.

ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS key_hash TEXT;
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS key_prefix TEXT;
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;

-- Backfill hashes for any existing plaintext keys using pgcrypto.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE api_keys
SET
  key_hash = encode(digest(key, 'sha256'), 'hex'),
  key_prefix = left(key, 12)
WHERE key IS NOT NULL AND key_hash IS NULL;

-- Clear the plaintext column so secrets are no longer readable.
UPDATE api_keys SET key = NULL WHERE key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
