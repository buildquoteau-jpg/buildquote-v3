import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.GOOGLE_PLACES_API_KEY": JSON.stringify(
      process.env.GOOGLE_PLACES_API_KEY ?? ""
    ),
  },
});
