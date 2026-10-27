export type Service = {
	slug: string
	title: string
	listTitle?: string
	homeTitle?: string
	homeSummary?: string
	summary: string
	aboutSummary?: string
	body: string
	description: string
	image: string
	featured?: boolean
	related?: boolean
}

export const services: Service[] = [
	{
		slug: "mineral-exploration",
		title: "Mineral Exploration and Resource Assessment",
		homeTitle: "Mineral exploration & resource assessment",
		homeSummary: "Mapping, sampling, drilling, and QA/QC, culminating in code-compliant resource models.",
		summary:
			"We design and execute exploration programs—mapping, sampling, drilling, and QA/QC—culminating in robust, code-compliant resource models.",
		aboutSummary: "Mapping, sampling, drilling, and QA/QC, culminating in code-compliant resource models.",
		body: "We design and execute exploration programs—mapping, sampling, drilling, and QA/QC—culminating in robust, code-compliant resource models. Our geologists apply modern geostatistics and data management to de-risk discovery and quantify resources responsibly.",
		description:
			"STRATAOACK provides mineral exploration programs and resource assessment including drilling, sampling, and compliant resource estimation.",
		image: "/assets/img/exploration.jpeg",
		featured: true,
	},
	{
		slug: "hydrogeology",
		title: "Hydrogeology and Ground Water Investigations",
		homeTitle: "Hydrogeology & groundwater investigations",
		homeSummary: "Field hydrogeology, pumping tests, groundwater modeling, and dewatering design.",
		summary:
			"We conduct field hydrogeology, pumping tests, groundwater modeling, and dewatering system design to manage water sustainably.",
		aboutSummary: "Field hydrogeology, pumping tests, groundwater modeling, and dewatering system design.",
		body: "We conduct field hydrogeology, pumping tests, groundwater modeling, and dewatering system design to manage water sustainably and protect operations and communities.",
		description:
			"Hydrogeological investigations, aquifer testing, dewatering design, and water balance studies for mining projects.",
		image: "/assets/img/survey.jpg",
		featured: true,
	},
	{
		slug: "geotechnical",
		title: "Geotechnical Services",
		homeTitle: "Geotechnical services",
		homeSummary: "Rock mass characterization, slope stability, ground support, and monitoring.",
		summary:
			"From site investigation to design: rock mass characterization, slope stability analysis, ground support, and monitoring.",
		aboutSummary: "Rock mass characterization, slope stability, ground support design, and monitoring.",
		body: "From site investigation to design, we provide rock mass characterization, slope stability analysis, ground support design, and monitoring strategies for safe, efficient operations.",
		description:
			"Geotechnical investigations, slope stability, pit wall design, ground control, and rock mass characterization.",
		image: "/assets/img/Africa-Mining.jpg",
		featured: true,
	},
	{
		slug: "geophysical-rental",
		title: "Geophysical Equipment Rental with Competent Specialists",
		homeTitle: "Geophysical equipment rental with competent specialists",
		homeSummary: "Instruments for seismic, magnetic, resistivity, and IP work, with trained field specialists.",
		summary:
			"Access modern geophysical instruments—seismic, magnetic, resistivity, IP—with trained field specialists.",
		aboutSummary: "Modern instruments with trained specialists for deployment, calibration, QA/QC, and acquisition.",
		body: "Access modern geophysical instruments—seismic, magnetic, resistivity, IP—with trained field specialists for deployment, calibration, QA/QC, and safe, efficient acquisition.",
		description:
			"Rent geophysical equipment with specialist operators and field support for efficient data acquisition and quality control.",
		image: "/assets/img/exp.jpeg",
		featured: true,
	},
	{
		slug: "feasibility-due-diligence",
		title: "Feasibility Studies on Mining Projects (Including Due Diligence Reviews)",
		homeTitle: "Feasibility studies & due diligence reviews",
		homeSummary: "Independent studies from PFS to FS, plus technical and commercial due diligence.",
		summary: "Independent and bankable studies from PFS to FS, and technical and commercial due diligence.",
		aboutSummary: "Bankable studies from PFS to FS, and technical and commercial due diligence.",
		body: "Independent and bankable studies from PFS to FS, integrating geology, mining, processing, ESG, logistics, and markets. We also deliver technical and commercial due diligence to support investment, financing, and acquisitions.",
		description:
			"Feasibility studies for mining projects, including technical and commercial due diligence for financing and M&A.",
		image: "/assets/img/hero.jpg",
		featured: true,
	},
	{
		slug: "viability-economic-risk",
		title: "Viability Studies, Economic Evaluations, and Risk Assessments",
		summary:
			"Financial models, sensitivities, scenarios, and technical risk registers for investment and development decisions.",
		aboutSummary: "Financial models, scenarios, and technical risk registers.",
		body: "We evaluate project options at scoping, PFS, and FS levels, develop financial models, sensitivities, and scenarios, and compile comprehensive technical risk registers to guide investment and development decisions.",
		description:
			"Scoping, prefeasibility, and feasibility viability studies, economic analyses, and project risk assessments for mining.",
		image: "/assets/img/hero.jpg",
	},
	{
		slug: "small-scale-mining",
		title: "Small Scale Mining",
		listTitle: "Small Scale Mining (Exploration to Processing and Reclamation)",
		summary:
			"Prospecting, mine planning, processing, environmental compliance, and practical reclamation for artisanal and small-scale mines.",
		aboutSummary: "Support from prospecting through processing, compliance, and reclamation.",
		body: "Holistic assistance for artisanal and small-scale mines: prospecting, mine planning, efficient processing, environmental compliance, and practical reclamation strategies to enhance safety and profitability.",
		description: "Support for small scale mining from exploration through mining to processing and reclamation.",
		image: "/assets/img/exploration.jpeg",
	},
	{
		slug: "environmental-studies",
		title: "Environmental Studies",
		homeTitle: "Environmental studies",
		homeSummary: "Baseline studies, impact assessment, permitting support, and management plans.",
		summary:
			"Baseline studies, impact assessment, permitting support, and environmental management plans, including closure and rehabilitation.",
		aboutSummary: "Baseline studies, impact assessment, permitting, and environmental management plans.",
		body: "Baseline studies, impact assessment, permitting support, and environmental management plans aligned with regulatory and lender requirements, including closure and rehabilitation strategies.",
		description:
			"Environmental baseline studies, ESIA, permitting support, monitoring, and closure planning for mining projects.",
		image: "/assets/img/Africa-Mining.jpg",
		featured: true,
	},
	{
		slug: "rnd-earth-resources",
		title: "Research and Development in Earth Resources",
		summary: "Applied research in exploration workflows, orebody knowledge, data science, and pilot trials.",
		aboutSummary: "Applied research, orebody knowledge, data science, and pilot trials.",
		body: "We partner on applied research—innovative exploration workflows, orebody knowledge, data science, and pilot trials—to unlock new value across the mining lifecycle.",
		description:
			"R&D in earth resources including new exploration methods, data analytics, and technology pilots for mining.",
		image: "/assets/img/exp.jpeg",
	},
	{
		slug: "remote-sensing-gis",
		title: "Remote Sensing and Geographic Information Systems",
		homeTitle: "Remote sensing & geographic information systems",
		homeSummary: "Satellite, aerial, and UAV analysis, and GIS products for targeting and planning.",
		summary:
			"Satellite, aerial, and UAV data, and GIS products for targeting, environmental compliance, and operational planning.",
		aboutSummary: "Satellite, aerial, and UAV analysis, and GIS products for exploration and compliance.",
		body: "We acquire and analyze satellite, aerial, and UAV data and build GIS products to support exploration targeting, environmental compliance, and operational planning.",
		description: "Remote sensing and GIS mapping for exploration, environmental monitoring, and operational decision making.",
		image: "/assets/img/exploration.jpeg",
		featured: true,
	},
	{
		slug: "code-compliant-reports",
		title: "Code Compliant and Competent Persons Reports",
		homeTitle: "Code-compliant & competent persons reports",
		homeSummary: "Reporting-code documents by recognized Competent Persons, for listings and transactions.",
		summary: "Preparation and sign-off of reports compliant with reporting codes by recognized Competent Persons.",
		aboutSummary: "Reporting-code documents signed off by recognized Competent Persons.",
		body: "Preparation and sign-off of reports compliant with reporting codes by recognized Competent Persons, supporting listings, transactions, and investor disclosures.",
		description: "Preparation of code compliant reports and CPRs by Competent Persons for exchanges and investors.",
		image: "/assets/img/survey.jpg",
		featured: true,
	},
	{
		slug: "geophysical-surveys",
		title: "Geophysical Surveys, Data Processing and Interpretation",
		summary:
			"Survey design, acquisition oversight, processing, inversions, and interpretation integrated with geology.",
		aboutSummary: "Survey design, acquisition, processing, inversions, and geological interpretation.",
		body: "End-to-end geophysics: survey design, acquisition oversight, rigorous processing, inversions, and interpretation integrated with geology to inform exploration and engineering decisions.",
		description:
			"Design and execution of geophysical surveys with expert processing and interpretation to support exploration and mining.",
		image: "/assets/img/survey.jpg",
	},
	{
		slug: "competent-persons-reports",
		title: "Competent Persons Reports",
		summary:
			"Independent CPRs authored by recognized Competent Persons, aligned with relevant reporting codes and exchange requirements.",
		body: "Independent CPRs authored by recognized Competent Persons, aligned with relevant reporting codes and exchange requirements.",
		description: "Competent Persons Reports (CPRs) and code-compliant documentation prepared by qualified professionals.",
		image: "/assets/img/exp.jpeg",
		related: true,
	},
	{
		slug: "data-processing-interpretation",
		title: "Data Processing and Interpretation",
		summary: "Advanced processing and inversions for geophysical datasets, integrated with geology and drilling.",
		body: "Advanced processing and inversions for geophysical datasets, integrated with geology and drilling to generate actionable interpretations and reduce uncertainty.",
		description:
			"Specialist processing, inversion, and interpretation of geophysical and geological datasets to support decisions.",
		image: "/assets/img/survey.jpg",
		related: true,
	},
	{
		slug: "economic-evaluations",
		title: "Economic Evaluations",
		summary:
			"Financial models, price and cost sensitivities, scenario analysis, and decision metrics for investors and lenders.",
		body: "Project economics built on transparent assumptions: financial models, price/cost sensitivities, scenario analysis, and decision metrics aligned with investor and lender expectations.",
		description: "Economic evaluation of mining projects including financial models, sensitivities, and scenario analysis.",
		image: "/assets/img/hero.jpg",
		related: true,
	},
]

export const primaryServices = services.filter((service) => !service.related)
export const relatedServices = services.filter((service) => service.related)

const featuredOrder = [
	"mineral-exploration",
	"hydrogeology",
	"geotechnical",
	"geophysical-rental",
	"feasibility-due-diligence",
	"remote-sensing-gis",
	"environmental-studies",
	"code-compliant-reports",
]

export const featuredServices = featuredOrder.map((slug) => {
	const service = services.find((item) => item.slug === slug)
	if (!service) throw new Error(`Missing featured service ${slug}`)
	return service
})

export function getService(slug: string | undefined) {
	return services.find((service) => service.slug === slug)
}

export function servicePath(slug: string) {
	return `/services/${slug}`
}
