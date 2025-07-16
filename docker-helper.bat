@echo off
REM Docker Helper Script for Care Plan Adherence Agent
REM Usage: docker-helper.bat [command]

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="dev" goto dev
if "%1"=="prod" goto prod
if "%1"=="build" goto build
if "%1"=="stop" goto stop
if "%1"=="logs" goto logs
if "%1"=="clean" goto clean
if "%1"=="status" goto status
goto help

:help
echo Care Plan Adherence Agent - Docker Helper
echo =========================================
echo.
echo Available commands:
echo   dev         - Start development environment
echo   prod        - Start production environment
echo   build       - Build production image
echo   stop        - Stop all containers
echo   logs        - View logs
echo   clean       - Clean up Docker resources
echo   status      - Show container status
echo.
echo Examples:
echo   docker-helper.bat dev     # Start development
echo   docker-helper.bat prod    # Start production
echo   docker-helper.bat logs    # View logs
goto end

:dev
echo Starting development environment...
docker-compose -f docker-compose.dev.yml up --build
goto end

:prod
echo Starting production environment...
docker-compose up --build
goto end

:build
echo Building production image...
docker build -t care-plan-agent .
goto end

:stop
echo Stopping containers...
docker-compose down
docker-compose -f docker-compose.dev.yml down
goto end

:logs
echo Showing logs...
docker-compose logs -f
goto end

:clean
echo Cleaning Docker resources...
docker system prune -f
docker volume prune -f
goto end

:status
echo Container Status:
docker ps -a --filter "name=care-plan"
echo.
echo Images:
docker images | findstr "care-plan"
goto end

:end
