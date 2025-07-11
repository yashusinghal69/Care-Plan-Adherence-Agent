import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Adherence Proxy
app.post("/api/adherence-proxy", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

// Registration Proxy
app.post("/api/registration-proxy", async (req, res) => {
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

// Scheduler Proxy
app.post("/api/scheduler-proxy", async (req, res) => {
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

app.listen(PORT, () => {
   
});
