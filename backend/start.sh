#!/bin/bash
set -e

echo "=== FinePrint AI — Render Startup ==="
echo "Python Version:"
python --version

echo ""
echo "Step 1: Fetching Prisma Query Engine binary..."
python -m prisma fetch

echo ""
echo "Step 2: Generating Prisma Client..."
python -m prisma generate

echo ""
echo "Step 3: Applying database migrations..."
python -m prisma db push --accept-data-loss

echo ""
echo "Step 4: Starting FastAPI server..."
python app/main.py
