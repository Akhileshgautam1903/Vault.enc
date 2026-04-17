import { Entry } from "@/model/entry";

export const encryptVault = async (
  entries: Entry[],
  masterPassword: string,
): Promise<string> => {
  // 1. Generate random salt (32 bytes)
  const salt = crypto.getRandomValues(new Uint8Array(32));

  // 2. Derive key from (masterPassword + salt) using PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(masterPassword),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-512" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );

  // 3. Generate random IV (16 bytes)
  const iv = crypto.getRandomValues(new Uint8Array(16));

  // 4. Encrypt JSON using AES-256-GCM
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify({ entries })),
  );

  // Hex conversion function
  const toHex = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  // split apart
  const ciphertext = encrypted.slice(0, encrypted.byteLength - 16);
  const authTag = encrypted.slice(encrypted.byteLength - 16);

  // 5. Bundle { salt, iv, authTag, ciphertext } as hex strings
  const bundle = {
    salt: toHex(salt.buffer),
    iv: toHex(iv.buffer),
    authTag: toHex(authTag),
    ciphertext: toHex(ciphertext),
  };

  // 6. Return as JSON string
  return JSON.stringify(bundle);
};
