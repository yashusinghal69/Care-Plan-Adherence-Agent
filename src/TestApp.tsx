import React from "react";

export const TestApp = () => {
  console.log("🧪 TestApp rendering...");

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "system-ui",
        backgroundColor: "hsl(210, 20%, 98%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "#2563eb", marginBottom: "20px" }}>
        ✅ React App is Working!
      </h1>
      <p style={{ color: "#666", marginBottom: "10px" }}>
        If you see this, React is rendering successfully.
      </p>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Current URL: {window.location.href}
      </p>
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f0f9ff",
          border: "1px solid #0ea5e9",
          borderRadius: "8px",
          maxWidth: "600px",
        }}
      >
        <h3 style={{ color: "#0369a1", margin: "0 0 10px 0" }}>
          Debug Information:
        </h3>
        <ul style={{ color: "#374151", margin: 0, paddingLeft: "20px" }}>
          <li>Document ready state: {document.readyState}</li>
          <li>Base URL: {window.location.origin}</li>
          <li>Pathname: {window.location.pathname}</li>
          <li>User agent: {navigator.userAgent}</li>
        </ul>
      </div>
      <button
        onClick={() => {
          console.log("🔄 Reloading page...");
          window.location.href = "/agents/patient-care-agent/";
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        🏠 Go to Main App
      </button>
    </div>
  );
};
