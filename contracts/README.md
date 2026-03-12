# PrivyShare Leo Programs

## privyshare_files_7879.aleo

- **register_file(ipfs_cid, price, file_id)** – Register a file. Get next `file_id` by querying `file_counter` mapping first, then pass `file_id = counter + 1`.
- **set_price(file_id, new_price, file_record)** – Update listing price (owner only).
- **purchase_file(file_id, seller, price, payment)** – Buyer pays with credits.aleo record; access granted atomically. Requires private credits.
- **grant_access(file_id, buyer)** – Owner grants access to `buyer`; creates `AccessRecord` for buyer. Use when buyer pays off-chain.
- **revoke_access(file_id, buyer)** – Owner revokes access; sets `revoked_access` mapping.
- **verify_access** – Query `revoked_access` mapping via RPC; key = `{ file_id: Nu64, user: address }`.

## Build (requires Leo CLI)

```bash
cd contracts/privyshare_files_7879
leo build
```

## Deploy to Testnet

From project root (WSL or bash):

```bash
# Option 1: Use .env.local (add ALEO_PRIVATE_KEY=your_key)
./scripts/deploy-contract.sh

# Option 2: Pass key directly
ALEO_PRIVATE_KEY=your_aleo_private_key ./scripts/deploy-contract.sh
```

Or run `contracts/deploy.sh` directly with `PRIVATE_KEY` and optional `ENDPOINT`.

Then set `NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID=privyshare_files_7879.aleo` in `.env.local`.
