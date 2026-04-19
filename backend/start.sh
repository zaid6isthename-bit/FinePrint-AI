#!/bin/bash
set -e

echo "=== Barrister AI - Render Startup ==="

# Set custom cache directory relative to the app root in Docker
export PRISMA_BINARY_CACHE_DIR="./.prisma-binaries"

# Fetch the query engine binary
python -m prisma py fetch

# Ensure binaries are executable
chmod +x ./.prisma-binaries/* || true

# Generate the Prisma client
python -m prisma generate

# Run db push - we'll add a timeout so it doesn't block the server indefinitely
echo "Step 1: Syncing database schema..."
python -m prisma db push --skip-generate --accept-data-loss & 
PUSH_PID=$!

# Wait a few seconds for the push to start, then proceed to start the server 
# so Render detects an open port immediately.
sleep 5

echo "Step 2: Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
