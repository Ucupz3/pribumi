const BASE_URL = "https://nusa-api.vercel.app";

// Mapping response backend → shape yang dipakai Akun.jsx
function mapUser(raw) {
  return {
    nama: raw.username, // username  → nama
    avatar: raw.avatarUrl ?? "/images/ppcowo.jpeg", // avatarUrl → avatar (fallback ke default)
    xp: raw.totalXp ?? raw.xp ?? 0, // totalXp / xp → xp
    xpMax: raw.xpMax ?? 20000, // xpMax atau default
    level: raw.level ?? 1,
    email: raw.email,
    id: raw.id,
  };
}

export async function getUserProfile() {
  try {
    // FIX 1: Key token disamakan dengan yang disimpan saat login → "access_token"
    const token = localStorage.getItem("access_token");

    if (!token) throw new Error("NO_TOKEN");

    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return null;
    }

    if (!res.ok) throw new Error("Gagal mengambil data user");

    const json = await res.json();

    // FIX 2: Unwrap response { success, message, data: { ... } }
    return mapUser(json.data);
  } catch (err) {
    console.error("User error:", err);
    return null;
  }
}

export async function updateUserProfile(payload) {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) throw new Error("NO_TOKEN");

    // FIX 3: Sesuaikan field dengan updateProfileSchema backend
    // Backend expects: { username?, avatar_url? }
    // Akun.jsx mengirim: { nama, avatar }
    const body = {};
    if (payload.nama) body.username = payload.nama;
    if (payload.avatar) body.avatar_url = payload.avatar;

    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Gagal update profile");

    const json = await res.json();

    // FIX 4: Unwrap dan mapping response sebelum dikembalikan ke Akun.jsx
    return mapUser(json.data);
  } catch (err) {
    console.error("Update error:", err);
    throw err; // Re-throw agar EditPopup bisa tangkap error
  }
}
