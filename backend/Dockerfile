# Slim python image
FROM python:3.12-slim

# A bit optimizer vars :3
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Install system dependencies for psycopg2-binary and other tools
RUN apt-get update &&\
    apt-get install -y --no-install-recommends build-essential binutils gcc libpq-dev &&\
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app/backend

# Copy the current directory contents into the container at /app/
COPY . .

# Install python modules
RUN pip install --no-cache-dir -r requirements.txt

# Expose the django port
EXPOSE 8000

# Run the entrypoint script
CMD [ "bash", "scripts/entrypoint.sh" ]
