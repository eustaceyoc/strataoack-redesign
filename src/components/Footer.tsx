import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { inbox, office, socialLinks } from "../data/content"

const explore = [
	{ label: "About Us", to: "/about" },
	{ label: "Meet the Team", to: "/team" },
	{ label: "Careers", to: "/careers" },
	{ label: "Clients & Projects", to: "/clients" },
	{ label: "Gallery", to: "/gallery" },
	{ label: "Contact Us", to: "/contact" },
	{ label: "Privacy", to: "/privacy" },
]

const footerServices = [
	{ to: "/services/mineral-exploration", label: "Exploration & resources" },
	{ to: "/services/feasibility-due-diligence", label: "Feasibility & due diligence" },
	{ to: "/services/environmental-studies", label: "Environmental studies" },
	{ to: "/services/geotechnical", label: "Geotechnical" },
]

function SocialIcon({ icon }: { icon: string }) {
	if (icon === "linkedin") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.26-.02-2.88-1.76-2.88-1.76 0-2.03 1.37-2.03 2.78V21H9z" />
			</svg>
		)
	}
	if (icon === "x") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
			</svg>
		)
	}
	if (icon === "instagram") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5zM18 6.2a1.2 1.2 0 1 1-1.2 1.2A1.2 1.2 0 0 1 18 6.2z" />
			</svg>
		)
	}
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M13.5 22v-8h2.7l.4-3H13.5V9.2c0-.9.25-1.5 1.55-1.5H17V5.1c-.27-.04-1.2-.11-2.28-.11-2.25 0-3.77 1.37-3.77 3.9V11H8v3h3v8h2.5z" />
		</svg>
	)
}

const copyrightYear = new Date().getFullYear()

export function Footer() {
	const year = copyrightYear
	const [showTop, setShowTop] = useState(false)

	useEffect(() => {
		const onScroll = () => setShowTop(window.scrollY > 320)
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])
	return (
		<>
			<footer className="site-footer">
				<div className="container footer-grid">
					<div className="footer-brand">
						<Link className="footer-logo" to="/">
							<img src="/assets/img/strataoacklogof.png" alt="STRATAOACK" width={216} height={156} />
						</Link>
						<p className="footer-tagline">
							Geological engineering and mining consultancy—rigorous science, responsible development, and bankable outcomes.
						</p>
					</div>
					<div className="footer-col">
						<h2 className="footer-heading">Explore</h2>
						<ul className="footer-links">
							{explore.map((item) => (
								<li key={item.to}>
									<Link to={item.to}>{item.label}</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="footer-col">
						<h2 className="footer-heading">Services</h2>
						<ul className="footer-links">
							{footerServices.map((item) => (
								<li key={item.to}>
									<Link to={item.to}>{item.label}</Link>
								</li>
							))}
							<li>
								<Link to="/services">All services</Link>
							</li>
						</ul>
					</div>
					<div className="footer-col footer-col--contact">
						<h2 className="footer-heading">{office.name}</h2>
						<p className="footer-contact">
							{office.lines[0]}
							<br />
							{office.lines[1]}
						</p>
						<p className="footer-contact">
							<a href={office.phoneHref}>{office.phoneDisplay}</a>
							<br />
							{inbox.map((email) => (
								<span key={email}>
									<a href={`mailto:${email}`}>{email}</a>
									<br />
								</span>
							))}
						</p>
						<p className="footer-hours">{office.hours}</p>
					</div>
				</div>
				<div className="footer-bottom">
					<div className="container footer-bottom__inner">
						<p className="footer-copy">© {year} STRATAOACK Geological Consultancy. All rights reserved.</p>
						<div>
							<ul className="social-links" aria-label="Social media">
								{socialLinks.map((item) => (
									<li key={item.icon}>
										<a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
											<SocialIcon icon={item.icon} />
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</footer>
			<button
				type="button"
				className={`back-to-top${showTop ? " is-visible" : ""}`}
				aria-label="Back to top"
				onClick={() =>
					window.scrollTo({
						top: 0,
						behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
					})
				}
			>
				↑
			</button>
		</>
	)
}
