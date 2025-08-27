export const runtime = "edge";

function parseUrls() {
  const raw = process.env.STREAMLIT_URLS ?? "";
  const urls = raw.split(",").map(s => s.trim()).filter(Boolean);
  if (!urls.length) throw new Error("STREAMLIT_URLS not set");
  return urls;
}

export async function GET() {
  const urls = parseUrls();

  // atomic increment in Redis
  const r = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/incr/streamlit:rr`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
    cache: "no-store",
  });

  if (!r.ok) {
    const text = await r.text().catch(() => "");
    return new Response(JSON.stringify({ error: "Counter error", detail: text }), {
      status: 502,
      headers: { "content-type": "application/json" }
    });
  }

  const { result } = await r.json(); // { result: number }
  const idx = (Number(result) - 1) % urls.length;

  return new Response(JSON.stringify({ url: urls[idx], index: idx }), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
