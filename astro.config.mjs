import { defineConfig } from "astro/config";

// Static, no JS framework, no client-side routing.
export default defineConfig({
  site: "https://equanimi.tech",
  output: "static",
  compressHTML: true,
  build: {
    inlineStylesheets: "always",
  },
  devToolbar: { enabled: false },
});
