FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies needed for PyMuPDF, PyTorch, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Prisma schema and generate client
COPY prisma/ prisma/
RUN prisma generate

# Copy project files
COPY app/ app/

# Expose port
EXPOSE 8000

# Command to run the application (overridden in docker-compose for dev)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
