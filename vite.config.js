import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_SERVER_URL || "http://localhost:3000";
  console.log("taget", target);

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
        },
      },

      allowedHosts: ["bethanie-monochromical-sirenically.ngrok-free.dev"],
    },
  };
});
