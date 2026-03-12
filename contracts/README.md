# PrivyShare Leo Programs

## privyshare_files_7879.aleo

- **register_file(ipfs_cid, price, file_id)** – Register a file. Get next `file_id` by querying `file_counter` mapping first, then pass `file_id = counter + 1`.
- **set_price(file_id, new_price, file_record)** – Update listing price (owner only).
- **grant_access(file_id, buyer)** – Owner grants access to `buyer`; creates `AccessRecord` for buyer.
- **revoke_access(file_id, buyer)** – Owner revokes access; sets `revoked_access` mapping.

## Build (requires Leo CLI)

```bash
cd contracts/privyshare_files_7879
leo build
```

## Deploy to Testnet

```bash
export PRIVATE_KEY="your_aleo_private_key"
export ENDPOINT="https://api.explorer.provable.com/v2"  # optional
./contracts/deploy.sh
```

Then set `NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID=privyshare_files_7879.aleo` in `.env.local`.
