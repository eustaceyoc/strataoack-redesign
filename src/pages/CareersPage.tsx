import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { FormFeedback } from "../forms/FormFeedback"
import { cvError, emailPattern } from "../forms/fields"
import { formEndpoint, submitEnquiry } from "../forms/submit"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { careerValues, inbox, mailtoHref } from "../data/content"

type Errors = Partial<Record<"first_name" | "last_name" | "email" | "subject" | "message" | "work_authorized" | "resume", string>>
type Phase = "idle" | "submitting" | "success" | "error"

export function CareersPage() {
	usePageMeta(
		"Careers — STRATAOACK Mining Consultancy",
		"Explore career opportunities at STRATAOACK and join our team delivering high-quality mining and geological consulting services.",
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
		const first = String(data.get("first_name") ?? "").trim()
		const last = String(data.get("last_name") ?? "").trim()
		const email = String(data.get("email") ?? "").trim()
		const subject = String(data.get("subject") ?? "").trim()
		const message = String(data.get("message") ?? "").trim()
		const authorized = String(data.get("work_authorized") ?? "")
		const resume = form.querySelector<HTMLInputElement>("#app-resume")?.files?.[0] ?? null
		const next: Errors = {}
		if (!first) next.first_name = "First name is required"
		if (!last) next.last_name = "Last name is required"
		if (!email) next.email = "Email is required"
		else if (!emailPattern.test(email)) next.email = "Enter a valid email"
		if (!subject) next.subject = "Subject is required"
		if (message.length < 10) next.message = "Please provide more details (at least 10 characters)"
		if (authorized !== "Yes" && authorized !== "No") next.work_authorized = "Select yes or no"
		const fileProblem = cvError(resume)
		if (fileProblem) next.resume = fileProblem
		const fallback = mailtoHref(
			subject || "Speculative CV",
			[
				`First name: ${first}`,
				`Last name: ${last}`,
				`Email: ${email}`,
				`Work authorized in Ghana/West Africa: ${authorized}`,
				resume ? `Resume filename (attach the file yourself): ${resume.name}` : "Resume: not selected",
				"",
				message,
			].join("\n"),
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
			setNotice("Your note is on its way. If you attached a CV, it was included. We will write if a role matches your experience.")
			form.reset()
			return
		}
		setPhase("submitting")
		setNotice("")
		setFallbackHref(fallback)
		const result = await submitEnquiry(form, "careers")
		if (result.fields) setErrors(result.fields)
		if (result.ok) {
			setPhase("success")
			setNotice("Your note is on its way. If you attached a CV, it was included. We will write if a role matches your experience.")
			setFallbackHref("")
			form.reset()
			return
		}
		setPhase("error")
		setNotice(result.message)
	}

	return (
		<>
			<PageHero title="Careers" crumbs={[{ label: "Home", to: "/" }, { label: "Careers" }]} />
			<section className="section">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Careers</p>
						<h2 className="section-title">No current vacancies</h2>
						<p className="section-lead">
							STRATAOACK is not hiring at the moment. If you would like to be considered when a role opens, send a speculative CV and a short note about your field and where you are based.
						</p>
					</div>
					<div className="career-values">
						{careerValues.map((value) => (
							<div className="career-value" key={value}>
								{value}
							</div>
						))}
					</div>
				</div>
			</section>
			<section className="section section--surface">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Speculative CV</p>
						<h2 className="section-title">Send a CV for later</h2>
						<p className="section-lead">
							Tell us what you do and attach a CV if you have one. We will write if a suitable role opens. There is no open position to apply for today.
						</p>
					</div>
					<div className="contact-panel">
						<form method="POST" action={formEndpoint} encType="multipart/form-data" noValidate onSubmit={onSubmit} aria-busy={phase === "submitting"}>
							<input type="hidden" name="form" value="careers" />
							<input type="hidden" name="form-name" value="careers" />
							<FormFeedback phase={phase} message={notice} fallbackHref={fallbackHref} attachmentNote />
							<div className="form-row-2">
								<div>
									<label htmlFor="app-first-name">First name*</label>
									<input
										id="app-first-name"
										name="first_name"
										type="text"
										required
										aria-invalid={errors.first_name ? true : undefined}
										aria-describedby={errors.first_name ? "first-error" : undefined}
										className={errors.first_name ? "input-error" : undefined}
									/>
									{errors.first_name ? <div id="first-error" className="error-text">{errors.first_name}</div> : null}
								</div>
								<div>
									<label htmlFor="app-last-name">Last name*</label>
									<input
										id="app-last-name"
										name="last_name"
										type="text"
										required
										aria-invalid={errors.last_name ? true : undefined}
										aria-describedby={errors.last_name ? "last-error" : undefined}
										className={errors.last_name ? "input-error" : undefined}
									/>
									{errors.last_name ? <div id="last-error" className="error-text">{errors.last_name}</div> : null}
								</div>
							</div>
							<div>
								<label htmlFor="app-email">Email*</label>
								<input
									id="app-email"
									name="email"
									type="email"
									required
									aria-invalid={errors.email ? true : undefined}
									aria-describedby={errors.email ? "email-error" : undefined}
									className={errors.email ? "input-error" : undefined}
								/>
								{errors.email ? <div id="email-error" className="error-text">{errors.email}</div> : null}
							</div>
							<div>
								<label htmlFor="app-subject">Subject*</label>
								<input
									id="app-subject"
									name="subject"
									type="text"
									required
									aria-invalid={errors.subject ? true : undefined}
									aria-describedby={errors.subject ? "subject-error" : undefined}
									className={errors.subject ? "input-error" : undefined}
								/>
								{errors.subject ? <div id="subject-error" className="error-text">{errors.subject}</div> : null}
							</div>
							<div>
								<label htmlFor="app-message">Message*</label>
								<textarea
									id="app-message"
									name="message"
									required
									aria-invalid={errors.message ? true : undefined}
									aria-describedby={errors.message ? "message-error" : undefined}
									className={errors.message ? "input-error" : undefined}
								/>
								{errors.message ? <div id="message-error" className="error-text">{errors.message}</div> : null}
							</div>
							<div>
								<label id="work-authorized-label">I am currently located in Ghana/West Africa and authorized to work without sponsorship.*</label>
								<div className="career-radio-row" role="radiogroup" aria-labelledby="work-authorized-label">
									<label>
										<input type="radio" name="work_authorized" value="Yes" required /> Yes
									</label>
									<label>
										<input type="radio" name="work_authorized" value="No" required /> No
									</label>
								</div>
								{errors.work_authorized ? <div className="error-text">{errors.work_authorized}</div> : null}
							</div>
							<div>
								<label htmlFor="app-resume">Resume upload</label>
								<input
									id="app-resume"
									name="resume"
									type="file"
									accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
									aria-invalid={errors.resume ? true : undefined}
									aria-describedby={errors.resume ? "resume-error" : "resume-hint"}
								/>
								<p id="resume-hint" className="field-hint">
									PDF, DOC, or DOCX. 5 MB maximum. Optional.
								</p>
								{errors.resume ? <div id="resume-error" className="error-text">{errors.resume}</div> : null}
							</div>
							<div className="career-honeypot" aria-hidden="true">
								<label htmlFor="app-bot-field">Leave this blank</label>
								<input id="app-bot-field" name="bot_field" type="text" tabIndex={-1} autoComplete="off" />
							</div>
							<div className="form-actions">
								<button type="submit" className="btn btn-primary" disabled={phase === "submitting"}>
									{phase === "submitting" ? "Sending…" : "Submit application"}
								</button>
							</div>
						</form>
						<div className="career-privacy-note">
							<Link className="link" to="/privacy">
								Privacy policy
							</Link>
							<p>
								This form sends your note, and the CV if you attached one, to {inbox.join(" and ")}. Nothing is stored on the website. If sending fails, the email link cannot attach the CV for you.
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
