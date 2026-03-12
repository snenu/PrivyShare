# PrivyShare

Private file sharing where ownership, payments, and access remain confidential. Built on Aleo with client-side encryption and IPFS storage.

## Stack

- **Frontend:** Next.js 14, Tailwind CSS, TypeScript
- **Wallet:** Provable Aleo Wallet Adapter (Leo, Puzzle, Fox, Shield)
- **Chain:** Aleo Testnet; Leo program `privyshare_files_7879.aleo`
- **Storage:** IPFS (Pinata or compatible API)
- **Crypto:** AES-GCM (client-side), PBKDF2 key derivation

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_ALEO_RPC_URL` – e.g. `https://api.explorer.provable.com/v2`
- `NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID` – e.g. `privyshare_files_7879.aleo` (must match your deployed program)
- `PINATA_JWT` – server-side Pinata JWT for uploads (never use `NEXT_PUBLIC_*` for secrets)
- `NEXT_PUBLIC_PINATA_GATEWAY` – e.g. `https://gateway.pinata.cloud/ipfs/` for reads
- `MONGODB_URI` – MongoDB connection string for users and file metadata (optional; falls back to localStorage)

### 3. Deploy the Leo program (optional if already deployed)

**Option A: WSL script**

1. Install WSL with Ubuntu: `wsl --install`
2. Open WSL, navigate to project: `cd /mnt/c/Users/YOUR_USER/ShadowVault`
3. Install Leo CLI: https://developer.aleo.org/leo/installation
4. Set your private key: `export PRIVATE_KEY="your_aleo_private_key"`
5. Run: `bash scripts/deploy-wsl.sh`

**Option B: Manual**

Install [Leo CLI](https://developer.aleo.org/leo/installation), then:

```bash
cd contracts/privyshare_files_7879
leo build
```

Deploy to Testnet (set `PRIVATE_KEY` and optionally `ENDPOINT`):

```bash
export PRIVATE_KEY="your_aleo_private_key"
export ENDPOINT="https://api.explorer.provable.com/v2"
cd contracts && bash deploy.sh
```

Set `NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID` in `.env.local` to the deployed program ID.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## User flows

1. **Upload:** Connect wallet → Upload → Choose file, set encryption password and price → Encrypt + upload to IPFS → Register on Aleo (`register_file`). Metadata (CID, iv, salt) is stored locally for the owner.
2. **Marketplace:** Lists files from on-chain mapping (no dummy data).
3. **File detail:** View file, price, owner. Owner can grant/revoke access and download (with password). Buyer pays off-chain, gets CID + password from seller, then can download.
4. **My Files / Purchased:** My Files filters by current wallet owner; Purchased uses wallet `requestRecords` for access records.

## QA checklist

- [ ] Wallet: Connect with at least one adapter (e.g. Puzzle), disconnect, reconnect.
- [ ] Network: App targets Aleo Testnet; ensure wallet is on Testnet.
- [ ] Upload: Configure IPFS (e.g. Pinata), upload a file, confirm encrypt + IPFS + `register_file` and that the file appears in Marketplace and My Files.
- [ ] Marketplace: Load list from chain; open a file detail.
- [ ] Grant access: As owner, grant access to another address; confirm transaction.
- [ ] Revoke access: As owner, revoke access for an address.
- [ ] Download (owner): On file detail, enter encryption password and download; verify decrypted file.
- [ ] Download (buyer): With CID + password from seller, use the download section on file detail to fetch from IPFS and decrypt.
- [ ] Program ID: `.env.local` and deployed program ID match; no generic placeholders.

## Project layout

- `app/` – Next.js routes (landing, dashboard, marketplace, upload, files/[id], my-files, purchased, settings)
- `components/` – Header, Providers, wallet buttons
- `lib/` – aleo (config, encode, programState), wallet (usePrivyWallet), crypto (encrypt), ipfs (client), upload (encryptAndUpload)
- `contracts/privyshare_files_7879/` – Leo program (register_file, set_price, grant_access, revoke_access)

## Mistakes to avoid (from MISTAKES.md)

- Use correct `program.json` (JSON object, not TOML).
- Leo: `src/main.leo`, `leo build` in program directory, `@noupgrade async constructor()`, `Mapping::get_or_use` for counters, unique program names.
- Frontend: Program ID and RPC match deployed contract; use `window.aleo.puzzleWalletClient` for Puzzle detection if using SDK directly; include program IDs in wallet permissions.
