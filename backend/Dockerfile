# Python 3.13 image
FROM python:3.13

# Set working directory inside the container
WORKDIR /backend/app

# Install system dependencies (cmake and libgl1)
RUN apt-get update && apt-get install -y cmake && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y libgl1


# Copy backend code and requirements.txt
COPY app /backend/app
COPY app/requirements.txt /backend/app/requirements.txt

# Copy the .env file into the container
COPY .env /backend/.env

# Install pip dependencies
RUN pip install --no-cache-dir -r /backend/app/requirements.txt

# Expose ports
EXPOSE 8000 8765

# Run both services
CMD ["sh", "-c", "python3 main.py & python3 websocket.py && wait"]
