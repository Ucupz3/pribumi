const BASE_URL = "https://nusa-api.vercel.app";

const getXpForLevel = (level) => level * 500;

let refreshTokenPromise = null;
let berandaFetchPromise = null;
let meFetchPromise = null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const clearBerandaCache = () => {
  berandaFetchPromise = null;
  meFetchPromise = null;
};

const tryRefreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return false;
  if (refreshTokenPromise) return await refreshTokenPromise;

  refreshTokenPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
      });

      if (!res.ok) return false;

      const json = await res.json();

      if (json.success) {
        localStorage.setItem("access_token", json.data.access_token);
        localStorage.setItem("refresh_token", json.data.refresh_token);
        return true;
      }

      return false;
    } catch {
      return false;
    } finally {
      refreshTokenPromise = null;
    }
  })();

  return await refreshTokenPromise;
};

export const apiFetch = async (path, options = {}, retries = 3) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Token tidak ditemukan");
  }

  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 429 && retries > 0) {
    const waitMs = 1000 * (4 - retries);
    await delay(Math.max(waitMs, 1000));
    return apiFetch(path, options, retries - 1);
  }

  if (res.status === 401) {
    const refreshed = await tryRefreshToken();

    if (!refreshed) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Sesi habis");
    }

    const newToken = localStorage.getItem("access_token");

    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
        ...(options.headers ?? {}),
      },
    });
  }

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Request gagal");
  }

  return data;
};

export const getMe = async () => {
  if (meFetchPromise) return await meFetchPromise;

  meFetchPromise = (async () => {
    try {
      const res = await apiFetch("/auth/me");
      localStorage.setItem("user_id", res.data.id);
      return res.data;
    } finally {
      setTimeout(() => {
        meFetchPromise = null;
      }, 2000);
    }
  })();

  return await meFetchPromise;
};

const TASK_ICONS = {
  complete_levels: "🗺️",
  perfect_score: "⭐",
  login_streak: "🔥",
  collect_xp: "⚡",
};

export const getBerandaData = async () => {
  if (berandaFetchPromise) return await berandaFetchPromise;

  berandaFetchPromise = (async () => {
    try {
      const [meRes, quizRes, tasksRes] = await Promise.all([
        apiFetch("/auth/me"),
        apiFetch("/daily/quiz"),
        apiFetch("/daily/weekly-tasks"),
      ]);

      localStorage.setItem("user_id", meRes.data.id);

      const user = meRes.data;
      const quizData = quizRes.data;
      const tasksData = tasksRes.data;

      const xpMax = getXpForLevel(user.level + 1);

      const mappedUser = {
        nama: user.username,
        avatar: user.avatarUrl ?? null,
        level: user.level,
        xp: user.totalXp,
        xpMax,
      };

      const mappedQuiz = {
        id: quizData.quiz.id,
        pertanyaan: quizData.quiz.question,
        type: quizData.quiz.type,
        options: quizData.quiz.options,
        xpReward: quizData.xpReward,
        sudahDikerjakan: quizData.isAnswered,
        jawabanBenarOptionId: quizData.result?.correctOptionId ?? null,
        result: quizData.result ?? null,
      };

      const mappedTasks = tasksData.tasks.map((t) => ({
        id: t.id,
        icon: TASK_ICONS[t.type] ?? "🎯",
        judul: t.title,
        deskripsi: t.description,
        xpReward: t.xpReward,
        progress: t.currentValue,
        target: t.targetValue,
        sudahClaim: t.xpClaimed,
        isCompleted: t.isCompleted,
        progressPercent: t.progressPercent,
      }));

      return {
        user: mappedUser,
        quizHarian: mappedQuiz,
        tasks: mappedTasks,
      };
    } catch (err) {
      berandaFetchPromise = null;
      throw err;
    }
  })();

  return await berandaFetchPromise;
};

export { getXpForLevel };