#!/bin/bash
set -e

echo "=== FinePrint AI — Render Startup ==="

echo "Applying schema to database..."
python -m prisma db push --accept-data-loss

echo "Starting FastAPI server..."
PORT=${PORT:-10000}
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT
