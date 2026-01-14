# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for sentence-transformers and PDF processing
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for Docker cache optimization)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Note: The sentence-transformer model will download at runtime on first request
# (This avoids version conflicts between sentence-transformers and huggingface_hub)

# Copy application code
COPY . .

# Create chroma_db directory
RUN mkdir -p /app/chroma_db

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Run with gunicorn for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
