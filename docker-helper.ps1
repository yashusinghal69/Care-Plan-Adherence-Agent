#!/usr/bin/env pwsh
# Docker Helper Script for Care Plan Adherence Agent
# Usage: .\docker-helper.ps1 [command]

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "Care Plan Adherence Agent - Docker Helper" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  dev         - Start development environment (single container)"
    Write-Host "  dev-sep     - Start development environment (separate containers)"
    Write-Host "  prod        - Start production environment"
    Write-Host "  build       - Build production image"
    Write-Host "  build-dev   - Build development image"
    Write-Host "  stop        - Stop all containers"
    Write-Host "  logs        - View production logs"
    Write-Host "  logs-dev    - View development logs"
    Write-Host "  clean       - Clean up Docker resources"
    Write-Host "  reset       - Reset everything (removes volumes!)"
    Write-Host "  status      - Show container status"
    Write-Host "  shell       - Open shell in running container"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\docker-helper.ps1 dev     # Start development"
    Write-Host "  .\docker-helper.ps1 prod    # Start production"
    Write-Host "  .\docker-helper.ps1 logs    # View logs"
}

function Start-Development {
    Write-Host "Starting development environment..." -ForegroundColor Green
    docker-compose -f docker-compose.dev.yml up --build
}

function Start-DevelopmentSeparate {
    Write-Host "Starting development environment (separate containers)..." -ForegroundColor Green
    docker-compose -f docker-compose.dev.yml --profile separate-services up --build
}

function Start-Production {
    Write-Host "Starting production environment..." -ForegroundColor Green
    docker-compose up --build
}

function Build-Production {
    Write-Host "Building production image..." -ForegroundColor Green
    docker build -t care-plan-agent .
}

function Build-Development {
    Write-Host "Building development image..." -ForegroundColor Green
    docker build -t care-plan-agent:dev --target builder .
}

function Stop-Containers {
    Write-Host "Stopping containers..." -ForegroundColor Yellow
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
}

function Show-Logs {
    param([string]$Environment = "prod")
    
    if ($Environment -eq "dev") {
        Write-Host "Showing development logs..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml logs -f
    } else {
        Write-Host "Showing production logs..." -ForegroundColor Green
        docker-compose logs -f
    }
}

function Clean-Docker {
    Write-Host "Cleaning Docker resources..." -ForegroundColor Yellow
    docker system prune -f
    docker volume prune -f
}

function Reset-Docker {
    Write-Host "WARNING: This will remove all containers, images, and volumes!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        docker-compose down -v --remove-orphans
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans
        docker system prune -af
        Write-Host "Docker environment reset complete." -ForegroundColor Green
    } else {
        Write-Host "Reset cancelled." -ForegroundColor Yellow
    }
}

function Show-Status {
    Write-Host "Container Status:" -ForegroundColor Green
    docker ps -a --filter "name=care-plan"
    Write-Host ""
    Write-Host "Images:" -ForegroundColor Green
    docker images | Select-String "care-plan"
}

function Open-Shell {
    $containers = docker ps --filter "name=care-plan" --format "table {{.Names}}\t{{.Status}}"
    Write-Host "Running containers:" -ForegroundColor Green
    Write-Host $containers
    
    $containerName = Read-Host "Enter container name (or press Enter for 'care-plan-agent')"
    if ([string]::IsNullOrEmpty($containerName)) {
        $containerName = "care-plan-agent"
    }
    
    Write-Host "Opening shell in container: $containerName" -ForegroundColor Green
    docker exec -it $containerName /bin/sh
}

# Main command dispatcher
switch ($Command.ToLower()) {
    "dev" { Start-Development }
    "dev-sep" { Start-DevelopmentSeparate }
    "prod" { Start-Production }
    "build" { Build-Production }
    "build-dev" { Build-Development }
    "stop" { Stop-Containers }
    "logs" { Show-Logs }
    "logs-dev" { Show-Logs -Environment "dev" }
    "clean" { Clean-Docker }
    "reset" { Reset-Docker }
    "status" { Show-Status }
    "shell" { Open-Shell }
    "help" { Show-Help }
    default { 
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help 
    }
}
