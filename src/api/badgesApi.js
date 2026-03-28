const BASE_URL = "https://nusa-api.vercel.app";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

const cache = {};
const CACHE_TTL = 5 * 60_000; // 5 menit
const inFlight = {};

async function fetchWithCache(key, url) {
  const now = Date.now();

  if (cache[key] && now - cache[key].ts < CACHE_TTL) {
    return cache[key].data;
  }

  if (inFlight[key]) return await inFlight[key];

  inFlight[key] = (async () => {
    try {
      const res = await fetch(url, { headers: authHeaders() });
      if (!res.ok) return cache[key]?.data ?? null; // fallback cache lama kalau 429
      const json = await res.json();
      const data = json.data ?? null;
      cache[key] = { data, ts: Date.now() };
      return data;
    } finally {
      delete inFlight[key];
    }
  })();

  return await inFlight[key];
}

export async function getUserBadges() {
  try {
    const data = await fetchWithCache("badges", `${BASE_URL}/users/me/badges`);
    return Array.isArray(data?.badges) ? data.badges : [];
  } catch (err) {
    console.error("Badge error:", err);
    return [];
  }
}

export async function getUserProgress() {
  try {
    return await fetchWithCache("progress", `${BASE_URL}/users/me/progress`);
  } catch (err) {
    console.error("Progress error:", err);
    return null;
  }
}

export function clearProgressCache() {
  delete cache["progress"];
  delete cache["badges"];
}