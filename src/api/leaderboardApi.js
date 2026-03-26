// =============================================
// MOCK API — Ganti dengan URL Elysia.js nanti
// =============================================

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Data mock — nanti dari Supabase
const mockLeaderboard = [
  { id: "u1", name: "Kimi Hime", xp: 20000, avatar: "/images/ppcowo.jpeg" },
  { id: "u2", name: "Ricky", xp: 18500, avatar: null },
  { id: "u3", name: "Thomas", xp: 17900, avatar: null },
  { id: "u4", name: "Jatmiko", xp: 16000, avatar: null },
  { id: "u5", name: "Dela", xp: 15500, avatar: null },
  { id: "u6", name: "Azka", xp: 14900, avatar: null },
  { id: "u7", name: "Fadhil", xp: 14100, avatar: null },
  { id: "u8", name: "Ulfan", xp: 13800, avatar: null },
];

/**
 * Ambil leaderboard dari API
 *
 * ENDPOINT yang harus dibuat backend:
 * GET /leaderboard
 *
 * RESPONSE:
 * [
 *   { id, name, xp, avatar }  ← diurutkan dari XP terbesar
 * ]
 */
export async function getLeaderboard() {
  await delay(500);

  // Urutkan dari XP terbesar
  return [...mockLeaderboard].sort((a, b) => b.xp - a.xp);
}
