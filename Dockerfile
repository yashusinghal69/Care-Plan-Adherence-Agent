# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies for building
RUN apk add --no-cache curl git python3 make g++

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S careplan -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built application and server from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/public ./public

# Create logs and temp directories
RUN mkdir -p logs tmp && \
    chown -R careplan:nodejs /app

# Switch to non-root user
USER careplan

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
