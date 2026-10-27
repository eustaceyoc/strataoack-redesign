import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"

type NavChild = { label: string; to: string }
type NavItem = { label: string; to: string; children?: NavChild[]; cta?: boolean }

const nav: NavItem[] = [
	{ label: "Home", to: "/" },
	{
		label: "About",
		to: "/about",
		children: [
			{ label: "Meet the Team", to: "/team" },
			{ label: "Careers", to: "/careers" },
		],
	},
	{ label: "Services", to: "/services" },
	{
		label: "Clients & Projects",
		to: "/clients",
		children: [{ label: "Gallery", to: "/gallery" }],
	},
	{ label: "Contact", to: "/contact", cta: true },
]

function childIsCurrent(pathname: string, children?: NavChild[]) {
	return children?.some((child) => pathname === child.to || pathname.startsWith(`${child.to}/`)) ?? false
}

export function Header() {
	const { pathname } = useLocation()
	const [open, setOpen] = useState(false)
	const [expanded, setExpanded] = useState<string | null>(null)
	const [scrolled, setScrolled] = useState(false)
	const [navPath, setNavPath] = useState(pathname)
	if (navPath !== pathname) {
		setNavPath(pathname)
		setOpen(false)
		setExpanded(null)
	}

	useEffect(() => {
		document.body.classList.toggle("nav-open", open)
		return () => document.body.classList.remove("nav-open")
	}, [open])

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		onScroll()
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	useEffect(() => {
		if (!open) return
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false)
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [open])

	return (
		<>
			<a className="skip-link" href="#main-content">
				Skip to main content
			</a>
			<header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
				<div className="container header-inner">
					<NavLink className="logo" to="/" aria-label="STRATAOACK home">
						<img src="/assets/img/strataoacklogo.png" alt="STRATAOACK Geological Consultancy" width={101} height={74} />
					</NavLink>
					<button
						type="button"
						className="nav-toggle"
						aria-label={open ? "Close menu" : "Open menu"}
						aria-expanded={open}
						aria-controls="primary-navigation"
						onClick={() => setOpen((value) => !value)}
					>
						<span className="nav-toggle__bar" />
						<span className="nav-toggle__bar" />
						<span className="nav-toggle__bar" />
					</button>
					<nav className={`site-nav${open ? " open" : ""}`} id="primary-navigation" aria-label="Primary">
						<ul className="site-nav__list">
							{nav.map((item) => {
								const submenuId = `${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}-submenu`
								const childCurrent = childIsCurrent(pathname, item.children)
								return (
									<li
										key={item.to}
										className={`${item.children ? "site-nav__item site-nav__item--has-submenu" : ""}${item.cta ? " site-nav__cta" : ""}${expanded === item.to ? " is-open" : ""}`.trim()}
									>
										<NavLink
											to={item.to}
											end={item.to !== "/services"}
											className={({ isActive }) =>
												[item.cta ? "btn btn-primary" : "", isActive || childCurrent ? "active" : ""]
													.filter(Boolean)
													.join(" ") || undefined
											}
											aria-haspopup={item.children ? "true" : undefined}
										>
											{item.label}
										</NavLink>
										{item.children ? (
											<>
												<button
													type="button"
													className="submenu-toggle"
													aria-expanded={expanded === item.to}
													aria-controls={submenuId}
													onClick={() => setExpanded((current) => (current === item.to ? null : item.to))}
												>
													<span className="visually-hidden">
														{expanded === item.to ? "Hide" : "Show"} {item.label} links
													</span>
												</button>
												<ul className="site-nav__submenu" id={submenuId}>
													{item.children.map((child) => (
														<li key={child.to}>
															<NavLink to={child.to} end>
																{child.label}
															</NavLink>
														</li>
													))}
												</ul>
											</>
										) : null}
									</li>
								)
							})}
						</ul>
					</nav>
				</div>
			</header>
		</>
	)
}
