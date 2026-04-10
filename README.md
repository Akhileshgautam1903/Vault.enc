# VAULT.enc — Project Documentation

## Project Overview

VAULT.enc is a secure, local-first password manager built for personal use. Inspired by a real need — replacing a physical diary of passwords with a clean, searchable, encrypted digital system. All data stays on your machine. Nothing is sent to any server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + API | Next.js (App Router) |
| Encryption | Node.js `crypto` module |
| Storage | Local file system (`vault.enc`) |
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
    ├── exists/route.ts    # GET  — checks if vault.enc exists
    ├── unlock/route.ts    # POST — decrypts vault, returns entries
    ├── save/route.ts      # POST — encrypts entries, writes to disk
    └── export/route.ts    # GET  — reads vault.enc for download

lib/
├── crypto.ts              # All encryption/decryption logic
└── vaultContext.tsx       # Global state (entries + masterPassword)

models/
└── entry.ts               # TypeScript types (Entry, Vault)

data/
└── vault.enc              # The encrypted file (source of truth)
```

---

## User Workflows

### Start Fresh
```
/ → "Start Fresh" → /setup
Enter + confirm master password
→ POST /api/save with empty entries
→ vault.enc created on disk
→ /vault (empty, ready to add entries)
```

### Upload Existing Vault
```
/ → "Upload .enc" → /unlock
Select vault.enc file + enter master password
→ POST /api/unlock with file contents + password
→ entries decrypted, loaded into context
→ /vault (entries populated)
```

### CRUD
```
Add    → modal form → saveToVault([...entries, newEntry])
Edit   → prepopulated modal → saveToVault(entries.map(...))
Delete → saveToVault(entries.filter(...))
Search → filteredEntries = entries.filter(e => e.site.includes(query))
```
Every change saves to disk immediately (optimistic update with rollback on failure).

### Export & Lock
```
Lock button → export modal
Enter filename → "Export & Lock"
→ GET /api/export → download {filename}.enc
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

## Security Properties

| Property | How it's achieved |
|---|---|
| Master password never stored | Only used transiently to derive the key |
| Wrong password detected cleanly | AES-GCM authTag verification |
| Tampered file detected | authTag mismatch on decrypt |
| Same password → different ciphertext | Random salt + random IV per save |
| Brute force expensive | PBKDF2 with 100,000 iterations |
| Data never leaves machine | All API routes run on localhost |

---

## Phase 2 — Planned Features

- UI polish with shadcn/ui
- Toast notifications
- Tags / categories (finance, social, government)
- Versioning (last_updated timestamp)
- AI integration — local LLM for diary-to-JSON conversion and semantic search