import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        includeAssets: ["favicon.ico", "icon.png"],
        manifest: {
          name: "Offline Memos",
          short_name: "Offline Memos",
          description: "A note-taking client for Memos with offline support.",
          theme_color: "#ddc9c2",
          icons: [
            {
              src: "icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "icons/icon-180x180.png",
              sizes: "180x180",
              type: "image/png",
            },
            {
              src: "icons/maskable_icon_x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icons/maskable_icon_x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.APP_VERSION": JSON.stringify(env.VITE_APP_VERSION),
    },
  };
});
