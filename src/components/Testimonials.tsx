import { testimonials, type Testimonial } from "../data/content"

export function Testimonials({ items = testimonials }: { items?: readonly Testimonial[] }) {
	if (items.length === 0) return null
	return (
		<div className="testimonials__grid">
			{items.map((item) => (
				<blockquote className="testimonial" key={item.name}>
					<p className="testimonial__quote">{item.quote}</p>
					<cite>
						{item.name} <span>{item.role}</span>
					</cite>
				</blockquote>
			))}
		</div>
	)
}
