import crypto from "crypto";

// Constants — these sizes are AES-256-GCM requirements
const SALT_SIZE = 32;      // bytes
const IV_SIZE = 16;        // bytes
const KEY_LENGTH = 32;     // bytes — 32 bytes = 256 bits (AES-256)
const ITERATIONS = 100000; // PBKDF2 iterations — makes brute force expensive
const DIGEST = "sha512";

// Derives the key from user enterd pwd 
const deriveKey = (masterPassword: string, salt: Buffer): Buffer => {
  return crypto.pbkdf2Sync(
    masterPassword,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST
  );
};

// Takes plain js object and converts it into a single JSON string safe to write to disk
/* Basic logic
masterPassword + salt → PBKDF2 → key
key + IV → createCipheriv → cipher
cipher.update() + cipher.final() → encrypted bytes → hex string
cipher.getAuthTag() → integrity proof
all bundled → JSON string → written to disk
*/
export const encryptVault = (data: object, masterPassword: string): string => {
  // 1. Random salt — unique per vault, generated ONCE at creation
  const salt = crypto.randomBytes(SALT_SIZE);

  // 2. Derive the encryption key from password + salt
  const key = deriveKey(masterPassword, salt);

  // 3. Random IV — should be unique per save operation
  const iv = crypto.randomBytes(IV_SIZE);

  // 4. Create cipher and encrypt
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  // 5. Auth tag — proves data integrity + wrong password detection
  const authTag = cipher.getAuthTag();

  // 6. Bundle everything into one JSON string (hex = safe to store as text)
  const bundle = {
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    ciphertext: encrypted.toString("hex"),
  };

  return JSON.stringify(bundle);
};

//Takes the JSON string + the password and return the obejct
export const decryptVault = (encryptedString: string, masterPassword: string): object => {
  // 1. Parse the bundle
  const { salt, iv, authTag, ciphertext } = JSON.parse(encryptedString);

  // 2. Convert hex strings back to Buffers
  const saltBuf    = Buffer.from(salt, "hex");
  const ivBuf      = Buffer.from(iv, "hex");
  const authTagBuf = Buffer.from(authTag, "hex");
  const cipherBuf  = Buffer.from(ciphertext, "hex");

  // 3. Re-derive the same key using the same salt
  const key = deriveKey(masterPassword, saltBuf);

  // 4. Create decipher
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuf);
  decipher.setAuthTag(authTagBuf);

  // 5. Decrypt — if password is wrong, this line will THROW an error
  const decrypted = Buffer.concat([
    decipher.update(cipherBuf),
    decipher.final(), // ← throws if authTag doesn't match
  ]);

  return JSON.parse(decrypted.toString("utf8"));
};
