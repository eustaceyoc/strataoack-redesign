import { Link } from "react-router-dom"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { primaryServices, relatedServices, servicePath } from "../data/services"

export function ServicesPage() {
	usePageMeta(
		"Services — STRATAOACK Mining Consultancy",
		"Mining consulting services: geology, mine planning, processing, ESG, and operations.",
	)

	return (
		<>
			<PageHero title="Our Services" crumbs={[{ label: "Home", to: "/" }, { label: "Services" }]} />
			<section className="section">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Capabilities</p>
						<h2 className="section-title">Technical services across exploration, studies, and reporting</h2>
						<p className="section-lead">Select a line item for scope and typical deliverables.</p>
					</div>
					<div className="grid cards-3">
						{primaryServices.map((service) => (
							<article className="card" key={service.slug}>
								<h3>
									<Link className="link" to={servicePath(service.slug)}>
										{service.listTitle ?? service.title}
									</Link>
								</h3>
								<p>{service.summary}</p>
							</article>
						))}
					</div>
					<div className="section-header stack-lg">
						<h2 className="section-title">Related services</h2>
					</div>
					<div className="grid cards-3">
						{relatedServices.map((service) => (
							<article className="card" key={service.slug}>
								<h3>
									<Link className="link" to={servicePath(service.slug)}>
										{service.title}
									</Link>
								</h3>
								<p>{service.summary}</p>
							</article>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
