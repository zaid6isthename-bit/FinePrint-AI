FROM python:3.11-slim

# Prevent Python from writing .pyc files & set unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the explicitly managed Prisma binary dir so we aren't relying on ~/.cache/
ENV PRISMA_BINARY_CACHE_DIR=/app/.prisma-binaries

# Set working directory
WORKDIR /app

# Install system dependencies needed for PyMuPDF, PyTorch, Prisma, etc.
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install via pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create the binary directory and explicitly force Prisma to download into the Docker Image Layer!
RUN mkdir -p /app/.prisma-binaries
RUN python -m prisma py fetch

# Copy Prisma schema and generate client types
COPY prisma/ prisma/
RUN python -m prisma generate

# Copy project files and startup script
COPY app/ app/
COPY start.sh .

# Ensure start.sh has execute permissions
RUN chmod +x start.sh

# Expose default port (Render will override this dynamically)
EXPOSE 8000

# Use the customized start script to dynamically bind to process ports and background any migrations
CMD ["bash", "start.sh"]
