#!/usr/bin/env bash
# Deploy PrivyShare Leo contract to Aleo Testnet.
# Run from WSL or any bash-compatible shell.
#
# Usage:
#   ALEO_PRIVATE_KEY=your_key ./scripts/deploy-contract.sh
#   # or: source .env.local && ./scripts/deploy-contract.sh
#
# Requires: Leo CLI (https://docs.leo-lang.org), funded testnet wallet.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Load ALEO_PRIVATE_KEY from .env.local or .env if not set
if [ -z "$ALEO_PRIVATE_KEY" ] && [ -z "$PRIVATE_KEY" ]; then
  if [ -f "$PROJECT_ROOT/.env.local" ]; then
    set -a
    source "$PROJECT_ROOT/.env.local"
    set +a
  elif [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
  fi
fi

# Prefer ALEO_PRIVATE_KEY, fall back to PRIVATE_KEY
export PRIVATE_KEY="${ALEO_PRIVATE_KEY:-$PRIVATE_KEY}"

if [ -z "$PRIVATE_KEY" ]; then
  echo "Error: ALEO_PRIVATE_KEY or PRIVATE_KEY not set."
  echo "Set it in .env.local or pass as env var:"
  echo "  ALEO_PRIVATE_KEY=your_key ./scripts/deploy-contract.sh"
  exit 1
fi

echo "Building and deploying contract..."
cd "$PROJECT_ROOT"
bash contracts/deploy.sh

echo "Done. Set NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID=privyshare_files_7879.aleo in .env.local"
