import { Link, useParams } from "react-router-dom"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { getService } from "../data/services"
import { NotFoundPage } from "./NotFoundPage"

export function ServiceDetailPage() {
	const { slug } = useParams()
	const service = getService(slug)
	usePageMeta(
		service ? `${service.title} — STRATAOACK` : "Service not found — STRATAOACK",
		service?.description ?? "That service is not listed.",
	)

	if (!service) return <NotFoundPage />

	return (
		<>
			<PageHero
				title={service.title}
				crumbs={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }]}
			/>
			<section className="section section--article">
				<div className="container service-layout">
					<div className="prose">
						<p className="mt-0">
							<Link className="link back-link" to="/services">
								← Back to Services
							</Link>
						</p>
						<p>{service.body}</p>
					</div>
					<aside className="service-aside">
						<h2>Discuss this scope</h2>
						<p>Share the asset, the data you already hold, and the decision you need to make.</p>
						<Link className="btn btn-primary" to="/contact">
							Request a consultation
						</Link>
					</aside>
				</div>
			</section>
		</>
	)
}
