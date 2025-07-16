#!/bin/bash

# Care Plan Adherence Agent - Docker Deployment Script

echo "🏥 Care Plan Adherence Agent - Docker Setup"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual Langflow configuration!"
    echo "📍 Required variables:"
    echo "   - VITE_BASE_DEPLOYED_URL"
    echo "   - VITE_LANGFLOW_FLOW_ADHERENCE_ID"
    echo "   - VITE_LANGFLOW_REGISTRATION_ID"
    echo "   - VITE_LANGFLOW_FLOW_SCHEDULER_ID"
    echo ""
    read -p "Press Enter to continue after updating .env file..."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🔨 Building Docker image..."
docker build -t care-plan-agent .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "🚀 Starting the application..."
    echo "📍 Application will be available at: http://localhost:3000/agents/patient-care-agent/"
    echo "📍 Health check at: http://localhost:3000/health"
    echo ""
    echo "🛑 To stop the application, press Ctrl+C"
    echo ""
    
    # Start with docker-compose for better management
    if [ -f docker-compose.yml ]; then
        docker-compose up
    else
        docker run -p 3000:3000 --env-file .env care-plan-agent
    fi
else
    echo "❌ Failed to build Docker image"
    exit 1
fi
