export const inbox = ["strataoack@gmail.com", "eustaceocrentsil@gmail.com"] as const

export const office = {
	name: "Accra office",
	lines: ["One Airport Square, Airport Bypass", "Accra, Ghana"],
	addressLine: "One Airport Square, Airport Bypass, Accra — Ghana",
	phoneDisplay: "+233 54 649 6092",
	phoneHref: "tel:+233546496092",
	hours: "Mon–Fri · 8:00–17:00",
	hoursLong: "Monday–Friday: 8am–5pm",
	mapSrc: "https://www.google.com/maps?q=5.600691679663701,-0.1773688046512293&output=embed",
	mapTitle: "Map of STRATAOACK office location in Accra",
}

export const socialLinks = [
	{
		label: "STRATAOACK on LinkedIn",
		href: "https://www.linkedin.com/company/strataoack",
		icon: "linkedin",
	},
	{
		label: "STRATAOACK on X",
		href: "https://x.com/strataoack",
		icon: "x",
	},
	{
		label: "STRATAOACK on Instagram",
		href: "https://www.instagram.com/strataoack",
		icon: "instagram",
	},
	{
		label: "STRATAOACK on Facebook",
		href: "https://www.facebook.com/strataoack",
		icon: "facebook",
	},
] as const

export const stats = [
	{ value: "10+", label: "Years of consulting experience" },
	{ value: "120+", label: "Technical assignments delivered" },
	{ value: "8", label: "Core technical disciplines" },
	{ value: "24/7", label: "Responsive project communication" },
]

export type Testimonial = {
	quote: string
	name: string
	role: string
}

export const testimonials: Testimonial[] = []

export const commitments = [
	{
		title: "Data integrity and QA/QC",
		text: "Sampling, logging, and assay work follow a documented QA/QC plan, so resource models and studies rest on data that can be checked.",
	},
	{
		title: "Safety and local crews",
		text: "Field programs are planned around safety, and we work with local crews who know the ground.",
	},
	{
		title: "Clear reporting, on time",
		text: "Assumptions, findings, and recommendations are written for the boardroom and the field, and they are delivered to the agreed date.",
	},
]

export const clientLogos = [
	{ src: "/assets/img/goldfields.jpg", alt: "Gold Fields" },
	{ src: "/assets/img/giz.jpg", alt: "GIZ" },
	{ src: "/assets/img/mincom.jpg", alt: "Minerals Commission" },
	{ src: "/assets/img/newmont.jpg", alt: "Newmont" },
]

export const clientGroups: { name: string; summary: string; logo?: string; logoAlt?: string }[] = [
	{
		name: "Minerals Commission of Ghana",
		summary: "Regulatory and institutional technical support programs.",
		logo: "/assets/img/mincom.jpg",
		logoAlt: "Minerals Commission",
	},
	{
		name: "World Bank-funded programs",
		summary: "Capacity-building and sector improvement initiatives.",
	},
	{
		name: "Mining companies",
		summary: "Exploration, studies, and due diligence support teams.",
	},
	{
		name: "Quarry and aggregate operators",
		summary: "Technical advisory for planning and development phases.",
	},
	{
		name: "Government and parastatal bodies",
		summary: "Independent technical input and project governance support.",
	},
	{
		name: "Technical and legal advisors",
		summary: "Specialist collaboration for transactions and project reviews.",
	},
]

export const projects: { title: string; summary: string; region: string; logo?: string; logoAlt?: string }[] = [
	{
		title: "Minerals Commission of Ghana/World Bank",
		summary:
			"Institutional support and capacity-strengthening services focused on sector governance and effective technical service delivery.",
		region: "Ghana",
		logo: "/assets/img/mincom.jpg",
		logoAlt: "Minerals Commission",
	},
	{
		title: "Gold Exploration — Burkina Faso",
		summary:
			"Exploration management including drill-program oversight, QA/QC controls, and structured reporting for junior exploration assets.",
		region: "Burkina Faso",
	},
	{
		title: "Great Consolidated Diamonds Ghana Ltd",
		summary:
			"Feasibility and due diligence support for an alluvial diamond project, including technical review, planning input, and valuation context.",
		region: "Ghana",
	},
	{
		title: "Small Scale Mining Assistance",
		summary:
			"Support from exploration through processing and reclamation, with practical technical coaching and safety-focused guidance.",
		region: "Regional",
	},
	{
		title: "Environmental and Social Impact Assessment",
		summary:
			"ESIA preparation, permitting guidance, and fit-for-purpose monitoring frameworks for quarry and mining development activities.",
		region: "Various",
	},
	{
		title: "ACP-EU Partnership for Geological Services",
		summary:
			"Regional geoscience services and capability-building delivered in collaboration with partner institutions and technical teams.",
		region: "Africa",
	},
]

export const projectRegions = ["All", ...new Set(projects.map((project) => project.region))]

export type TeamMember = {
	name: string
	email: string
	role?: string
	photo?: string
}

export const team: TeamMember[] = [
	{
		name: "Eustace Crentsil",
		email: "ecrentsil@strataoack.com",
		photo: "/assets/img/team/eustace-crentsil.webp",
	},
	{
		name: "George Joel Agyemfra",
		email: "jagyemfra@strataoack.com",
	},
	{
		name: "Yaw Kisser",
		email: "ykisser@strataoack.com",
		photo: "/assets/img/team/yaw-kisser.webp",
	},
	{
		name: "Joseph Atichogbe",
		email: "jatichogbe@strataoack.com",
	},
	{
		name: "Richard Onwona Anim",
		email: "roanim@strataoack.com",
	},
]

export const gallery = [
	{
		src: "/assets/img/hero.jpg",
		alt: "Open-pit mine with haul trucks on terraced benches",
		kind: "field",
	},
	{
		src: "/assets/img/exploration.jpeg",
		alt: "Geologist in high-visibility clothing examining a drill core sample",
		kind: "field",
	},
	{
		src: "/assets/img/survey.jpg",
		alt: "Surveyor using a total station on rocky ground",
		kind: "field",
	},
	{
		src: "/assets/img/exp.jpeg",
		alt: "Geologist holding a rock specimen beside a computer",
		kind: "field",
	},
	{
		src: "/assets/img/Africa-Mining.jpg",
		alt: "Aerial view of a large open-pit mine",
		kind: "field",
	},
	{
		src: "/assets/img/goldfields.jpg",
		alt: "Gold Fields logo",
		kind: "logo",
	},
] as const

export const galleryFilters = [
	{ id: "all", label: "All" },
	{ id: "field", label: "Field photographs" },
	{ id: "logo", label: "Logos" },
] as const

export const careerValues = ["Teamwork", "We Own It", "Integrity", "Growth"]

export const aboutPillars = [
	{
		title: "Mission",
		text: "Enable responsible mineral development by combining rigorous geoscience, engineering discipline, and transparent reporting.",
	},
	{
		title: "Values",
		text: "Safety first, integrity in every recommendation, and long-term value creation for communities and investors.",
	},
	{
		title: "Approach",
		text: "Data-led planning, phased risk reduction, and actionable deliverables that teams can use in the field and boardroom.",
	},
]

export const quickLinks = [
	{ to: "/about", label: "Learn about", title: "Who We Are" },
	{ to: "/about#what-we-do", label: "Our expertise", title: "What We Do" },
	{ to: "/team", label: "Leadership", title: "Meet the Team" },
	{ to: "/careers", label: "Join us", title: "Careers" },
]

export function mailtoHref(subject: string, body: string) {
	const to = inbox.join(",")
	return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
