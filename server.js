import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use('/agents/patient-care-agent', express.static(path.join(__dirname, 'dist')));

// API Routes

// Adherence API Route
app.post('/api/adherence-proxy', async (req, res) => {
  try {
    const { input_value, output_type = "text", input_type = "text" } = req.body;

    if (!input_value) {
      return res
        .status(400)
        .json({ error: "Missing required input_value parameter" });
    }

    const adherenceId = process.env.VITE_LANGFLOW_FLOW_ADHERENCE_ID;

    if (!adherenceId) {
      return res.status(500).json({ error: "Adherence ID not configured" });
    }

    const response = await fetch(
      `${process.env.VITE_BASE_DEPLOYED_URL}/run/${adherenceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value,
          output_type,
          input_type,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error("Adherence proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Registration API Route
app.post('/api/registration-proxy', async (req, res) => {
  try {
    const { input_value, output_type = "chat", input_type = "text" } = req.body;

    if (!input_value) {
      return res
        .status(400)
        .json({ error: "Missing required input_value parameter" });
    }

    const registrationId = process.env.VITE_LANGFLOW_REGISTRATION_ID;

    if (!registrationId) {
      return res.status(500).json({ error: "Registration ID not configured" });
    }

    const response = await fetch(
      `${process.env.VITE_BASE_DEPLOYED_URL}/run/${registrationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value,
          output_type,
          input_type,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error("Registration proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Scheduler API Route
app.post('/api/scheduler-proxy', async (req, res) => {
  try {
    const { input_value, output_type = "text", input_type = "text" } = req.body;

    if (!input_value) {
      return res
        .status(400)
        .json({ error: "Missing required input_value parameter" });
    }

    const schedulerId = process.env.VITE_LANGFLOW_FLOW_SCHEDULER_ID;

    if (!schedulerId) {
      return res.status(500).json({ error: "Scheduler ID not configured" });
    }

    const response = await fetch(
      `${process.env.VITE_BASE_DEPLOYED_URL}/run/${schedulerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_value,
          output_type,
          input_type,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error("Scheduler proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('/agents/patient-care-agent/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/agents/patient-care-agent/');
});

// Graceful shutdown handling for Docker
let server;

// Start server
server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend available at: http://localhost:${PORT}/agents/patient-care-agent/`);
  console.log(`Health check at: http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
    
    console.log('Server closed. Exiting process...');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});
