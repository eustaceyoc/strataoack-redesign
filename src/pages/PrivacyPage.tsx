import { Link } from "react-router-dom"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"

export function PrivacyPage() {
	usePageMeta(
		"Privacy — STRATAOACK Mining Consultancy",
		"How the STRATAOACK contact form and speculative CV form send enquiries.",
	)

	return (
		<>
			<PageHero title="Privacy" crumbs={[{ label: "Home", to: "/" }, { label: "Privacy" }]} />
			<section className="section section--article">
				<div className="container prose">
					<h2>Enquiries</h2>
					<p>
						The contact form and the speculative CV form send the fields you enter to strataoack@gmail.com and eustaceocrentsil@gmail.com. A CV is attached to that email when you choose a file. The website does not keep a database of messages. If sending fails, the page offers an email link, and that link does not attach the file for you.
					</p>
					<p>
						The contact page embeds a Google map of the Accra office. Fonts are requested from Google Fonts.
					</p>
					<p>
						<Link className="link" to="/contact">
							Contact the Accra office
						</Link>
					</p>
				</div>
			</section>
		</>
	)
}
