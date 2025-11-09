import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_SERVER_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/v1": {
          target,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/v1/, ""),
        },
      },
    },
  };
});
