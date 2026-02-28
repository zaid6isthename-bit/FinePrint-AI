#!/bin/bash
echo "Starting Render deployment script..."
echo "Current Python Version:"
python --version
echo "Starting FastAPI server directly..."
python app/main.py
