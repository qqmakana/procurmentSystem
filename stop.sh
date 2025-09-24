#!/bin/bash

echo "🛑 Stopping Procurement App..."
echo "==============================="

# Stop and remove the container
docker-compose down

# Remove the image (optional - uncomment if you want to clean up completely)
# docker rmi procurement-app-standalone 2>/dev/null || true

echo "✅ Procurement App stopped successfully!"
echo "🧹 All containers and networks have been cleaned up."
