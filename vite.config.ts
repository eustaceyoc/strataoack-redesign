import { copyFileSync } from "node:fs"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"

function spa404(): Plugin {
	return {
		name: "spa-404",
		apply: "build",
		closeBundle() {
			copyFileSync("dist/index.html", "dist/404.html")
		},
	}
}

function netlifyDetectionForms(include: boolean): Plugin {
	return {
		name: "netlify-detection-forms",
		transformIndexHtml(html) {
			if (include) return html
			return html.replace(/^\t\t<form\b[^>]*\bdata-netlify="true"[\s\S]*?<\/form>\n/gm, "")
		},
	}
}

export default defineConfig(({ mode }) => {
	const fileEnv = loadEnv(mode, process.cwd(), "")
	const provider = (process.env.VITE_FORM_PROVIDER || fileEnv.VITE_FORM_PROVIDER || "").trim().toLowerCase()
	return {
		plugins: [react(), netlifyDetectionForms(provider === "netlify"), spa404()],
		server: {
			host: "127.0.0.1",
			port: 8742,
			strictPort: true,
			proxy: {
				"/api/contact.php": {
					target: "http://127.0.0.1:8755",
					changeOrigin: true,
				},
			},
		},
		preview: {
			host: "127.0.0.1",
			port: 8743,
		},
	}
})
