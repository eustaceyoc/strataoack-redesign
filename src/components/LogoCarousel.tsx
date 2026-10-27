import { useEffect, useRef } from "react"
import { clientLogos } from "../data/content"

export function LogoCarousel() {
	const trackRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const track = trackRef.current
		if (!track) return
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		let paused = false
		const timer = window.setInterval(() => {
			if (paused) return
			const max = track.scrollWidth - track.clientWidth
			if (track.scrollLeft >= max - 1) track.scrollLeft = 0
			else track.scrollLeft += 1.2
		}, 16)
		const pause = () => {
			paused = true
		}
		const resume = () => {
			paused = false
		}
		track.addEventListener("mouseenter", pause)
		track.addEventListener("mouseleave", resume)
		track.addEventListener("focusin", pause)
		track.addEventListener("focusout", resume)
		return () => {
			window.clearInterval(timer)
			track.removeEventListener("mouseenter", pause)
			track.removeEventListener("mouseleave", resume)
			track.removeEventListener("focusin", pause)
			track.removeEventListener("focusout", resume)
		}
	}, [])

	const scrollByCard = (direction: number) => {
		trackRef.current?.scrollBy({ left: direction * 236, behavior: "smooth" })
	}

	return (
		<div className="carousel" id="clientsCarousel">
			<button type="button" className="carousel-btn prev" aria-label="Show previous logos" onClick={() => scrollByCard(-1)}>
				‹
			</button>
			<div className="carousel-track logo-row" ref={trackRef}>
				{clientLogos.map((logo) => (
					<div className="carousel-item" key={logo.alt}>
						<img src={logo.src} alt={logo.alt} width={236} height={160} loading="lazy" />
					</div>
				))}
			</div>
			<button type="button" className="carousel-btn next" aria-label="Show more logos" onClick={() => scrollByCard(1)}>
				›
			</button>
		</div>
	)
}
