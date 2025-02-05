/* eslint-disable @typescript-eslint/no-unused-vars */
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
			// Target is your backend API
			"/api": {
				target: "https://carscorp-dhavgthqcfbbckc2.polandcentral-01.azurewebsites.net",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),

				configure: (proxy, _options) => {
					proxy.on("error", (err, _req, _res) => {
						console.log("error", err);
					});
					proxy.on("proxyReq", (_proxyReq, req, _res) => {
						console.log(
							"Request sent to target:",
							req.method,
							req.url
						);
					});
					proxy.on("proxyRes", (proxyRes, req, _res) => {
						console.log(
							"Response received from target:",
							proxyRes.statusCode,
							req.url
						);
					});
				},
			},
		},
	},
});
