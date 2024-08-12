import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { peerDependencies } from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "sol-scheduling-components",
      fileName: (format) => `index.${format}.js`,
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies), "react/jsx-runtime"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()],
});
