import copy from "rollup-plugin-copy";
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "./dist",
        sourcemap: true,
        rollupOptions: {
            input: {
                control: "./tracker/tracker.js"
            },
            output: {
                entryFileNames: 'module/entry-[name].js',
                format: "es",
            },
        },
    },
    plugins: [
        copy({
            targets: [
                { src: "./module.json", dest: "dist" },
                { src: "./styles", dest: "dist" },
                { src: "./templates", dest: "dist" },
            ],
            hook: "writeBundle",
        }),
    ],
    test: {
        // Vitest configuration options
        include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        globals: true,
        setupFiles: "./vitest.setup.js", // Path to your setup file
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json'],
        },
      },
});
