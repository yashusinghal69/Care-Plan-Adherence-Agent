import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { TestApp } from "./TestApp.tsx";
import "./index.css";

// Toggle between test app and main app for debugging
const USE_TEST_APP = false; // Set to false to use main app

// Ensure DOM is fully loaded before rendering
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Function to hide loading spinner and show app
const hideLoadingSpinner = () => {
  document.body.classList.add("app-loaded");
  document.body.classList.add("css-loaded");
};

// Wait for all stylesheets to load
const waitForStylesLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    // Check if all stylesheets are loaded
    const checkStylesLoaded = () => {
      const stylesheets = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ) as HTMLLinkElement[];
      const allLoaded = stylesheets.every((link) => {
        try {
          return link.sheet && link.sheet.cssRules.length > 0;
        } catch (e) {
          // Cross-origin stylesheets might throw errors, assume they're loaded
          return true;
        }
      });

      if (allLoaded || stylesheets.length === 0) {
        resolve();
      } else {
        // Check again in 10ms
        setTimeout(checkStylesLoaded, 10);
      }
    };

    checkStylesLoaded();
  });
};

// Enhanced loading function with better error handling
const loadApp = async () => {
  try {
    console.log("🚀 Starting app initialization...");
    console.log("📍 Current URL:", window.location.href);
    console.log("📍 Document ready state:", document.readyState);

    // Wait for CSS to be fully loaded
    console.log("⏳ Waiting for CSS to load...");
    await waitForStylesLoaded();
    console.log("✅ CSS loaded successfully");

    // Add a small delay to ensure everything is painted
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("🎨 Creating React root...");
    const root = createRoot(rootElement);

    console.log("🏗️ Rendering App component...");
    // Use test app for debugging or main app
    const AppComponent = USE_TEST_APP ? TestApp : App;
    root.render(<AppComponent />);
    console.log(`✅ ${USE_TEST_APP ? "TestApp" : "App"} rendered successfully`);

    // Hide spinner after successful render
    setTimeout(() => {
      hideLoadingSpinner();
      console.log("🎉 App initialization complete!");
    }, 150);
  } catch (error) {
    console.error("❌ Failed to load app:", error);
    console.error("📍 Error stack:", error.stack);
    console.error("📍 Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    hideLoadingSpinner();
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #dc2626; font-family: system-ui;">
        <h2>🔧 App Loading Error</h2>
        <p>The application failed to load. Please check the console for details.</p>
        <details style="margin: 20px 0; text-align: left;">
          <summary style="cursor: pointer; font-weight: bold;">🐛 Error Details</summary>
          <pre style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 10px; overflow: auto; font-size: 12px; border: 1px solid #ddd;">${
            error.name
          }: ${error.message}\n\n${
      error.stack || "No stack trace available"
    }</pre>
        </details>
        <button 
          onclick="window.location.reload()" 
          style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;"
        >
          🔄 Reload Page
        </button>
      </div>
    `;
  }
};

// Wait for both DOM and stylesheets to be ready
const initializeApp = () => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadApp);
  } else {
    loadApp();
  }
};

// Start initialization
console.log("Initializing app with CSS loading checks...");
initializeApp();
