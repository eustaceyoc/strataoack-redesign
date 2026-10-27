import { useEffect, useRef, type ComponentProps } from "react"

export function Reveal(props: ComponentProps<"section">) {
	const { className = "", children, ...rest } = props
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			el.classList.add("is-visible")
			return
		}
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible")
						observer.unobserve(entry.target)
					}
				})
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	return (
		<section ref={ref} className={`section reveal ${className}`.trim()} {...rest}>
			{children}
		</section>
	)
}
