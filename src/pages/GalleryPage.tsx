import { useEffect, useState } from "react"
import { PageHero } from "../components/PageHero"
import { usePageMeta } from "../components/usePageMeta"
import { gallery, galleryFilters } from "../data/content"

type FilterId = (typeof galleryFilters)[number]["id"]

export function GalleryPage() {
	usePageMeta(
		"Gallery — STRATAOACK Mining Consultancy",
		"Explore STRATAOACK project photography from exploration campaigns, field mapping, and mine-support assignments.",
	)
	const [filter, setFilter] = useState<FilterId>("all")
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const items = gallery.filter((item) => filter === "all" || item.kind === filter)

	useEffect(() => {
		if (openIndex === null) return
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpenIndex(null)
			if (event.key === "ArrowRight") setOpenIndex((current) => (current === null ? current : (current + 1) % items.length))
			if (event.key === "ArrowLeft") setOpenIndex((current) => (current === null ? current : (current - 1 + items.length) % items.length))
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [openIndex, items.length])

	const current = openIndex === null ? null : items[openIndex]

	return (
		<>
			<PageHero title="Gallery" crumbs={[{ label: "Home", to: "/" }, { label: "Gallery" }]} />
			<section className="section">
				<div className="container">
					<div className="section-header">
						<p className="section-eyebrow">Field and project photography</p>
						<h2 className="section-title">Our work in the field</h2>
						<p className="section-lead">A visual snapshot of exploration work, survey programs, and operational support delivered by STRATAOACK.</p>
					</div>
					<div className="filter-bar" role="group" aria-label="Filter gallery">
						{galleryFilters.map((item) => (
							<button
								key={item.id}
								type="button"
								aria-pressed={filter === item.id}
								onClick={() => {
									setFilter(item.id)
									setOpenIndex(null)
								}}
							>
								{item.label}
							</button>
						))}
					</div>
					{items.length === 0 ? (
						<p className="empty-state">No images are filed under that heading.</p>
					) : (
						<div className="gallery-grid mt-sm">
							{items.map((item, index) => (
								<button key={item.src} type="button" onClick={() => setOpenIndex(index)}>
									<img src={item.src} alt={item.alt} loading="lazy" />
								</button>
							))}
						</div>
					)}
				</div>
			</section>
			{current ? (
				<div className="lightbox open" role="dialog" aria-modal="true" aria-label="Enlarged image" onClick={() => setOpenIndex(null)}>
					<button
						type="button"
						className="lightbox__nav lightbox__nav--prev"
						aria-label="Previous image"
						onClick={(event) => {
							event.stopPropagation()
							setOpenIndex((value) => (value === null ? value : (value - 1 + items.length) % items.length))
						}}
					>
						‹
					</button>
					<img src={current.src} alt={current.alt} />
					<button
						type="button"
						className="lightbox__nav lightbox__nav--next"
						aria-label="Next image"
						onClick={(event) => {
							event.stopPropagation()
							setOpenIndex((value) => (value === null ? value : (value + 1) % items.length))
						}}
					>
						›
					</button>
				</div>
			) : null}
		</>
	)
}
