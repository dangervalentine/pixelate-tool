import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const singleFile = process.env.SINGLE_FILE === "true";

export default defineConfig({
  plugins: [react(), ...(singleFile ? [viteSingleFile()] : [])],
  base: singleFile ? "./" : "/pixelate-tool/",
});
