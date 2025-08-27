import { Client, Databases, Models, Query } from "node-appwrite";

export function getAppwriteClients() {
	const endpoint = process.env.APPWRITE_ENDPOINT;
	const projectId = process.env.APPWRITE_PROJECT_ID;
	const apiKey = process.env.APPWRITE_API_KEY;

	if (!endpoint || !projectId || !apiKey) {
		throw new Error("Missing Appwrite configuration in environment variables");
	}

	const client = new Client()
		.setEndpoint(endpoint)
		.setProject(projectId)
		.setKey(apiKey);

	const databases = new Databases(client);

	return { client, databases, Query };
}

export type LeaderboardItem = {
	id: string;
	teamName: string;
	score: number;
	updatedAt: string;
};

export async function fetchLeaderboard(): Promise<LeaderboardItem[]> {
	const databaseId = process.env.APPWRITE_DATABASE_ID as string;
	const collectionId = process.env.APPWRITE_COLLECTION_ID as string;

	if (!databaseId || !collectionId) {
		throw new Error("Missing APPWRITE_DATABASE_ID or APPWRITE_COLLECTION_ID");
	}

	const { databases, Query } = getAppwriteClients();
	const result = await databases.listDocuments(databaseId, collectionId, [
		Query.orderDesc("score"),
		Query.limit(50),
	]);

	const items = result.documents.map((doc: Models.Document) => ({
		id: doc.$id,
		teamName: (doc as unknown as { team_name?: string }).team_name ?? "Unknown Team",
		score: Number((doc as unknown as { score?: number }).score ?? 0),
		updatedAt: doc.$updatedAt,
	}));

	// Ensure tie-breaker by earliest achievement time
	items.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
	});

	return items;
}


