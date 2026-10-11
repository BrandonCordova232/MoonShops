import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" para poder servir el build desde cualquier ruta (GitHub Pages, artifact, etc.)
export default defineConfig({ base: "./", plugins: [react(), tailwindcss()] });
