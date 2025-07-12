// Create this file at: api/adherence-proxy.js

export default async function handler(req, res) {


  // Only allow POST requests
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

    // Get the adherence flow ID from environment
    const adherenceId = process.env.VITE_LANGFLOW_FLOW_ADHERENCE_ID;

    if (!adherenceId) {
      return res.status(500).json({ error: "Adherence ID not configured" });
    }

    // Make the actual API call from your server (no CORS issues here)
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

    // Return the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Adherence proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
