import { createRequire } from "node:module"
import { Readable } from "node:stream"
import { processSubmission } from "./form-core.js"

const require = createRequire(import.meta.url)
const Busboy = require("busboy")

export const config = {
	api: {
		bodyParser: false,
	},
}

function clientIp(req) {
	const remote = req.socket?.remoteAddress || ""
	return remote.replace(/^::ffff:/, "") || "unknown"
}

export function parseMultipart(req) {
	return new Promise((resolve, reject) => {
		let busboy
		try {
			busboy = Busboy({
				headers: req.headers,
				limits: { files: 1, fileSize: 5 * 1024 * 1024, fields: 20, fieldSize: 100 * 1024 },
			})
		} catch (error) {
			reject(error)
			return
		}
		const fields = {}
		let file = null
		busboy.on("field", (name, value) => {
			fields[name] = value
		})
		busboy.on("file", (name, stream, info) => {
			if (name !== "resume") {
				stream.resume()
				return
			}
			const chunks = []
			let tooBig = false
			stream.on("limit", () => {
				tooBig = true
			})
			stream.on("data", (chunk) => chunks.push(chunk))
			stream.on("end", () => {
				if (!info.filename) return
				file = { filename: info.filename, mime: info.mimeType, bytes: Buffer.concat(chunks), tooBig }
			})
		})
		busboy.on("error", reject)
		busboy.on("finish", () => resolve({ fields, file }))
		if (req instanceof Readable) req.pipe(busboy)
		else Readable.from(req).pipe(busboy)
	})
}

export default async function handler(req, res) {
	if (req.method === "OPTIONS") {
		res.status(204).end()
		return
	}
	if (req.method !== "POST") {
		res.status(405).json({ ok: false, message: "Send the form with POST." })
		return
	}
	const length = Number(req.headers["content-length"] || 0)
	if (length > 6 * 1024 * 1024) {
		res.status(413).json({ ok: false, message: "The CV must be 5 MB or smaller." })
		return
	}
	let parsed
	try {
		parsed = await parseMultipart(req)
	} catch {
		res.status(400).json({ ok: false, message: "The form could not be read." })
		return
	}
	const result = await processSubmission({
		fields: parsed.fields,
		file: parsed.file,
		ip: clientIp(req),
		env: process.env,
	})
	res.status(result.status).json(result.body)
}
