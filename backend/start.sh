#!/bin/bash
set -e

echo "=== FinePrint AI — Render Startup ==="

echo "Step 1: Generating Prisma client and downloading query engine..."
python -m prisma generate

echo "Step 2: Applying schema to database..."
python -m prisma db push --accept-data-loss

echo "Step 3: Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
