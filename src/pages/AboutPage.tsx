import { Link } from "react-router-dom"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { aboutPillars } from "../data/content"
import { primaryServices, servicePath } from "../data/services"

export function AboutPage() {
	usePageMeta(
		"About — STRATAOACK Mining Consultancy",
		"Learn about STRATAOACK, our mission, values, and technical approach to responsible mineral development.",
	)

	return (
		<>
			<PageHero title="About STRATAOACK" crumbs={[{ label: "Home", to: "/" }, { label: "About" }]} />
			<section className="section">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Who we are</p>
						<h2 className="section-title">A multi-disciplinary consultancy built for project decisions</h2>
						<p className="section-lead">
							STRATAOACK is a Ghana-based geological and mining consultancy supporting exploration teams, operators, investors, and public-sector institutions with clear technical guidance and practical execution.
						</p>
					</div>
					<div className="grid cards-3 mt-sm">
						{aboutPillars.map((pillar) => (
							<article className="card" key={pillar.title}>
								<h3>{pillar.title}</h3>
								<p>{pillar.text}</p>
							</article>
						))}
					</div>
				</div>
			</section>
			<section className="section section--surface">
				<div className="container team-hero">
					<div className="team-hero__image about-team-hero-image" role="img" aria-label="Mining operation in Ghana" />
					<div>
						<p className="section-eyebrow">What makes us different</p>
						<h2 className="section-title">Technical depth with practical project delivery</h2>
						<p className="section-lead">
							We combine fieldwork, interpretation, engineering input, and economic thinking into one coherent workflow. Clients work with one accountable team from initial scoping through final reporting.
						</p>
						<ul className="checklist">
							<li>Integrated geology, hydrogeology, geotechnics, and geophysics</li>
							<li>Clear communication for management, boards, and financiers</li>
							<li>Flexible support from short studies to multi-phase programs</li>
						</ul>
					</div>
				</div>
			</section>
			<section className="section section--surface" id="what-we-do">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">What we do</p>
						<h2 className="section-title">Technical services across exploration, studies, and reporting</h2>
						<p className="section-lead">Our services are designed to reduce uncertainty and improve the quality of technical and commercial decisions.</p>
					</div>
					<div className="grid cards-3">
						{primaryServices.map((service) => (
							<article className="card" key={service.slug}>
								<h3>
									<Link className="link" to={servicePath(service.slug)}>
										{service.listTitle ?? service.title}
									</Link>
								</h3>
								<p>{service.aboutSummary ?? service.summary}</p>
							</article>
						))}
					</div>
				</div>
			</section>
			<section className="section">
				<div className="container">
					<div className="cta-banner">
						<h2>Need a coordinated technical team for your next project phase?</h2>
						<p>Whether you need exploration strategy, due diligence, or reporting support, we can build a scope that fits your timeline and decision objectives.</p>
						<div className="cta-inline">
							<Link className="btn btn-primary" to="/contact">
								Speak with our team
							</Link>
							<Link className="btn btn-ghost" to="/team">
								Meet the Team
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
