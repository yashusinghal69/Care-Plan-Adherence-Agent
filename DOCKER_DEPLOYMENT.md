# Care Plan Adherence Agent - Docker Deployment Guide

This project is a full-stack application with React frontend and Node.js/Express backend deployed in a **single Docker container**. The server serves both the built React app and the API endpoints.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- A `.env` file with your Langflow configuration

### Environment Setup

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Fill in your Langflow configuration in `.env`:
   ```env
   VITE_BASE_DEPLOYED_URL=https://your-langflow-deployment.com
   VITE_LANGFLOW_FLOW_ADHERENCE_ID=your-adherence-flow-id
   VITE_LANGFLOW_REGISTRATION_ID=your-registration-flow-id
   VITE_LANGFLOW_FLOW_SCHEDULER_ID=your-scheduler-flow-id
   ```

## 🐳 Docker Deployment Options

### Option 1: Production Deployment (Recommended)

```bash
# Build and start production container
docker-compose up --build

# Or use the helper script
.\docker-helper.ps1 prod
```

The application will be available at:

- **Frontend & API**: http://localhost:3000/agents/patient-care-agent/
- **Health Check**: http://localhost:3000/health

### Option 2: Development with Hot Reload

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Or use the helper script
.\docker-helper.ps1 dev
```

Development ports:

- **Backend**: http://localhost:3000
- **Frontend (Vite)**: http://localhost:5173

## �️ Helper Scripts

### PowerShell Script (Recommended for Windows)

```powershell
# Available commands
.\docker-helper.ps1 dev         # Development environment
.\docker-helper.ps1 prod        # Production environment
.\docker-helper.ps1 build       # Build production image
.\docker-helper.ps1 stop        # Stop all containers
.\docker-helper.ps1 logs        # View logs
.\docker-helper.ps1 status      # Container status
.\docker-helper.ps1 clean       # Clean Docker resources
.\docker-helper.ps1 reset       # Reset everything
```

### NPM Scripts

```bash
# Production
npm run docker:up              # Start production
npm run docker:build           # Build production image

# Development
npm run docker:up:dev          # Start development

# Management
npm run docker:down            # Stop containers
npm run docker:logs           # View logs
npm run docker:clean          # Clean resources
```

## 📁 Container Architecture

### Single Container Design

The application uses a **single Docker container** that:

1. **Build Stage**:

   - Installs dependencies
   - Builds the React frontend (`npm run build`)
   - Creates optimized production assets

2. **Production Stage**:
   - Serves built React app as static files
   - Runs Express.js server for API endpoints
   - Handles routing for SPA (Single Page Application)

### File Structure in Container

```
/app/
├── dist/           # Built React application
├── server.js       # Express server (serves both frontend & API)
├── node_modules/   # Production dependencies only
├── logs/           # Application logs
└── tmp/           # Temporary files
```

## 🔧 Configuration

### Environment Variables

| Variable                          | Description          | Default      |
| --------------------------------- | -------------------- | ------------ |
| `NODE_ENV`                        | Environment mode     | `production` |
| `PORT`                            | Server port          | `3000`       |
| `VITE_BASE_DEPLOYED_URL`          | Langflow base URL    | Required     |
| `VITE_LANGFLOW_FLOW_ADHERENCE_ID` | Adherence flow ID    | Required     |
| `VITE_LANGFLOW_REGISTRATION_ID`   | Registration flow ID | Required     |
| `VITE_LANGFLOW_FLOW_SCHEDULER_ID` | Scheduler flow ID    | Required     |

## 🚀 Quick Deployment

### 1. Environment Setup

Copy the environment template and configure your Langflow settings:

```bash
cp .env.template .env
```

Edit `.env` with your actual values:

```env
# Langflow API Configuration (REQUIRED)
VITE_BASE_DEPLOYED_URL=https://your-langflow-instance.com/api/v1/run
VITE_LANGFLOW_FLOW_ADHERENCE_ID=your-adherence-flow-id
VITE_LANGFLOW_REGISTRATION_ID=your-registration-flow-id
VITE_LANGFLOW_FLOW_SCHEDULER_ID=your-scheduler-flow-id

# Application Configuration
VITE_BASE_URL=/agents/patient-care-agent
PORT=3000

# Optional: For production
NODE_ENV=production
```

### 2. Build and Run

**Option A: Using the startup scripts (Recommended)**

Windows:

```bash
./start-docker.bat
```

Linux/Mac:

```bash
chmod +x start-docker.sh
./start-docker.sh
```

**Option B: Manual Docker Compose**

```bash
# Development mode
docker-compose -f docker-compose.dev.yml up --build

# Production mode
docker-compose up --build

# Production with Nginx proxy
docker-compose --profile production up --build
```

**Option C: Direct Docker**

```bash
# Build the image
docker build -t care-plan-agent .

# Run the container
docker run -p 3000:3000 --env-file .env care-plan-agent
```

## 🌐 Access Points

Once deployed, access the application at:

- **Frontend UI**: http://localhost:3000/agents/patient-care-agent/
- **Health Check**: http://localhost:3000/health
- **API Endpoints**:
  - POST http://localhost:3000/api/adherence-proxy
  - POST http://localhost:3000/api/registration-proxy
  - POST http://localhost:3000/api/scheduler-proxy

## 🔧 Configuration

### Environment Variables

| Variable                          | Description                        | Required                                 |
| --------------------------------- | ---------------------------------- | ---------------------------------------- |
| `VITE_BASE_DEPLOYED_URL`          | Your Langflow instance base URL    | ✅                                       |
| `VITE_LANGFLOW_FLOW_ADHERENCE_ID` | Adherence flow ID from Langflow    | ✅                                       |
| `VITE_LANGFLOW_REGISTRATION_ID`   | Registration flow ID from Langflow | ✅                                       |
| `VITE_LANGFLOW_FLOW_SCHEDULER_ID` | Scheduler flow ID from Langflow    | ✅                                       |
| `VITE_BASE_URL`                   | Base path for the app              | ❌ (default: /agents/patient-care-agent) |
| `PORT`                            | Port to run the server on          | ❌ (default: 3000)                       |
| `NODE_ENV`                        | Environment mode                   | ❌ (default: production)                 |

### Docker Compose Profiles

- **Default**: Basic application with health checks
- **Production**: Includes Nginx reverse proxy with caching and security headers

## 🏭 Production Deployment

### With Nginx Reverse Proxy

```bash
docker-compose --profile production up -d --build
```

This setup includes:

- Nginx reverse proxy
- Gzip compression
- Security headers
- Static asset caching
- Health checks

### Custom Domain Setup

1. Update `nginx.conf` with your domain
2. Add SSL certificates to `./ssl/` directory
3. Uncomment HTTPS configuration in `nginx.conf`
4. Run with production profile

### Environment-Specific Configs

For different environments, create separate compose files:

```bash
# Staging
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 🔍 Monitoring & Troubleshooting

### Health Checks

The application includes built-in health checks:

```bash
# Check container health
docker ps

# View health check logs
docker logs <container-id>

# Manual health check
curl http://localhost:3000/health
```

### Logs

```bash
# View application logs
docker-compose logs -f care-plan-agent

# View specific service logs
docker-compose logs -f nginx
```

### Common Issues

1. **Port already in use**: Change the port mapping in docker-compose.yml
2. **Environment variables not loaded**: Ensure .env file exists and has correct values
3. **Langflow connection failed**: Verify VITE_BASE_DEPLOYED_URL and flow IDs
4. **Build failures**: Check Docker version and available disk space

## 🔄 Updates & Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Cleanup

```bash
# Remove containers
docker-compose down

# Remove images and volumes
docker-compose down --rmi all --volumes

# System cleanup
docker system prune -a
```

## 📊 Performance Optimization

### Multi-stage Build

The Dockerfile uses a single-stage build optimized for production:

- Installs all dependencies for building
- Builds the application
- Removes dev dependencies
- Runs as non-root user

### Resource Limits

Add resource limits to docker-compose.yml:

```yaml
services:
  care-plan-agent:
    # ... other config
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
        reservations:
          memory: 256M
          cpus: "0.25"
```

## 🔐 Security Best Practices

1. **Non-root user**: Application runs as non-root user (nextjs:1001)
2. **Minimal base image**: Uses Alpine Linux for smaller attack surface
3. **Health checks**: Built-in health monitoring
4. **Security headers**: Nginx adds security headers in production
5. **Environment isolation**: Sensitive data in environment variables only

## 🤝 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure Docker has sufficient resources
4. Check network connectivity to Langflow APIs
