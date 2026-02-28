#!/bin/bash
echo "Starting Render deployment script..."
echo "Current Python Version:"
python --version
echo "Downloading Prisma Query Engine..."
python -m prisma generate

echo "Starting FastAPI server directly..."
python app/main.py
