const BASE_URL = "https://nusa-api.vercel.app";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

// ── GET /map/islands ─────────────────────────────────────────
export async function getIslands() {
  try {
    const res = await fetch(`${BASE_URL}/map/islands`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data pulau");
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("getIslands error:", err);
    return [];
  }
}

// ── GET /map/islands/:id/markers ─────────────────────────────
// Ambil semua marker sebuah pulau beserta status unlock user
export async function getMarkersByIsland(islandId) {
  try {
    const res = await fetch(`${BASE_URL}/map/islands/${islandId}/markers`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil marker");
    const json = await res.json();
    // Shape: { success, message, data: [ ...markers ] }
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("getMarkersByIsland error:", err);
    return [];
  }
}

// ── GET /map/markers/:id ─────────────────────────────────────
// Detail satu marker + quizzes di dalamnya
export async function getMarkerById(markerId) {
  try {
    const res = await fetch(`${BASE_URL}/map/markers/${markerId}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Marker tidak ditemukan");
    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    console.error("getMarkerById error:", err);
    return null;
  }
}

// ── POST /gameplay/sessions ──────────────────────────────────
// Mulai sesi quiz baru untuk sebuah marker
export async function startSession(markerId) {
  const res = await fetch(`${BASE_URL}/gameplay/sessions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ marker_id: markerId }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal memulai sesi");
  return json.data;
}

// ── POST /gameplay/sessions/:id/submit ───────────────────────
// Submit semua jawaban sekaligus
export async function submitSession(sessionId, answers, timeSpentSec) {
  const res = await fetch(`${BASE_URL}/gameplay/sessions/${sessionId}/submit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ answers, time_spent_sec: timeSpentSec }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Gagal submit jawaban");
  return json.data;
}

// ── GET /gameplay/sessions/:id/result ────────────────────────
export async function getSessionResult(sessionId) {
  try {
    const res = await fetch(
      `${BASE_URL}/gameplay/sessions/${sessionId}/result`,
      { headers: authHeaders() },
    );
    if (!res.ok) throw new Error("Gagal mengambil hasil sesi");
    const json = await res.json();
    return json.data ?? null;
  } catch (err) {
    console.error("getSessionResult error:", err);
    return null;
  }
}
