@echo off
echo 🏥 Care Plan Adherence Agent - Docker Setup
echo ==========================================

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from example...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your actual Langflow configuration!
    echo 📍 Required variables:
    echo    - VITE_BASE_DEPLOYED_URL
    echo    - VITE_LANGFLOW_FLOW_ADHERENCE_ID
    echo    - VITE_LANGFLOW_REGISTRATION_ID
    echo    - VITE_LANGFLOW_FLOW_SCHEDULER_ID
    echo.
    pause
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

echo 🔨 Building and starting the application...

echo 🚀 Starting the application...
echo 📍 Application will be available at: http://localhost:3000/agents/patient-care-agent/
echo 📍 Health check at: http://localhost:3000/health
echo 📍 Frontend and Backend run together in one container
echo 📍 Server.js handles both static files and API proxies
echo.
echo 🛑 To stop the application, press Ctrl+C
echo.

REM Start with docker-compose for better management
if exist docker-compose.yml (
    echo 📦 Using Docker Compose for deployment...
    docker-compose down >nul 2>&1
    docker-compose up --build --remove-orphans
) else (
    echo 🐳 Using direct Docker run...
    docker build -t care-plan-agent .
    if %errorlevel% equ 0 (
        docker run -p 3000:3000 --env-file .env care-plan-agent
    ) else (
        echo ❌ Failed to build Docker image
        pause
        exit /b 1
    )
)
