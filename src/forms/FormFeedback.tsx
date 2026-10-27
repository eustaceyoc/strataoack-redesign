type Phase = "idle" | "submitting" | "success" | "error"

export function FormFeedback({
	phase,
	message,
	fallbackHref,
	attachmentNote,
}: {
	phase: Phase
	message: string
	fallbackHref?: string
	attachmentNote?: boolean
}) {
	if (phase === "submitting") {
		return (
			<p className="form-status" role="status">
				Sending your message…
			</p>
		)
	}
	if (phase === "success") {
		return (
			<p className="form-status form-status--success" role="status">
				{message}
			</p>
		)
	}
	if (phase === "error" && message) {
		return (
			<p className="form-status form-status--error" role="alert">
				{message}{" "}
				{fallbackHref ? <a href={fallbackHref}>Email this message instead</a> : null}
				{attachmentNote && fallbackHref
					? " The email link does not attach a CV. Add the file in your mail app if you use that link."
					: null}
			</p>
		)
	}
	return null
}
