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

# ---- KEY FIX: Start the web server FIRST so Render detects an open port ----
echo "Step 1: Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000} &
SERVER_PID=$!

# Give the server a moment to bind the port
sleep 3

# Now run db push in the foreground. The server is already up,
# so Render won't kill us even if this takes a while.
# We swap the pooler port (6543) for the direct port (5432) for migrations,
# because pgbouncer/pooler connections don't support DDL well.
echo "Step 2: Syncing database schema..."
MIGRATION_URL=$(echo "$DATABASE_URL" | sed 's/:6543/:5432/g')
DATABASE_URL="$MIGRATION_URL" python -m prisma db push --skip-generate --accept-data-loss || echo "WARNING: db push failed, server continues with existing schema"

echo "=== Startup complete ==="

# Wait for the server process to keep running forever
wait $SERVER_PID
