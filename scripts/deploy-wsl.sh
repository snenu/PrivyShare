#!/usr/bin/env bash
# PrivyShare Leo contract deployment for WSL
# Run from project root in WSL: PRIVATE_KEY=xxx bash scripts/deploy-wsl.sh
# Requires: WSL with Ubuntu, Leo CLI (https://developer.aleo.org/leo/installation)

set -e

PRIVATE_KEY="${PRIVATE_KEY:?PRIVATE_KEY env var required. Run: PRIVATE_KEY=xxx bash scripts/deploy-wsl.sh}"
ENDPOINT="https://api.explorer.provable.com/v2"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTRACT_DIR="$PROJECT_ROOT/contracts/privyshare_files_7879"

echo "=== PrivyShare Deployment ==="
echo "Project root: $PROJECT_ROOT"
echo "Contract dir: $CONTRACT_DIR"
echo ""

if ! command -v leo &> /dev/null; then
  echo "Error: Leo CLI not found. Install from https://developer.aleo.org/leo/installation"
  exit 1
fi

echo "Building..."
cd "$CONTRACT_DIR"
leo build

echo ""
echo "Deploying to Aleo Testnet..."
leo deploy \
  --private-key "$PRIVATE_KEY" \
  --network testnet \
  --endpoint "$ENDPOINT" \
  --broadcast \
  --yes

echo ""
echo "=== Deployment complete ==="
echo "Update .env.local with: NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID=privyshare_files_7879.aleo"
