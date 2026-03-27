const BASE_URL = "https://nusa-api.vercel.app";

export async function getLeaderboard() {
  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${BASE_URL}/leaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil leaderboard");
    }

    const json = await res.json();

    // Response shape: { success, message, data: { leaderboard: [...], currentUserRank: {...} } }
    const raw = json?.data?.leaderboard;

    if (!Array.isArray(raw)) return [];

    // Mapping field backend → field yang dipakai Peringkat.jsx
    return raw.map((player) => ({
      id: player.id,
      name: player.username, // username  → name
      avatar: player.avatarUrl, // avatarUrl → avatar
      xp: player.totalXp, // totalXp   → xp
      level: player.level,
      rank: player.rank,
      isCurrentUser: player.isCurrentUser,
    }));
  } catch (err) {
    console.error("Leaderboard error:", err);
    return [];
  }
}
