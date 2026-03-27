const BASE_URL = "https://nusa-api.vercel.app";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

// ── START SESSION ────────────────────────────────────────────
export async function startSession(markerId) {
  const res = await fetch(`${BASE_URL}/gameplay/sessions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ marker_id: markerId }),
  });

  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }

  if (res.status === 409) {
    throw new Error("SESSION_ACTIVE");
  }

  if (!res.ok) {
    throw new Error(json.message || "Gagal memulai sesi");
  }

  // Normalisasi agar sessionId selalu ada
  return {
    ...json.data,
    sessionId: json.data?.id || json.data?.sessionId
  };
}

// ── GET ACTIVE SESSION ───────────────────────────────────────
export async function getActiveSession(markerId) {
  try {
    const res = await fetch(
      `${BASE_URL}/gameplay/sessions/active/${markerId}`,
      { headers: authHeaders() }
    );

    if (res.status === 404) return null;

    const json = await res.json();
    if (!json.data) return null;

    // Pastikan formatnya sama dengan startSession
    return {
      ...json.data,
      sessionId: json.data.id || json.data.sessionId
    };
  } catch (err) {
    console.error("getActiveSession error:", err);
    return null;
  }
}

// ── SUBMIT SESSION ───────────────────────────────────────────
export async function submitSession(sessionId, answers, timeSpentSec) {
  const res = await fetch(`${BASE_URL}/gameplay/sessions/${sessionId}/submit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      answers,
      time_spent_sec: timeSpentSec,
    }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Gagal submit jawaban");
  }

  return json.data;
}

// ── END SESSION ──────────────────────────────────────────────
export async function endSession(sessionId) {
  if (!sessionId) return true;
  const res = await fetch(`${BASE_URL}/gameplay/sessions/${sessionId}/end`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Gagal mengakhiri session");
  }

  return true;
}