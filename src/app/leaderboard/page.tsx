import { LeaderboardItem, fetchLeaderboard } from "@/lib/appwrite";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
	let items: LeaderboardItem[] = [];
	let error: string | null = null;
	try {
		// Prefer direct server call for performance
		items = await fetchLeaderboard();
	} catch (e: unknown) {
		// Fallback to API route if needed
		try {
			const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
			const res = await fetch(`${base}/api/leaderboard`, {
				next: { revalidate: 0 },
				cache: "no-store",
			});
			if (res.ok) {
				const data: { items?: LeaderboardItem[] } = await res.json();
				items = data.items ?? [];
			} else {
				error = "Failed to fetch leaderboard";
			}
		} catch (err: unknown) {
			error =
				typeof err === "object" && err !== null && "message" in err
					? String((err as { message: unknown }).message)
					: "Failed to fetch leaderboard";
		}
	}

	return (
		<main className="min-h-screen px-6 py-12">
			<div className="mx-auto max-w-3xl">
				<h1 className="text-3xl font-bold">Leaderboard</h1>
				<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
					Rank is determined by score. If scores are tied, the team that
					reached that score earlier is ranked higher.
				</p>
				{error ? (
					<p className="mt-4 text-red-600">{error}</p>
				) : (
					<div className="mt-6 overflow-x-auto rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5">
						<table className="min-w-full">
							<thead className="bg-neutral-50 dark:bg-neutral-900">
								<tr>
									<th className="px-4 py-2 text-left">Rank</th>
									<th className="px-4 py-2 text-left">Team</th>
									<th className="px-4 py-2 text-left">Score</th>
									<th className="px-4 py-2 text-left">Achieved At</th>
									
								</tr>
							</thead>
							<tbody>
								{items.length === 0 ? (
									<tr>
										<td className="px-4 py-3" colSpan={4}>
											No entries yet.
										</td>
									</tr>
								) : (
									items.map((item, index) => (
										<tr key={item.id} className="border-t border-black/10 dark:border-white/10">
											<td className="px-4 py-2">{index + 1}</td>
											<td className="px-4 py-2">{item.teamName}</td>
											<td className="px-4 py-2">{item.score}</td>
											<td className="px-4 py-2">{new Date(item.updatedAt).toLocaleString()}</td>
											
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</main>
	);
}


