#!/bin/bash
set -e

echo "=== FinePrint AI - Render Startup ==="

echo "Step 1: Applying schema to database..."
# Use || true so deployment continues even if db push fails.
# Prisma client generation happens during build, so skip it at boot.
python -m prisma db push --skip-generate --accept-data-loss || echo "db push failed - continuing anyway (schema may already be up to date)"

echo "Step 2: Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}
