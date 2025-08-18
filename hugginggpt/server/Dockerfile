FROM python:3.10-slim

# Install git and git-lfs for dependencies and model downloads
RUN apt-get update && apt-get install -y --no-install-recommends \
    git git-lfs && \
    git lfs install && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy server code
COPY . .

EXPOSE 8004

# Default command runs the server with the lightweight config
CMD ["python", "awesome_chat.py", "--config", "configs/config.lite.yaml", "--mode", "server"]
