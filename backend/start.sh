#!/bin/bash
set -e

echo "=== Barrister AI - Render Startup ==="

# Set custom cache directory so Render doesn't wipe the engine binary
export PRISMA_BINARY_CACHE_DIR="/opt/render/project/src/.prisma-binaries"

# Fetch the query engine binary BEFORE starting uvicorn so connect_db() doesn't fail
python -m prisma py fetch

# Explicitly ensure binaries are executable (often a subtle bug on Render/Linux)
chmod +x /opt/render/project/src/.prisma-binaries/* || true

# Generate the Prisma client at runtime to ensure the hardcoded paths perfectly align with the current environment
python -m prisma generate

# Run db push synchronously to ensure schema is ready and to prevent background race conditions with uvicorn
python -m prisma db push --skip-generate --accept-data-loss

echo "Step 2: Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
