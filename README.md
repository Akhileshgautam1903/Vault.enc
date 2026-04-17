# VAULT.enc — Project Documentation

## Project Overview

VAULT.enc is a secure, local-first password manager built for personal use. Inspired by a real need — replacing a physical diary of passwords with a clean, searchable, encrypted digital system. All data stays on your machine. Nothing is sent to any server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + API | Next.js (App Router) |
| Server-side Encryption | Node.js `crypto` module (`lib/crypto.ts`) |
| Client-side Encryption | Web Crypto API (`lib/clientCrypto.ts`) |
| Storage | Browser memory (React Context) — no database |
| State Management | React Context |
| Language | TypeScript |

---

## Folder Structure

```
app/
├── page.tsx               # Landing page
├── setup/page.tsx         # Create new vault (set master password)
├── unlock/page.tsx        # Unlock existing vault (upload + password)
├── vault/page.tsx         # Main vault UI (CRUD)
└── api/
    └── unlock/route.ts    # POST — decrypts uploaded file, returns entries

lib/
├── crypto.ts              # Server-side encryption/decryption (Node.js crypto)
├── clientCrypto.ts        # Client-side encryption (Web Crypto API)
└── vaultContext.tsx       # Global state (entries + masterPassword)

models/
└── entry.ts               # TypeScript types (Entry, Vault)
```

---

## User Workflows

### Start Fresh
```
/ → "Start Fresh" → /setup
Enter + confirm master password
→ setMasterPassword() in context (no API call, no disk write)
→ /vault (empty, ready to add entries)
```

### Upload Existing Vault
```
/ → "Upload .enc" → /unlock
Select vault.enc file + enter master password
→ POST /api/unlock with file contents + password
→ entries decrypted server-side, loaded into context
→ /vault (entries populated)
```

### CRUD
```
Add    → modal form → saveToVault([...entries, newEntry])
Edit   → prepopulated modal → saveToVault(entries.map(...))
Delete → saveToVault(entries.filter(...))
Search → filteredEntries = entries.filter(e => e.site.includes(query))
```
Every change updates context only — no disk writes, no API calls during CRUD.

### Export & Lock
```
Lock button → export modal
Enter filename → "Export & Lock"
→ encryptVault() via Web Crypto API (client-side, no server involved)
→ download {filename}.enc directly from browser
→ clear context (entries + masterPassword)
→ router.push("/")
```

---

## Data Model

```ts
type Entry = {
  id: string        // crypto.randomUUID()
  site: string
  username: string
  password: string
  notes?: string    // optional
}

type Vault = {
  entries: Entry[]
}
```

---

## Architecture (v2 — Multi-User Ready)

### The Key Insight

```
vault.enc file = just a snapshot the user carries around
Context (memory) = the actual source of truth while session is active
```

### Why This Makes It Multi-User

```
User A unlocks → their entries in context (Tab 1)
User B unlocks → their entries in context (Tab 2)
No shared file on disk → no conflict ✅
```

Each user brings their own `.enc` file and takes it away on export. The server never stores anything permanently.

### Data Flow

```
UNLOCK (server-side decryption)
Uploaded .enc file + master password
        ↓
POST /api/unlock → Node.js crypto → decrypted entries
        ↓
setEntries() + setMasterPassword() → stored in React Context

CRUD (client-side, memory only)
Add / Edit / Delete → updates Context only
No API calls. No disk writes. Instant.

EXPORT (client-side encryption)
entries + masterPassword → Web Crypto API → encrypted string
        ↓
Blob download → {filename}.enc saved to user's machine
        ↓
Context cleared → session ends
```

### Session Safety

```ts
// Warns user before closing tab, refreshing, or navigating away
window.addEventListener("beforeunload", (e) => e.preventDefault())
```

Browser shows its built-in "Leave site?" dialog — preventing accidental data loss.

---

## Encryption Logic (The Most Important Part)

### Golden Rule
**Nothing sensitive ever touches the disk unencrypted.**
The master password is never stored — not in the file, not in a database, nowhere.

---

### What vault.enc Actually Contains

```json
{
  "salt": "800fb3db...",
  "iv": "9cebd671...",
  "authTag": "f3023963...",
  "ciphertext": "da78fa97..."
}
```

None of these fields are secret except `ciphertext`. Salt, IV, and authTag are stored openly — and that's intentional.

---

### Step 1 — Key Derivation (PBKDF2)

The master password is a human string. AES-256 needs a precise 256-bit key. PBKDF2 bridges that gap.

```
masterPassword + salt → PBKDF2 (100,000 iterations, SHA-512) → 32-byte key
```

**Why salt?** Without it, the same password always produces the same key. An attacker with a precomputed table (rainbow table) could reverse it instantly. A random salt makes every vault unique even if two people use the same password.

**Why 100,000 iterations?** Each iteration makes brute-forcing slower. 100k iterations means an attacker must run PBKDF2 100k times per password guess — making attacks computationally expensive.

```ts
const key = crypto.pbkdf2Sync(masterPassword, salt, 100000, 32, 'sha512')
```

---

### Step 2 — Encryption (AES-256-GCM)

```
key + IV + plaintext → AES-256-GCM → ciphertext + authTag
```

**Why GCM mode?** GCM (Galois/Counter Mode) does two things simultaneously:
1. Encrypts the data → `ciphertext`
2. Computes an integrity fingerprint → `authTag`

The authTag acts like a wax seal on the encrypted data.

**Why a random IV?** The IV (Initialization Vector) ensures that encrypting the same data twice produces different ciphertext each time. This prevents pattern analysis.

```ts
const iv = crypto.randomBytes(16)
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
const authTag = cipher.getAuthTag()
```

---

### Step 3 — Decryption + Integrity Check

```
ciphertext + key + IV + authTag → AES-256-GCM → plaintext (or ERROR)
```

When decrypting, GCM recomputes the authTag internally and compares it to the stored one.

```ts
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
decipher.setAuthTag(authTag)
decipher.final() // ← THROWS if authTag doesn't match
```

**Two failure scenarios both caught here:**
- Wrong master password → different key → different authTag → throws
- Tampered vault.enc file → authTag mismatch → throws

This gives a clean, predictable error instead of silently returning garbage data.

---

### Full Encrypt → Decrypt Round Trip

```
plaintext JSON
    ↓ JSON.stringify()
    ↓ PBKDF2(password + salt) → key
    ↓ AES-256-GCM(key + IV) → ciphertext + authTag
    ↓ bundle { salt, iv, authTag, ciphertext } as hex strings
    ↓ write to vault.enc
    
    [later]
    
    read vault.enc
    ↓ parse { salt, iv, authTag, ciphertext }
    ↓ PBKDF2(password + salt) → same key (if correct password)
    ↓ AES-256-GCM decrypt → verify authTag → plaintext
    ↓ JSON.parse()
original object ✅
```

---

## Client-Side Encryption (Web Crypto API)

Export encryption runs entirely in the browser — passwords never leave the client.

### Why Web Crypto API?

| | Node.js crypto | Web Crypto API |
|---|---|---|
| Runs in | Server (API routes) | Browser (client components) |
| Used for | Decryption on unlock | Encryption on export |
| Style | Synchronous | Async (Promise-based) |

Both use the same algorithm — AES-256-GCM — so files encrypted in the browser can be decrypted on the server and vice versa.

### Key Derivation (PBKDF2 — Web Crypto)

```ts
// Step 1 — import password as raw key material
const keyMaterial = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(masterPassword),
  "PBKDF2",
  false,
  ["deriveKey"]
)

// Step 2 — derive AES-256 key using PBKDF2
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-512" },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
)
```

### Encryption (AES-256-GCM — Web Crypto)

```ts
const encrypted = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  new TextEncoder().encode(JSON.stringify({ entries }))
)

// Web Crypto returns ciphertext + authTag combined
// Last 16 bytes are always the authTag
const ciphertext = encrypted.slice(0, encrypted.byteLength - 16)
const authTag = encrypted.slice(encrypted.byteLength - 16)
```

### Hex Conversion

Web Crypto returns `ArrayBuffer` — must convert to hex for JSON storage:

```ts
const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
```

### Output Bundle (same format as server-side)

```json
{
  "salt": "a3f9...",
  "iv": "9b2c...",
  "authTag": "f302...",
  "ciphertext": "da78..."
}
```

The format is identical to server-side encryption — so `/api/unlock` can decrypt files regardless of which side encrypted them.

---

## Security Properties

| Property | How it's achieved |
|---|---|
| Master password never stored | Only used transiently to derive the key |
| Wrong password detected cleanly | AES-GCM authTag verification |
| Tampered file detected | authTag mismatch on decrypt |
| Same password → different ciphertext | Random salt + random IV per export |
| Brute force expensive | PBKDF2 with 100,000 iterations |
| Passwords never sent over network | Export encryption runs in browser via Web Crypto API |
| Multi-user safe | No shared server storage — each user owns their .enc file |
| Accidental tab close protection | `beforeunload` event triggers browser warning dialog |

---

## Phase 2 — Planned Features

- UI polish with shadcn/ui
- Toast notifications
- Tags / categories (finance, social, government)
- Versioning (last_updated timestamp)
- AI integration — local LLM for diary-to-JSON conversion and semantic search