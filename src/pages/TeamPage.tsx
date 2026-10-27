import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { team } from "../data/content"

function initials(name: string) {
	const parts = name.split(/\s+/).filter(Boolean)
	const first = parts[0]?.[0] ?? ""
	const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : ""
	return (first + last).toUpperCase()
}

export function TeamPage() {
	usePageMeta(
		"Meet the Team — STRATAOACK Mining Consultancy",
		"Meet the STRATAOACK team of geologists, engineers, and project specialists supporting responsible mineral development.",
	)

	return (
		<>
			<PageHero title="Meet the Team" crumbs={[{ label: "Home", to: "/" }, { label: "Meet the Team" }]} />
			<section className="section" id="team">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Our people</p>
						<h2 className="section-title">Experienced specialists, one integrated team</h2>
						<p className="section-lead">
							Our team combines field experience, technical depth, and project discipline to deliver clear recommendations and dependable outcomes.
						</p>
					</div>
					<div className="team-grid">
						{team.map((person) => (
							<article className="team-card" key={person.email}>
								{person.photo ? (
									<img className="team-card__image" src={person.photo} alt={person.name} width={800} height={600} />
								) : (
									<div className="team-card__avatar" aria-hidden="true">
										{initials(person.name)}
									</div>
								)}
								<div className="team-card__body">
									<h3 className="team-card__name">{person.name}</h3>
									{person.role ? <p className="team-card__role">{person.role}</p> : null}
									<a className="team-card__email" href={`mailto:${person.email}`}>
										{person.email}
									</a>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>
		</>
	)
}
