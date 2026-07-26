import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { getEncryptionKey } from "./env";

export type EncryptedPayload = {
  encryptedPayload: string;
  iv: string;
  authTag: string;
};

export function encryptText(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    encryptedPayload: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

export function decryptText(payload: EncryptedPayload): string {
  const key = getEncryptionKey();
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(payload.iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.encryptedPayload, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
