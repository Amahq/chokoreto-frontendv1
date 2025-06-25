import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    __BRANCH__: JSON.stringify(process.env.CF_PAGES_BRANCH || ""),
  },
});