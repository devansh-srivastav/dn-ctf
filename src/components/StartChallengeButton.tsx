"use client";

import { useState } from "react";

export default function StartChallengeButton() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onClick() {
		setError(null);
		setLoading(true);
		try {
			const res = await fetch("/api/allocate", { cache: "no-store" });
			if (!res.ok) {
				const text = await res.text().catch(() => "");
				throw new Error(text || "Allocation failed");
			}
			const data: { url?: string } = await res.json();
			if (!data.url) throw new Error("No URL returned");
			window.open(data.url, "_blank", "noopener,noreferrer");
		} catch (e) {
			const message =
				typeof e === "object" && e !== null && "message" in e
					? String((e as { message: unknown }).message)
					: "Something went wrong";
			setError(message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-2 w-full sm:w-auto">
			<button
				onClick={onClick}
				disabled={loading}
				className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
			>
				{loading ? "Starting..." : "Start Challenge"}
			</button>
			{error && <span className="text-sm text-red-600">{error}</span>}
		</div>
	);
}


