export type FormKind = "contact" | "careers"
export type FormProvider = "php" | "netlify" | "vercel"

const providers = ["php", "netlify", "vercel"] as const

export function resolveFormTarget(provider: string | undefined, endpoint: string | undefined) {
	const name = (provider || "php").trim().toLowerCase()
	const picked = providers.includes(name as FormProvider) ? (name as FormProvider) : "php"
	const defaults: Record<FormProvider, string> = {
		php: "/api/contact.php",
		netlify: "/",
		vercel: "/api/contact",
	}
	const override = endpoint?.trim()
	return { provider: picked, endpoint: override || defaults[picked] }
}

const target = resolveFormTarget(import.meta.env.VITE_FORM_PROVIDER, import.meta.env.VITE_FORM_ENDPOINT)

export const formProvider = target.provider
export const formEndpoint = target.endpoint

export type SubmitResult = {
	ok: boolean
	message: string
	fields?: Record<string, string>
}

export async function submitEnquiry(form: HTMLFormElement, kind: FormKind): Promise<SubmitResult> {
	const data = new FormData(form)
	data.set("form", kind)
	if (formProvider === "netlify") {
		data.set("form-name", kind)
		const file = data.get("resume")
		if (file instanceof File && file.size === 0) data.delete("resume")
	}
	let response: Response
	try {
		response = await fetch(formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
	} catch {
		return { ok: false, message: "The form could not be reached. Email this message instead." }
	}
	if (formProvider === "netlify") {
		if (response.ok) return { ok: true, message: "" }
		return { ok: false, message: "The form was not accepted. Email this message instead." }
	}
	let payload: { ok?: boolean; message?: string; fields?: Record<string, string> } = {}
	try {
		payload = (await response.json()) as typeof payload
	} catch {
		payload = {}
	}
	if (response.ok && payload.ok) return { ok: true, message: "" }
	return {
		ok: false,
		message: payload.message || "The message was not sent. Email this message instead.",
		fields: payload.fields,
	}
}
