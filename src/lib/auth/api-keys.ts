import { createHash, randomBytes } from "crypto";

const API_KEY_PREFIX = "iist_";

/** Generates a new API token. The plaintext is returned only once to the caller. */
export function generateApiToken(): string {
  return API_KEY_PREFIX + randomBytes(24).toString("hex");
}

/** Hashes an API token for storage/comparison. Never store the plaintext. */
export function hashApiToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Non-secret prefix shown in the UI so users can recognize a key. */
export function apiTokenPrefix(token: string): string {
  return token.slice(0, 12);
}

export { API_KEY_PREFIX };
