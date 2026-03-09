#!/bin/bash
set -e

echo "=== FinePrint AI — Render Startup ==="

echo "Step 1: Generating Prisma client and downloading query engine..."
python -m prisma generate

echo "Step 2: Applying schema to database..."
# Use || true so deployment continues even if db push fails
# Make sure DATABASE_URL uses direct connection (port 5432), NOT the pooler (port 6543)
python -m prisma db push --accept-data-loss || echo "⚠️  db push failed - continuing anyway (schema may already be up to date)"

echo "Step 3: Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
