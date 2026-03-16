// =============================================
// MOCK API — Ganti dengan URL Elysia.js nanti
// =============================================

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Mock user XP — nanti dari auth/session
const mockUser = {
  id: "user-123",
  xp: 80,
};

/**
 * Ambil XP user untuk keperluan unlock marker
 *
 * ENDPOINT yang harus dibuat backend:
 * GET /user/xp
 *
 * RESPONSE:
 * { xp: number }
 */
export async function getUserXP() {
  await delay(300);
  return { xp: mockUser.xp };
}