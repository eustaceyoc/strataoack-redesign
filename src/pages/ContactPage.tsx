import { useState, type FormEvent } from "react"
import { FormFeedback } from "../forms/FormFeedback"
import { emailPattern } from "../forms/fields"
import { formEndpoint, submitEnquiry } from "../forms/submit"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { inbox, mailtoHref, office } from "../data/content"

type Errors = Partial<Record<"name" | "email" | "message", string>>
type Phase = "idle" | "submitting" | "success" | "error"

export function ContactPage() {
	usePageMeta(
		"Contact — STRATAOACK Mining Consultancy",
		"Contact STRATAOACK for project inquiries, proposal requests, and partnership opportunities.",
	)
	const [errors, setErrors] = useState<Errors>({})
	const [phase, setPhase] = useState<Phase>("idle")
	const [notice, setNotice] = useState("")
	const [fallbackHref, setFallbackHref] = useState("")

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (phase === "submitting") return
		const form = event.currentTarget
		const data = new FormData(form)
		const name = String(data.get("name") ?? "").trim()
		const email = String(data.get("email") ?? "").trim()
		const company = String(data.get("company") ?? "").trim()
		const subject = String(data.get("subject") ?? "").trim()
		const message = String(data.get("message") ?? "").trim()
		const next: Errors = {}
		if (!name) next.name = "Your name is required"
		if (!email) next.email = "Email is required"
		else if (!emailPattern.test(email)) next.email = "Enter a valid email"
		if (message.length < 10) next.message = "Please provide more details (at least 10 characters)"
		const fallback = mailtoHref(
			subject || "Project inquiry from STRATAOACK website",
			[`Name: ${name}`, `Email: ${email}`, `Company: ${company}`, "", "Message:", message].join("\n"),
		)
		setErrors(next)
		if (Object.keys(next).length > 0) {
			setPhase("error")
			setNotice("Check the highlighted fields and try again.")
			setFallbackHref("")
			return
		}
		if (String(data.get("bot_field") ?? "").trim()) {
			setPhase("success")
			setNotice("Your message is on its way. We will reply to the email address you entered.")
			form.reset()
			return
		}
		setPhase("submitting")
		setNotice("")
		setFallbackHref(fallback)
		const result = await submitEnquiry(form, "contact")
		if (result.fields) {
			setErrors({
				name: result.fields.name,
				email: result.fields.email,
				message: result.fields.message,
			})
		}
		if (result.ok) {
			setPhase("success")
			setNotice("Your message is on its way. We will reply to the email address you entered.")
			setFallbackHref("")
			form.reset()
			return
		}
		setPhase("error")
		setNotice(result.message)
	}

	return (
		<>
			<PageHero title="Contact Us" crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
			<section className="section">
				<div className="container">
					<div className="map-embed">
						<iframe title={office.mapTitle} width="100%" height="100%" loading="lazy" allowFullScreen src={office.mapSrc} />
					</div>
					<div className="contact-grid">
						<div className="contact-panel">
							<h2>Project inquiry</h2>
							<p>Share your project goals, scope, and timeline. We will respond with practical next steps and a suitable support model.</p>
							<form method="POST" action={formEndpoint} encType="multipart/form-data" noValidate onSubmit={onSubmit} aria-busy={phase === "submitting"}>
								<input type="hidden" name="form" value="contact" />
								<input type="hidden" name="form-name" value="contact" />
								<FormFeedback phase={phase} message={notice} fallbackHref={fallbackHref} />
								<div>
									<label htmlFor="name">Your Name</label>
									<input
										type="text"
										id="name"
										name="name"
										placeholder="Jane Doe"
										required
										autoComplete="name"
										aria-invalid={errors.name ? true : undefined}
										aria-describedby={errors.name ? "name-error" : undefined}
										className={errors.name ? "input-error" : undefined}
										onChange={() => setErrors((current) => ({ ...current, name: undefined }))}
									/>
									{errors.name ? <div id="name-error" className="error-text">{errors.name}</div> : null}
								</div>
								<div className="form-row-2">
									<div>
										<label htmlFor="email">Email</label>
										<input
											type="email"
											id="email"
											name="email"
											placeholder="you@example.com"
											required
											autoComplete="email"
											aria-invalid={errors.email ? true : undefined}
											aria-describedby={errors.email ? "email-error" : undefined}
											className={errors.email ? "input-error" : undefined}
											onChange={() => setErrors((current) => ({ ...current, email: undefined }))}
										/>
										{errors.email ? <div id="email-error" className="error-text">{errors.email}</div> : null}
									</div>
									<div>
										<label htmlFor="company">Company</label>
										<input type="text" id="company" name="company" placeholder="Company" autoComplete="organization" />
									</div>
								</div>
								<div>
									<label htmlFor="subject">Subject</label>
									<input type="text" id="subject" name="subject" placeholder="Feasibility study support" autoComplete="off" />
								</div>
								<div>
									<label htmlFor="message">Message</label>
									<textarea
										id="message"
										name="message"
										placeholder="Project context, objectives, timeline..."
										required
										aria-invalid={errors.message ? true : undefined}
										aria-describedby={errors.message ? "message-error" : undefined}
										className={errors.message ? "input-error" : undefined}
										onChange={() => setErrors((current) => ({ ...current, message: undefined }))}
									/>
									{errors.message ? <div id="message-error" className="error-text">{errors.message}</div> : null}
								</div>
								<div className="career-honeypot" aria-hidden="true">
									<label htmlFor="bot-field">Leave this blank</label>
									<input id="bot-field" name="bot_field" type="text" tabIndex={-1} autoComplete="off" />
								</div>
								<div className="form-actions">
									<button type="submit" className="btn btn-primary" disabled={phase === "submitting"}>
										{phase === "submitting" ? "Sending…" : "Send message"}
									</button>
									<a className="btn btn-secondary" href={`mailto:${inbox.join(",")}`}>
										Email us directly
									</a>
								</div>
							</form>
						</div>
						<div className="contact-panel">
							<h2>Contact information</h2>
							<dl className="contact-facts">
								<div>
									<dt>Office</dt>
									<dd>{office.addressLine}</dd>
								</div>
								<div>
									<dt>Phone</dt>
									<dd>
										<a href={office.phoneHref}>{office.phoneDisplay}</a>
									</dd>
								</div>
								<div>
									<dt>Email</dt>
									<dd>
										{inbox.map((email) => (
											<span key={email}>
												<a href={`mailto:${email}`}>{email}</a>
												<br />
											</span>
										))}
									</dd>
								</div>
								<div>
									<dt>Working time</dt>
									<dd>{office.hoursLong}</dd>
								</div>
							</dl>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
