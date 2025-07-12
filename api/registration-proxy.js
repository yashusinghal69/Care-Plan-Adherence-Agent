// Create this file at: api/registration-proxy.js

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { input_value, output_type = "chat", input_type = "text" } = req.body;

    if (!input_value) {
      return res
        .status(400)
        .json({ error: "Missing required input_value parameter" });
    }

    // Get the registration flow ID from environment
    const registrationId = process.env.VITE_LANGFLOW_REGISTRATION_ID;

    if (!registrationId) {
      return res.status(500).json({ error: "Registration ID not configured" });
    }

    // Make the actual API call from your server (no CORS issues here)
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

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Registration proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
