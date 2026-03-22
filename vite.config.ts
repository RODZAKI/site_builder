import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/site_builder/",
  server: {
    host: true,
    port: 8080,
  },
  plugins: [react()],
});
