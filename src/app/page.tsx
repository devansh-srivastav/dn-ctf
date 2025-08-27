import Link from "next/link";
import StartChallengeButton from "@/components/StartChallengeButton";

export default function Home() {
	return (
		<main>
			<section className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 p-8 sm:p-12">
				<div className="relative z-10 max-w-3xl">
					<h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
						Compete in the <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CTF Arena</span>
					</h1>
					<p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">
						Start a challenge instance and climb the leaderboard in real-time.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row gap-3">
						<StartChallengeButton />
						<Link
							className="inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
							href="/leaderboard"
						>
							View Leaderboard
						</Link>
					</div>
					<div className="mt-10">
						<p className="text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
							Powered by
						</p>
						<div className="mt-3 flex flex-wrap items-center gap-4 sm:gap-6">
							<div className="rounded-md p-2">
								<img src="/logo-left.png" alt="Logo 1" className="h-8 w-auto" />
							</div>
							<div className="rounded-md p-2">
								<img src="/logo-right.png" alt="Logo 2" className="h-15 w-auto" />
							</div>
						</div>
					</div>
				</div>
				<div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
			</section>
		</main>
	);
}
