import { useMemo, useState } from "react"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { clientGroups, clientLogos, projectRegions, projects } from "../data/content"

export function ClientsPage() {
	usePageMeta(
		"Clients & Projects — STRATAOACK Mining Consultancy",
		"Representative clients and selected projects delivered by STRATAOACK across exploration and mine development.",
	)
	const [region, setRegion] = useState("All")
	const visible = useMemo(
		() => (region === "All" ? projects : projects.filter((project) => project.region === region)),
		[region],
	)

	return (
		<>
			<PageHero title="Clients & Projects" crumbs={[{ label: "Home", to: "/" }, { label: "Clients & Projects" }]} />
			<section className="section">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Relationships</p>
						<h2 className="section-title">Clients we support</h2>
						<p className="section-lead">
							We partner with institutions, private operators, developers, and technical organizations across the mineral project lifecycle.
						</p>
					</div>
					<ul className="named-logos">
						{clientLogos.map((logo) => (
							<li key={logo.alt}>
								<img src={logo.src} alt="" width={236} height={120} />
								<span>{logo.alt}</span>
							</li>
						))}
					</ul>
					<div className="project-grid mt-sm">
						{clientGroups.map((client) => (
							<article className="project-card client-card" key={client.name}>
								{client.logo ? (
									<div className="project-card__logo">
										<img src={client.logo} alt={client.logoAlt ?? ""} width={220} height={80} />
									</div>
								) : null}
								<div className="body">
									<h3>{client.name}</h3>
									<p>{client.summary}</p>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
			<section className="section section--surface">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Delivery</p>
						<h2 className="section-title">Selected projects</h2>
						<p className="section-lead">Examples of mandates spanning governance support, exploration, due diligence, and technical studies.</p>
					</div>
					<div className="filter-bar" role="group" aria-label="Filter projects by location">
						{projectRegions.map((item) => (
							<button key={item} type="button" aria-pressed={region === item} onClick={() => setRegion(item)}>
								{item}
							</button>
						))}
					</div>
					{visible.length === 0 ? (
						<p className="empty-state">No projects are listed for {region}.</p>
					) : (
						<div className="project-grid mt-sm">
							{visible.map((project) => (
								<article className="project-card" key={project.title}>
									{project.logo ? (
										<div className="project-card__logo">
											<img src={project.logo} alt={project.logoAlt ?? ""} width={220} height={80} />
										</div>
									) : null}
									<div className="body">
										<h3>{project.title}</h3>
										<p>{project.summary}</p>
										<div className="meta">{project.region}</div>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</section>
		</>
	)
}
