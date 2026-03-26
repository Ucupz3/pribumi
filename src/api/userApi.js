const BASE_URL = "https://nusa-api.vercel.app";

export async function getUserProfile() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data user");
    }

    return await res.json();
  } catch (err) {
    console.error("User error:", err);
    return null;
  }
}

export async function updateUserProfile(payload) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal update profile");
    }

    return await res.json();
  } catch (err) {
    console.error("Update error:", err);
    return null;
  }
}