"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 backdrop-blur bg-white/70 dark:bg-black/40">
			<div className="mx-auto max-w-6xl px-4">
				<div className="flex h-14 items-center justify-between">
					<Link href="/" className="flex items-center gap-2 text-lg font-semibold">
						<img src="/logo-left.svg" alt="Logo" className="h-6 w-6" />
						<span>CTF Arena</span>
					</Link>
					<nav className="hidden md:flex items-center gap-6 text-sm">
						<Link href="/" className="hover:text-blue-600">Home</Link>
						<Link href="/leaderboard" className="hover:text-blue-600">Leaderboard</Link>
						<Link href="/contact" className="hover:text-blue-600">Contact</Link>
					</nav>
					<div className="md:hidden">
						<button aria-label="Toggle Menu" onClick={() => setOpen(v => !v)} className="rounded p-2 hover:bg-black/5 dark:hover:bg-white/10">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-current">
								<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
							</svg>
						</button>
					</div>
				</div>
			</div>
			{open && (
				<div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur">
					<div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 text-sm">
						<Link href="/" className="hover:text-blue-600" onClick={() => setOpen(false)}>Home</Link>
						<Link href="/leaderboard" className="hover:text-blue-600" onClick={() => setOpen(false)}>Leaderboard</Link>
						<Link href="/contact" className="hover:text-blue-600" onClick={() => setOpen(false)}>Contact</Link>
					</div>
				</div>
			)}
		</header>
	);
}


