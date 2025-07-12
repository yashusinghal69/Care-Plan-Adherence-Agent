import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure favicon files are copied to dist
const distDir = path.join(__dirname, "dist");
const publicDir = path.join(__dirname, "public");

// Copy favicon files to the root of dist (for the base path)
const faviconFiles = ["favicon.svg", "favicon.ico"];

faviconFiles.forEach((file) => {
  const src = path.join(publicDir, file);
  const dest = path.join(distDir, file);

  if (fs.existsSync(src)) {
    try {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${file} to dist/`);
    } catch (error) {
      console.warn(`⚠ Could not copy ${file}:`, error.message);
    }
  }
});

// Also ensure they're available at the base path location for absolute references
const basePath = path.join(distDir, "agents", "patient-care-agent");
if (fs.existsSync(basePath)) {
  faviconFiles.forEach((file) => {
    const src = path.join(publicDir, file);
    const dest = path.join(basePath, file);

    if (fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied ${file} to base path`);
      } catch (error) {
        console.warn(`⚠ Could not copy ${file} to base path:`, error.message);
      }
    }
  });
}

// Fix CSS loading order in HTML
const htmlPath = path.join(distDir, "index.html");
if (fs.existsSync(htmlPath)) {
  try {
    let html = fs.readFileSync(htmlPath, "utf8");

    // Extract script and link tags
    const scriptMatch = html.match(
      /<script[^>]*type="module"[^>]*src="[^"]*"[^>]*><\/script>/
    );
    const linkMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*>/);

    if (scriptMatch && linkMatch) {
      console.log("Reordering CSS and JS loading...");

      // Remove the script tag from its current position
      html = html.replace(scriptMatch[0], "");

      // Insert the script tag after the link tag
      html = html.replace(
        linkMatch[0],
        linkMatch[0] + "\n    " + scriptMatch[0]
      );

      // Write the updated HTML back
      fs.writeFileSync(htmlPath, html, "utf8");
      console.log("✓ Fixed CSS/JS loading order");
    }
  } catch (error) {
    console.warn("⚠ Could not fix HTML loading order:", error.message);
  }
}

console.log("✓ Post-build tasks completed");
