import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.js"),
      formats: ['es', 'umd'],
      name: "lp-language",
      fileName: "lp-language"
    },

    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["liveprinter-utils"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        //globals: "tonal",
      },
    },
  },
});
