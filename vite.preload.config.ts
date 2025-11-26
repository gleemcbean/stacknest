import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	build: {
		outDir: ".vite/build",
		lib: {
			entry: "src/preload.ts",
			formats: ["cjs"],
			fileName: () => "preload.js",
		},
		rollupOptions: {
			output: {
				inlineDynamicImports: true,
			},
		},
		target: "node16",
		minify: true,
	},
});
