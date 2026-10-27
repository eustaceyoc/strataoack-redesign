import { Navigate, Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout"
import { services } from "./data/services"
import { AboutPage } from "./pages/AboutPage"
import { CareersPage } from "./pages/CareersPage"
import { ClientsPage } from "./pages/ClientsPage"
import { ContactPage } from "./pages/ContactPage"
import { GalleryPage } from "./pages/GalleryPage"
import { HomePage } from "./pages/HomePage"
import { NotFoundPage } from "./pages/NotFoundPage"
import { PrivacyPage } from "./pages/PrivacyPage"
import { ServiceDetailPage } from "./pages/ServiceDetailPage"
import { ServicesPage } from "./pages/ServicesPage"
import { TeamPage } from "./pages/TeamPage"

const legacyPages: { from: string; to: string }[] = [
	{ from: "/index.html", to: "/" },
	{ from: "/about.html", to: "/about" },
	{ from: "/services.html", to: "/services" },
	{ from: "/contact.html", to: "/contact" },
	{ from: "/clients-projects.html", to: "/clients" },
	{ from: "/gallery.html", to: "/gallery" },
	{ from: "/meet-team.html", to: "/team" },
	{ from: "/careers.html", to: "/careers" },
	{ from: "/careers2.html", to: "/careers" },
	{ from: "/privacy.html", to: "/privacy" },
	...services.map((service) => ({
		from: `/service-${service.slug}.html`,
		to: `/services/${service.slug}`,
	})),
]

export default function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<HomePage />} />
				<Route path="about" element={<AboutPage />} />
				<Route path="services" element={<ServicesPage />} />
				<Route path="services/:slug" element={<ServiceDetailPage />} />
				<Route path="clients" element={<ClientsPage />} />
				<Route path="gallery" element={<GalleryPage />} />
				<Route path="team" element={<TeamPage />} />
				<Route path="careers" element={<CareersPage />} />
				<Route path="contact" element={<ContactPage />} />
				<Route path="privacy" element={<PrivacyPage />} />
				{legacyPages.map((page) => (
					<Route key={page.from} path={page.from.slice(1)} element={<Navigate to={page.to} replace />} />
				))}
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	)
}
