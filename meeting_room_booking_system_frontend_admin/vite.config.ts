import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const config = loadEnv(mode, __dirname);

  return {
    plugins: [react()],
    build: {
      outDir: "build",
      sourcemap: true,
      terserOptions: {
        compress: {
          drop_console: command === "build" && config.VITE_ENV === "prod",
          drop_debugger: command === "build" && config.VITE_ENV === "prod",
        },
      },
    },
    server: {
      open: true,
      proxy: {
        "^/api": {
          target: config.VITE_TARGET, // 从环境变量中获取
          changeOrigin: true /* 允许跨域 */,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "src") },
        { find: "@api", replacement: path.resolve(__dirname, "src/api") },
      ],
    },
  };
});
