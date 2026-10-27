import { Link } from "react-router-dom"

export function PageHero({
	title,
	crumbs,
}: {
	title: string
	crumbs: { label: string; to?: string }[]
}) {
	return (
		<section className="page-hero">
			<div className="container inner">
				<nav className="breadcrumbs" aria-label="Breadcrumb">
					{crumbs.map((crumb, index) => (
						<span key={`${crumb.label}-${index}`}>
							{index > 0 ? " / " : null}
							{crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : crumb.label}
						</span>
					))}
				</nav>
				<h1>{title}</h1>
			</div>
		</section>
	)
}
