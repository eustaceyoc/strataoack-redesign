import { Link } from "react-router-dom"
import { LogoCarousel } from "../components/LogoCarousel"
import { Reveal } from "../components/Reveal"
import { usePageMeta } from "../components/usePageMeta"
import { commitments, inbox, quickLinks, stats } from "../data/content"
import { featuredServices, servicePath } from "../data/services"

export function HomePage() {
	usePageMeta(
		"STRATAOACK Mining Consultancy — Home",
		"STRATAOACK provides exploration, mine studies, due diligence, and technical reporting for responsible mineral development.",
	)

	return (
		<>
			<section className="banner-hero" aria-label="Introduction">
				<div className="hero-media home-hero-media">
					<div className="overlay" />
					<div className="hero-content">
						<div>
							<p className="hero-kicker">Exploration and mining consulting services</p>
							<h1>We solve the technical challenges of mining projects</h1>
							<p>
								STRATAOACK partners with operators, investors, and institutions to move mineral assets from early exploration through feasibility and decision-ready reporting.
							</p>
							<div className="hero-actions">
								<Link className="btn btn-primary" to="/contact">
									Request a consultation
								</Link>
								<Link className="btn btn-ghost" to="/about#what-we-do">
									Explore services
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="quick-band">
				<div className="container">
					<nav className="quick-links" aria-label="Quick navigation">
						{quickLinks.map((link) => (
							<Link className="quick-link" to={link.to} key={link.title}>
								<span className="quick-link__label">{link.label}</span>
								<span className="quick-link__title">{link.title}</span>
							</Link>
						))}
					</nav>
				</div>
			</div>

			<div className="trust-strip">
				<div className="container">
					<strong>STRATAOACK</strong> helps clients reduce uncertainty and make stronger technical and investment decisions.
				</div>
			</div>

			<Reveal aria-labelledby="services-heading">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Our services</p>
						<h2 className="section-title" id="services-heading">
							Integrated support for exploration, studies, and reporting
						</h2>
						<p className="section-lead">
							We combine modern tools, practical field execution, and disciplined analysis to keep projects moving from data collection to investment-ready outputs.
						</p>
					</div>
					<div className="grid-services">
						{featuredServices.map((service) => (
							<Link className="service-card" to={servicePath(service.slug)} key={service.slug}>
								<span className="service-card__media">
									<img src={service.image} alt="" width={800} height={600} />
								</span>
								<span className="service-card__body">
									{service.slug === "mineral-exploration" ? <span className="pill">Flagship</span> : null}
									<span className="service-card__title">{service.homeTitle}</span>
									<span className="service-card__text">{service.homeSummary}</span>
									<span className="service-card__more">View service →</span>
								</span>
							</Link>
						))}
					</div>
					<div className="section-cta-row">
						<Link className="btn btn-secondary" to="/about#what-we-do">
							View full service list
						</Link>
						<Link className="link" to="/clients">
							See clients & projects →
						</Link>
					</div>
				</div>
			</Reveal>

			<Reveal className="section--surface" aria-labelledby="why-heading">
				<div className="container split">
					<div
						className="split__visual home-split-visual"
						role="img"
						aria-label="Geologist in high-visibility clothing examining a drill core sample"
					/>
					<div className="split__body">
						<p className="section-eyebrow">Introducing STRATAOACK</p>
						<h2 className="section-title" id="why-heading">
							Qualified. Experienced. Accountable.
						</h2>
						<p className="section-lead">
							Our team of geologists, engineers, hydrogeologists, and analysts provides clear technical direction that helps clients unlock the value of mineral resource projects.
						</p>
						<ul className="checklist">
							<li>Growth: we build practical pathways from concept to production.</li>
							<li>Teamwork: integrated specialists, one coordinated delivery model.</li>
							<li>Integrity: transparent assumptions and defensible outcomes.</li>
						</ul>
						<div className="section-cta-row">
							<Link className="btn btn-primary" to="/about">
								Learn more about us
							</Link>
						</div>
					</div>
				</div>
			</Reveal>

			<Reveal aria-labelledby="pillars-heading">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Project impact</p>
						<h2 className="section-title" id="pillars-heading">
							Built for operators, investors, and institutions
						</h2>
					</div>
					<div className="stats-row">
						{stats.map((stat) => (
							<div className="stat-card" key={stat.label}>
								<p className="stat-card__value">{stat.value}</p>
								<p className="stat-card__label">{stat.label}</p>
							</div>
						))}
					</div>
				</div>
			</Reveal>

			<Reveal className="section--surface" id="commitments" aria-labelledby="commitments-heading">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">How we work</p>
						<h2 className="section-title" id="commitments-heading">
							Our commitments
						</h2>
						<p className="section-lead">Three standards we hold on every assignment, from the sample through the report.</p>
					</div>
					<div className="commitments__grid">
						{commitments.map((item) => (
							<article className="commitment" key={item.title}>
								<h3>{item.title}</h3>
								<p>{item.text}</p>
							</article>
						))}
					</div>
				</div>
			</Reveal>

			<Reveal className="section--dark" aria-labelledby="partner-heading">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Partner with us</p>
						<h2 className="section-title" id="partner-heading">
							Ready for your next study, review, or field program?
						</h2>
						<p className="section-lead">
							Share your project goals and timeline. We will propose a focused scope, practical workplan, and the right specialists for your commodity and jurisdiction.
						</p>
					</div>
					<div className="hero-actions">
						<Link className="btn btn-primary" to="/contact">
							Start a conversation
						</Link>
						{inbox.map((email) => (
							<a className="btn btn-ghost" href={`mailto:${email}`} key={email}>
								{email}
							</a>
						))}
					</div>
				</div>
			</Reveal>

			<Reveal aria-labelledby="clients-heading">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Trusted relationships</p>
						<h2 className="section-title" id="clients-heading">
							Organisations we support
						</h2>
						<p className="section-lead">A sample of organisations we have supported through technical advisory and project services.</p>
					</div>
					<LogoCarousel />
				</div>
			</Reveal>

			<Reveal className="section--tight" aria-label="Consultation call to action">
				<div className="container">
					<div className="cta-banner">
						<h2>Need technical due diligence or a feasibility update?</h2>
						<p>Tell us about your asset, data package, and decision timeline—we will respond with a clear scope and indicative schedule.</p>
						<div className="cta-inline">
							<Link className="btn btn-primary" to="/contact">
								Request a consultation
							</Link>
							<Link className="btn btn-ghost" to="/services">
								Review services
							</Link>
						</div>
					</div>
				</div>
			</Reveal>
		</>
	)
}
