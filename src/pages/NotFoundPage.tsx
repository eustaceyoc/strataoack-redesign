import { Link } from "react-router-dom"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"

export function NotFoundPage() {
	usePageMeta("Page not found — STRATAOACK", "That address is not a page on the STRATAOACK site.")

	return (
		<>
			<PageHero title="Page not found" crumbs={[{ label: "Home", to: "/" }, { label: "Not found" }]} />
			<section className="section section--article">
				<div className="container prose">
					<p>That address is not on this site. The page may have moved when the site became a React application.</p>
					<div className="not-found-actions">
						<Link className="btn btn-primary" to="/">
							Back to home
						</Link>
						<Link className="btn btn-secondary" to="/services">
							Browse services
						</Link>
						<Link className="btn btn-secondary" to="/contact">
							Contact
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
