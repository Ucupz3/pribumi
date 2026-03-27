const BASE_URL = "https://nusa-api.vercel.app";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

// GET /users/me/badges
export async function getUserBadges() {
  try {
    const res = await fetch(`${BASE_URL}/users/me/badges`, {
      headers: authHeaders(),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data?.badges) ? json.data.badges : [];
  } catch (err) {
    console.error("Badge error:", err);
    return [];
  }
}

// GET /users/me/progress
export async function getUserProgress() {
  try {
    const res = await fetch(`${BASE_URL}/users/me/progress`, {
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    console.error("Progress error:", err);
    return null;
  }
}
