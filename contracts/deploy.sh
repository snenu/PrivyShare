#!/usr/bin/env bash
# Build and deploy PrivyShare program to Aleo Testnet.
# Requires: leo CLI, PRIVATE_KEY and optionally ENDPOINT.
set -e
cd "$(dirname "$0")/privyshare_files_7879"
leo build
leo deploy \
  --private-key "$PRIVATE_KEY" \
  --network testnet \
  --endpoint "${ENDPOINT:-https://api.explorer.provable.com/v2}" \
  --broadcast \
  --yes
