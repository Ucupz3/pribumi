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

function mapUser(raw) {
  return {
    nama: raw.username,
    avatar: raw.avatarUrl ?? "/images/None.jpg",
    xp: raw.totalXp ?? raw.xp ?? 0,
    level: raw.level ?? 1,
    email: raw.email,
    id: raw.id,
  };
}

export async function getUserProfile(forceRefresh = false) {
  const CACHE_KEY = "user_profile_cache";

  if (!forceRefresh) {
    const cache = cacheHelper.get(CACHE_KEY, 10);
    if (cache && !cache.isExpired) return cache.data;
  }

  try {
    let token = localStorage.getItem("access_token");
    if (!token) throw new Error("NO_TOKEN");

    let res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      const refreshed = await tryRefreshToken();
      if (!refreshed) {
        localStorage.clear();
        window.location.href = "/login";
        return null;
      }
      token = localStorage.getItem("access_token");
      res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (!res.ok) throw new Error("API_ERROR");

    const json = await res.json();
    const mapped = mapUser(json.data);

    // ✅ Simpan user_id agar cache key unik per user
    localStorage.setItem("user_id", json.data.id);
    cacheHelper.set(CACHE_KEY, mapped);
    return mapped;
  } catch {
    const backup = cacheHelper.getFallback(CACHE_KEY);
    if (backup) {
      console.warn("Using offline profile backup");
      return backup;
    }
    return null;
  }
}

export async function updateUserProfile(payload) {
  let token = localStorage.getItem("access_token");
  const body = {};
  if (payload.nama) body.username = payload.nama;
  if (payload.avatar) body.avatar_url = payload.avatar;

  let res = await fetch(`${BASE_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Sesi habis");
    }
    token = localStorage.getItem("access_token");
    res = await fetch(`${BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  }

  if (!res.ok) throw new Error("Update gagal");

  const json = await res.json();
  const mapped = mapUser(json.data);

  cacheHelper.set("user_profile_cache", mapped);
  return mapped;
}