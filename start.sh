#!/bin/bash

echo "🚀 Starting Procurement App..."
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing procurement containers
echo "🧹 Cleaning up any existing containers..."
docker stop procurement-app-standalone 2>/dev/null || true
docker rm procurement-app-standalone 2>/dev/null || true

# Build and start the app
echo "🔨 Building and starting the app..."
docker-compose up --build -d

# Wait a moment for the container to start
sleep 3

# Check if the container is running
if docker ps | grep -q procurement-app-standalone; then
    echo "✅ Procurement App is running!"
    echo "🌐 Open your browser and go to: http://localhost:8080"
    echo ""
    echo "📋 To stop the app, run: docker-compose down"
    echo "📋 To view logs, run: docker-compose logs -f"
else
    echo "❌ Failed to start the app. Check the logs with: docker-compose logs"
    exit 1
fi
