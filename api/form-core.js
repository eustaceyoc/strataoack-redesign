const MAX_CV = 5 * 1024 * 1024
const DEFAULT_TO = ["strataoack@gmail.com", "eustaceocrentsil@gmail.com"]
const hits = new Map()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function resetRateLimit() {
	hits.clear()
}

function textLength(value) {
	return Array.from(value).length
}

function cleanLine(value, max) {
	const cleaned = String(value ?? "")
		.replace(/[\r\n\0]/g, " ")
		.trim()
	return Array.from(cleaned).slice(0, max).join("")
}

function cleanText(value, max) {
	const cleaned = String(value ?? "")
		.replace(/\r\n/g, "\n")
		.replace(/[\r\0]/g, "\n")
		.trim()
	return Array.from(cleaned).slice(0, max).join("")
}

function emailOk(value) {
	return typeof value === "string" && value.length <= 200 && !/[\r\n]/.test(value) && emailPattern.test(value)
}

function extensionOf(filename) {
	const parts = filename.toLowerCase().split(".")
	return parts.length > 1 ? parts[parts.length - 1] : ""
}

function safeFilename(name) {
	const base = String(name ?? "")
		.replace(/[\0\\]/g, "")
		.split(/[/\\]/)
		.pop()
	const cleaned = base.replace(/[^A-Za-z0-9._-]/g, "_").replace(/^[._]+|[._]+$/g, "")
	const trimmed = (cleaned || "cv").slice(-80)
	return trimmed
}

function magicOk(ext, bytes) {
	if (ext === "pdf") return bytes.subarray(0, 4).toString("utf8") === "%PDF"
	if (ext === "doc") return bytes.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0]))
	if (ext === "docx") return bytes.subarray(0, 4).toString("utf8") === "PK\u0003\u0004"
	return false
}

function mimeFor(ext) {
	if (ext === "pdf") return "application/pdf"
	if (ext === "doc") return "application/msword"
	return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

function inspectResume(file) {
	if (!file || !file.filename) return { ok: true, file: null }
	if (file.tooBig || file.bytes.length > MAX_CV) {
		return {
			ok: false,
			status: 413,
			body: { ok: false, message: "The CV must be 5 MB or smaller.", fields: { resume: "The CV must be 5 MB or smaller" } },
		}
	}
	const filename = safeFilename(file.filename)
	const ext = extensionOf(filename)
	if (!["pdf", "doc", "docx"].includes(ext) || !magicOk(ext, file.bytes)) {
		return {
			ok: false,
			status: 400,
			body: {
				ok: false,
				message: "Attach a PDF, DOC, or DOCX file.",
				fields: { resume: "Attach a PDF, DOC, or DOCX file" },
			},
		}
	}
	return { ok: true, file: { filename, mime: mimeFor(ext), bytes: file.bytes } }
}

export function validateSubmission(fields, file) {
	const form = fields.form
	if (form !== "contact" && form !== "careers") {
		return { ok: false, status: 400, body: { ok: false, message: "This form is not recognised." } }
	}
	const email = String(fields.email ?? "").trim()
	const subject = cleanLine(fields.subject, 200)
	const message = cleanText(fields.message, 5000)
	const errors = {}
	if (!emailOk(email)) errors.email = email === "" ? "Email is required" : "Enter a valid email"
	if (textLength(message) < 10) errors.message = "Please provide more details (at least 10 characters)"
	const value = { form, email, subject, message, file: null }
	if (form === "contact") {
		const name = cleanLine(fields.name, 120)
		if (!name) errors.name = "Your name is required"
		value.name = name
		value.company = cleanLine(fields.company, 200)
		if (!value.subject) value.subject = "Project inquiry from STRATAOACK website"
	} else {
		const first = cleanLine(fields.first_name, 120)
		const last = cleanLine(fields.last_name, 120)
		const authorized = String(fields.work_authorized ?? "")
		if (!first) errors.first_name = "First name is required"
		if (!last) errors.last_name = "Last name is required"
		if (!subject) errors.subject = "Subject is required"
		if (authorized !== "Yes" && authorized !== "No") errors.work_authorized = "Select yes or no"
		value.first_name = first
		value.last_name = last
		value.work_authorized = authorized
		const resume = inspectResume(file)
		if (!resume.ok) return resume
		value.file = resume.file
	}
	if (Object.keys(errors).length > 0) {
		return { ok: false, status: 400, body: { ok: false, message: "Check the highlighted fields and try again.", fields: errors } }
	}
	return { ok: true, value }
}

function allowRate(ip) {
	const now = Date.now()
	const windowMs = 60 * 60 * 1000
	const key = ip || "unknown"
	const fresh = (hits.get(key) || []).filter((stamp) => now - stamp < windowMs)
	if (fresh.length >= 5) {
		hits.set(key, fresh)
		return false
	}
	fresh.push(now)
	hits.set(key, fresh)
	return true
}

export function messageText(value) {
	const lines = ["A message was sent from the STRATAOACK website.", ""]
	if (value.form === "contact") {
		lines.push("Form: Project inquiry", `Name: ${value.name}`, `Email: ${value.email}`, `Company: ${value.company || "(not given)"}`)
	} else {
		lines.push(
			"Form: Speculative CV",
			`Name: ${value.first_name} ${value.last_name}`,
			`Email: ${value.email}`,
			`Work authorized in Ghana/West Africa: ${value.work_authorized}`,
			`CV: ${value.file ? value.file.filename : "not attached"}`,
		)
	}
	lines.push(`Subject: ${value.subject}`, "", value.message)
	return lines.join("\n")
}

function recipients(env) {
	const raw = String(env.FORM_TO || "")
		.split(",")
		.map((item) => item.trim())
		.filter(emailOk)
	return raw.length > 0 ? raw : DEFAULT_TO
}

export function buildEmail(value, env) {
	return {
		to: recipients(env),
		replyTo: value.email,
		subject: `[STRATAOACK] ${value.subject}`,
		text: messageText(value),
		file: value.file,
	}
}

function fromOk(value) {
	if (emailOk(value)) return true
	const match = String(value).match(/<([^>]+)>\s*$/)
	return Boolean(match && emailOk(match[1]))
}

async function sendResend(email, env, fetchImpl) {
	const from = String(env.RESEND_FROM || "").trim()
	if (!fromOk(from)) {
		throw new Error("RESEND_FROM is missing")
	}
	const payload = {
		from,
		to: email.to,
		reply_to: email.replyTo,
		subject: email.subject,
		text: email.text,
	}
	if (email.file) {
		payload.attachments = [{ filename: email.file.filename, content: email.file.bytes.toString("base64") }]
	}
	const response = await fetchImpl("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})
	if (!response.ok) {
		throw new Error(`Resend returned ${response.status}`)
	}
}

function smtpRead(socket) {
	return new Promise((resolve, reject) => {
		let data = ""
		const onData = (chunk) => {
			data += chunk.toString("utf8")
			const lines = data.split(/\r?\n/)
			const complete = lines.slice(0, -1).find((line) => line.length >= 4 && line[3] === " ")
			if (complete) {
				socket.off("data", onData)
				resolve(data)
			}
		}
		socket.on("data", onData)
		socket.once("error", reject)
	})
}

function smtpExpect(socket, codes) {
	return smtpRead(socket).then((data) => {
		const code = Number(data.slice(0, 3))
		if (!codes.includes(code)) throw new Error(`SMTP ${code}`)
		return data
	})
}

async function smtpCmd(socket, command, codes) {
	socket.write(`${command}\r\n`)
	return smtpExpect(socket, codes)
}

function composeBody(email) {
	if (!email.file) return { contentType: "Content-Type: text/plain; charset=UTF-8", body: email.text }
	const boundary = `strata_${Math.random().toString(16).slice(2)}`
	const encoded = email.file.bytes.toString("base64").replace(/(.{76})/g, "$1\r\n")
	const body = [
		`--${boundary}`,
		"Content-Type: text/plain; charset=UTF-8",
		"",
		email.text,
		`--${boundary}`,
		`Content-Type: ${email.file.mime}; name="${email.file.filename}"`,
		"Content-Transfer-Encoding: base64",
		`Content-Disposition: attachment; filename="${email.file.filename}"`,
		"",
		encoded,
		`--${boundary}--`,
	].join("\r\n")
	return { contentType: `Content-Type: multipart/mixed; boundary="${boundary}"`, body }
}

async function sendSmtp(email, env) {
	const net = await import("node:net")
	const tls = await import("node:tls")
	const host = String(env.SMTP_HOST || "").trim()
	const port = Number(env.SMTP_PORT || 587)
	const encryption = String(env.SMTP_ENCRYPTION || "tls").toLowerCase()
	const username = String(env.SMTP_USER || "")
	const password = String(env.SMTP_PASS || "")
	const from = String(env.SMTP_FROM || "").trim()
	if (!host || !username || !password || !emailOk(from)) {
		throw new Error("SMTP is not configured")
	}
	const opened = await new Promise((resolve, reject) => {
		const socket =
			encryption === "ssl"
				? tls.connect({ host, port, servername: host })
				: net.connect({ host, port })
		const onReady = () => {
			socket.off("error", reject)
			resolve(socket)
		}
		socket.once("error", reject)
		socket.once(encryption === "ssl" ? "secureConnect" : "connect", onReady)
	})
	let socket = opened
	await smtpExpect(socket, [220])
	await smtpCmd(socket, "EHLO strataoack.local", [250])
	if (encryption === "tls") {
		await smtpCmd(socket, "STARTTLS", [220])
		socket = await new Promise((resolve, reject) => {
			const secure = tls.connect({ socket, servername: host }, () => resolve(secure))
			secure.once("error", reject)
		})
		await smtpCmd(socket, "EHLO strataoack.local", [250])
	}
	await smtpCmd(socket, "AUTH LOGIN", [334])
	await smtpCmd(socket, Buffer.from(username).toString("base64"), [334])
	await smtpCmd(socket, Buffer.from(password).toString("base64"), [235])
	await smtpCmd(socket, `MAIL FROM:<${from}>`, [250])
	for (const rcpt of email.to) {
		await smtpCmd(socket, `RCPT TO:<${rcpt}>`, [250, 251])
	}
	await smtpCmd(socket, "DATA", [354])
	const composed = composeBody(email)
	const headers = [
		`From: STRATAOACK website <${from}>`,
		`To: ${email.to.join(", ")}`,
		`Reply-To: ${email.replyTo}`,
		`Subject: ${email.subject}`,
		"MIME-Version: 1.0",
		composed.contentType,
		"",
		composed.body,
	]
	const dotted = headers
		.join("\r\n")
		.split("\r\n")
		.map((line) => (line.startsWith(".") ? `.${line}` : line))
		.join("\r\n")
	socket.write(`${dotted}\r\n.\r\n`)
	await smtpExpect(socket, [250])
	socket.write("QUIT\r\n")
	socket.end()
}

export async function sendEmail(email, env, fetchImpl = globalThis.fetch) {
	if (env.RESEND_API_KEY) {
		await sendResend(email, env, fetchImpl)
		return
	}
	if (env.SMTP_HOST) {
		await sendSmtp(email, env)
		return
	}
	const error = new Error("Email is not configured")
	error.publicMessage = "The office mailbox is not configured yet. Email this message instead."
	throw error
}

export async function processSubmission({ fields, file, ip, env, deliver, fetchImpl }) {
	const validated = validateSubmission(fields, file)
	if (!validated.ok) return { status: validated.status, body: validated.body }
	if (!allowRate(ip)) {
		return {
			status: 429,
			body: { ok: false, message: "Too many messages from this network. Please wait an hour, or email this message instead." },
		}
	}
	if (String(fields.bot_field || "").trim()) return { status: 200, body: { ok: true } }
	const email = buildEmail(validated.value, env)
	try {
		if (deliver) await deliver(email)
		else await sendEmail(email, env, fetchImpl)
	} catch (error) {
		console.error("STRATAOACK form:", error instanceof Error ? error.message : error)
		const message = error && error.publicMessage ? error.publicMessage : "The message could not be emailed. Email this message instead."
		return { status: 500, body: { ok: false, message } }
	}
	return { status: 200, body: { ok: true } }
}
