// =============================================
// API Leaderboard - Terhubung ke Backend Elysia
// =============================================

/**
 * Ambil leaderboard dari API
 *
 * ENDPOINT yang harus dibuat backend:
 * GET /leaderboard (atau menyesuaikan prefix route)
 */
export async function getLeaderboard() {
  try {
    // Ganti URL backend di bawah ini dengan base URL API aslimu (misalnya dari .env)
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    // const BASE_URL = "http://localhost:3000";

    // Ambil token jika endpoint butuh autentikasi (sesuaikan key storage token kamu)
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${BASE_URL}/leaderboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Hapus baris ini jika endpoint leaderboard tidak diproteksi
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data leaderboard");
    }

    const data = await response.json();

    // Data dari service kamu mengembalikan bentuk:
    // { leaderboard: [...], currentUserRank: {...} }
    // Kita hanya return `leaderboard` (array) untuk dipakai peringkat.jsx
    // Mapping property dari backend ke properti frontend (username -> name, totalXp -> xp, avatarUrl -> avatar)
    return data.leaderboard.map((user) => ({
      id: user.id,
      name: user.username,
      xp: user.totalXp,
      avatar: user.avatarUrl,
      rank: user.rank,
      isCurrentUser: user.isCurrentUser,
    }));
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
