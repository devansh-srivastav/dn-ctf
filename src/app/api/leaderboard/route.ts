import { NextResponse } from "next/server";
import { fetchLeaderboard } from "@/lib/appwrite";

export async function GET() {
	try {
		const items = await fetchLeaderboard();
		return NextResponse.json({ items }, { status: 200 });
	} catch (error: unknown) {
		const message =
			typeof error === "object" && error !== null && "message" in error
				? String((error as { message: unknown }).message)
				: "Failed to fetch leaderboard";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}


