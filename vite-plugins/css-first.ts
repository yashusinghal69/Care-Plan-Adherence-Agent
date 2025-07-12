import type { Plugin } from "vite";

export function cssFirstPlugin(): Plugin {
  return {
    name: "css-first",
    generateBundle(options, bundle) {
      // Find the HTML file
      const htmlFile = Object.keys(bundle).find((key) => key.endsWith(".html"));
      if (htmlFile && bundle[htmlFile] && "source" in bundle[htmlFile]) {
        const htmlBundle = bundle[htmlFile] as any;
        let html = htmlBundle.source as string;

        // Extract script and link tags
        const scriptMatch = html.match(
          /<script[^>]*src="[^"]*"[^>]*><\/script>/
        );
        const linkMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*>/);

        if (scriptMatch && linkMatch) {
          // Remove the script tag
          html = html.replace(scriptMatch[0], "");

          // Insert the script tag after the link tag
          html = html.replace(
            linkMatch[0],
            linkMatch[0] + "\n    " + scriptMatch[0]
          );

          htmlBundle.source = html;
        }
      }
    },
  };
}
