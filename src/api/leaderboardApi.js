const BASE_URL = "https://nusa-api.vercel.app";

export async function getLeaderboard() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/leaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil leaderboard");
    }

    return await res.json();
  } catch (err) {
    console.error("Leaderboard error:", err);
    return [];
  }
}