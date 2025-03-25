# Python 3.13 image
FROM python:3.13

# Set working directory inside the container
WORKDIR /backend/app

# Install system dependencies (cmake and libgl1)
RUN apt-get update && apt-get install -y \
    cmake \
    libgl1 \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copy pip requirements.txt
COPY app/requirements.txt /backend/app/requirements.txt

# Install pip dependencies
RUN pip install --no-cache-dir -r /backend/app/requirements.txt

# Copy backend code and requirements.txt
COPY app /backend/app

# Copy the .env file into the container
COPY .env /backend/.env

# Copy Supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 8000 8765

# Start Supervisor (which runs both processes for api and socket)
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
