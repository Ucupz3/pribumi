import { cacheHelper } from "./cacheHelper";

const BASE_URL = "https://nusa-api.vercel.app";
let refreshTokenPromise = null;

const tryRefreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return false;
  if (refreshTokenPromise) return await refreshTokenPromise;

  refreshTokenPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem("access_token", json.data.access_token);
        localStorage.setItem("refresh_token", json.data.refresh_token);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return await refreshTokenPromise;
};

export async function getLeaderboard(forceRefresh = false) {
  const CACHE_KEY = "leaderboard_cache";

  if (!forceRefresh) {
    const cache = cacheHelper.get(CACHE_KEY, 5);
    if (cache && !cache.isExpired) return cache.data;
  }

  try {
    let token = localStorage.getItem("access_token");
    let res = await fetch(`${BASE_URL}/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      const refreshed = await tryRefreshToken();
      if (!refreshed) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("UNAUTHORIZED");
      }
      token = localStorage.getItem("access_token");
      res = await fetch(`${BASE_URL}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (!res.ok) throw new Error("Gagal mengambil leaderboard");

    const json = await res.json();
    const raw = json?.data?.leaderboard || [];

    const formattedData = raw.map((player) => ({
      id: player.id,
      name: player.username,
      avatar: player.avatarUrl,
      xp: player.totalXp,
      level: player.level,
      rank: player.rank,
      isCurrentUser: player.isCurrentUser,
    }));

    cacheHelper.set(CACHE_KEY, formattedData);
    return formattedData;
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") throw err;

    const backup = cacheHelper.getFallback(CACHE_KEY);
    console.warn("Leaderboard error, using backup if available");
    return backup || [];
  }
}