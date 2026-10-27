import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Footer } from "./Footer"
import { Header } from "./Header"

export function Layout() {
	const { pathname, hash } = useLocation()

	useEffect(() => {
		if (hash) {
			const target = document.getElementById(hash.slice(1))
			if (target) {
				target.scrollIntoView()
				return
			}
		}
		window.scrollTo(0, 0)
	}, [pathname, hash])

	return (
		<>
			<Header />
			<main id="main-content">
				<Outlet />
			</main>
			<Footer />
		</>
	)
}
