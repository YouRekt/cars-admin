import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		cors: true,
		proxy: {
			"/login": {
				target: "http://localhost:8080/administrator",
				changeOrigin: true,
			},
			"/register": {
				target: "http://localhost:8080/administrator",
				changeOrigin: true,
			},
			"/username/*": {
				target: "http://localhost:8080/administrator",
				changeOrigin: true,
			},
		},
	},
});
