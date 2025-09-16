import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), tailwindcss()],
  base: '/adminPanel/',
})
