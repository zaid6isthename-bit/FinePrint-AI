#!/bin/bash
set -e

echo "=== FinePrint AI — Render Startup ==="

echo "Step 1: Fetching Prisma query engine binary..."
python -m prisma fetch

echo "Step 2: Generating Prisma client..."
python -m prisma generate

echo "Step 3: Applying schema to database..."
python -m prisma db push --accept-data-loss

echo "Step 4: Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
