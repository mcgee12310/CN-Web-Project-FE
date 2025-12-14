import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("VITE_SERVER_URL:", env.VITE_SERVER_URL);

  return {
    plugins: [react()],
    server: {
      allowedHosts: ["fatima-pulverulently-seminomadically.ngrok-free.dev"],
    },
  };
});
