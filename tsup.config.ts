import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts"],
  outDir: "build",
  format: ["cjs"],
  target: "node16",
  clean: true,
  external: ["@prisma/client", "prisma"],
  noExternal: ["@prisma/client"],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      ".prisma": "text",
      ".wasm": "file",
    };
  },
});
