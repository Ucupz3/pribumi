import { useState, useEffect } from "react";

// ── Konstanta ────────────────────────────────────────────────
const BASE_URL = "https://nusa-api.vercel.app";

// XP yang dibutuhkan per level (sesuaikan dengan fungsi calculateLevel di backend)
// Rumus umum: level N butuh N * 500 XP (sesuaikan jika berbeda)
const getXpForLevel = (level) => level * 500;

// ── API Helper ───────────────────────────────────────────────
const apiFetch = async (path, options = {}) => {
  // Ambil access_token dari localStorage
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  // Jika 401, coba refresh token
  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (!refreshed) throw new Error("UNAUTHORIZED");

    // Ulangi request dengan token baru
    const newToken = localStorage.getItem("access_token");
    const retryRes = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
        ...(options.headers ?? {}),
      },
    });
    return retryRes.json();
  }

  return res.json();
};

// ── Refresh token helper ─────────────────────────────────────
const tryRefreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    const json = await res.json();
    if (json.success) {
      localStorage.setItem("access_token", json.data.access_token);
      localStorage.setItem("refresh_token", json.data.refresh_token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// ── Fetch semua data beranda secara paralel ──────────────────
const getBerandaData = async () => {
  const [meRes, quizRes, tasksRes] = await Promise.all([
    apiFetch("/auth/me"),
    apiFetch("/daily/quiz"),
    apiFetch("/daily/weekly-tasks"),
  ]);

  if (!meRes.success) throw new Error("Gagal mengambil data user");
  if (!quizRes.success) throw new Error("Gagal mengambil quiz harian");
  if (!tasksRes.success) throw new Error("Gagal mengambil weekly tasks");

  const user = meRes.data;
  const quizData = quizRes.data;
  const tasksData = tasksRes.data;

  // ── Mapping user ──────────────────────────────────────────
  // Backend tidak mengembalikan xpMax, kita hitung dari level
  const xpMax = getXpForLevel(user.level + 1);

  const mappedUser = {
    nama: user.username,
    avatar: user.avatarUrl ?? null,
    level: user.level,
    xp: user.totalXp,
    xpMax,
    // xpHariIni tidak tersedia di /auth/me, bisa dari history quiz jika dibutuhkan
    xpHariIni: 0,
    // totalQuestSelesai & rank tidak tersedia di endpoint ini
    // Bisa ditambahkan dari /users/me/progress jika dibutuhkan
    totalQuestSelesai: 0,
    rank: null,
  };

  // ── Mapping quiz harian ───────────────────────────────────
  // API: quiz.options = [{ id, optionText, orderIndex }]
  // Frontend butuh: pilihan = string[], jawaban = string (hanya diketahui setelah menjawab)
  const mappedQuiz = {
    id: quizData.quiz.id,
    pertanyaan: quizData.quiz.question,
    type: quizData.quiz.type,
    // Mapping options ke format yang dipakai UI
    options: quizData.quiz.options, // [{ id, optionText }]
    pilihan: quizData.quiz.options.map((o) => o.optionText),
    xpReward: quizData.xpReward,
    sudahDikerjakan: quizData.isAnswered,
    // Jawaban yang benar: hanya tersedia via correctOptionId setelah submit,
    // atau bisa dicari dari options jika sudah menjawab (backend tidak expose isCorrect di options)
    jawabanBenarOptionId: quizData.result?.correctOptionId ?? null,
    // Hasil jawaban user (jika sudah menjawab)
    result: quizData.result ?? null,
    explanation: quizData.quiz.explanation ?? null,
  };

  // ── Mapping weekly tasks ──────────────────────────────────
  // API: { id, taskId, title, description, type, targetValue, currentValue,
  //         progressPercent, isCompleted, xpReward, xpClaimed, completedAt }
  const TASK_ICONS = {
    complete_levels: "🗺️",
    perfect_score: "⭐",
    login_streak: "🔥",
    collect_xp: "⚡",
  };

  const mappedTasks = tasksData.tasks.map((t) => ({
    id: t.id, // userWeeklyTask id (dipakai untuk claim)
    taskId: t.taskId,
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

  return { user: mappedUser, quizHarian: mappedQuiz, tasks: mappedTasks };
};

// ── Background style ─────────────────────────────────────────
const bgPaper = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

// ── Komponen utama ────────────────────────────────────────────
export default function Beranda() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quiz
  const [quizSelectedOptionId, setQuizSelectedOptionId] = useState(null);
  const [quizSudahJawab, setQuizSudahJawab] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // { isCorrect, xpGained, correctOptionId }
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // State tasks
  const [tasks, setTasks] = useState([]);
  const [claimAnim, setClaimAnim] = useState(null);

  useEffect(() => {
    getBerandaData()
      .then((d) => {
        setData(d);
        setTasks(d.tasks);
        setQuizSudahJawab(d.quizHarian.sudahDikerjakan);
        // Jika sudah dijawab sebelumnya, restore result dari API
        if (d.quizHarian.result) {
          setQuizSelectedOptionId(d.quizHarian.result.selectedOptionId);
          setQuizResult({
            isCorrect: d.quizHarian.result.isCorrect,
            xpGained: d.quizHarian.result.xpGained,
            correctOptionId: d.quizHarian.jawabanBenarOptionId,
          });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading state ────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-lora"
        style={bgPaper}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#5c4033] font-semibold">Memuat Beranda...</p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-lora"
        style={bgPaper}
      >
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <span className="text-4xl">😕</span>
          <p className="text-[#5c4033] font-black text-base">
            Gagal memuat data
          </p>
          <p className="text-[#a08060] text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-gradient-to-r from-[#BD9B2C] to-[#81691A] text-white rounded-xl font-bold text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const { user, quizHarian } = data;
  const xpPersen = Math.min((user.xp / user.xpMax) * 100, 100);

  // ── Submit jawaban quiz ke API ────────────────────────────
  const handleJawabQuiz = async (optionId) => {
    if (quizSudahJawab || quizSubmitting) return;

    setQuizSelectedOptionId(optionId);
    setQuizSubmitting(true);

    try {
      const res = await apiFetch("/daily/quiz/submit", {
        method: "POST",
        body: JSON.stringify({ selected_option_id: optionId }),
      });

      if (res.success) {
        setQuizResult({
          isCorrect: res.data.isCorrect,
          xpGained: res.data.xpGained,
          correctOptionId: res.data.correctOptionId,
        });
        setQuizSudahJawab(true);

        // Update XP user di state langsung tanpa re-fetch
        setData((prev) => {
          const newXp = prev.user.xp + res.data.xpGained;
          const newLevel = Math.floor(newXp / 500); // sesuaikan dengan calculateLevel backend
          const newXpMax = getXpForLevel(newLevel + 1);
          return {
            ...prev,
            user: {
              ...prev.user,
              xp: newXp,
              level: newLevel,
              xpMax: newXpMax,
            },
          };
        });
      } else if (res.message?.includes("sudah menjawab")) {
        // Edge case: sudah dijawab (race condition)
        setQuizSudahJawab(true);
      }
    } catch {
      // Jika gagal, reset pilihan agar user bisa coba lagi
      setQuizSelectedOptionId(null);
    } finally {
      setQuizSubmitting(false);
    }
  };

  // ── Klaim XP task ke API ──────────────────────────────────
  const handleClaim = async (taskId) => {
    setClaimAnim(taskId);

    try {
      const res = await apiFetch(`/daily/weekly-tasks/${taskId}/claim`, {
        method: "POST",
      });

      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, sudahClaim: true } : t)),
        );

        // Update XP user di state langsung tanpa re-fetch
        setData((prev) => {
          const newXp = res.data.newTotalXp;
          const newLevel = Math.floor(newXp / 500); // sesuaikan dengan calculateLevel backend
          const newXpMax = getXpForLevel(newLevel + 1);
          return {
            ...prev,
            user: {
              ...prev.user,
              xp: newXp,
              level: newLevel,
              xpMax: newXpMax,
            },
          };
        });
      }
    } catch {
      // Silent fail — bisa ditambahkan toast notification
    } finally {
      setTimeout(() => setClaimAnim(null), 600);
    }
  };

  return (
    <div
      className="h-screen lg:overflow-hidden overflow-auto flex flex-col font-lora"
      style={bgPaper}
    >
      {/* ===== BAGIAN ATAS ===== */}
      <div
        className="w-full shadow-lg flex-shrink-0 h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[40vh]"
        style={{
          backgroundImage: "url('/images/bgfix.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ===== BAGIAN BAWAH ===== */}
      <div className="flex-1 px-6 md:px-12 py-6 lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* ===== KIRI — Card Profil ===== */}
          <div
            className="border-2 border-[#c9b896] rounded-2xl overflow-hidden shadow-md flex flex-col"
            style={bgPaper}
          >
            {/* Header avatar + nama */}
            <div className="px-6 py-4 border-b-2 border-[#c9b896] flex items-center gap-4 flex-shrink-0">
              <div className="w-14 h-14 rounded-xl border-2 border-[#BD9B2C] overflow-hidden flex-shrink-0 shadow">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e8dcc0] flex items-center justify-center text-[#5c4033] font-black text-2xl">
                    {user.nama.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[#5c4033] font-black text-lg">{user.nama}</p>
                <p className="text-[#a08060] text-sm">Level {user.level}</p>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4 flex-1">
              {/* XP Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-[#5c4033] text-sm font-bold">
                    XP Total
                  </span>
                  <span className="text-[#a08060] text-xs font-semibold">
                    {user.xp.toLocaleString("id-ID")} /{" "}
                    {user.xpMax.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="w-full h-4 bg-[#e8dcc0] rounded-full border border-[#c9b896] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#81691A] to-[#BD9B2C] rounded-full transition-all duration-700"
                    style={{ width: `${xpPersen}%` }}
                  />
                </div>
              </div>

              {/* Grid stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#BD9B2C] font-black text-xl">
                    {user.xp.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">Total XP</p>
                </div>
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#5c4033] font-black text-xl">
                    {tasks.filter((t) => t.sudahClaim).length}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">
                    Task Diklaim
                  </p>
                </div>
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#5c4033] font-black text-xl">
                    Lv.{user.level}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== KANAN ===== */}
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Quiz Harian */}
            <div
              className="border-2 border-[#c9b896] rounded-2xl overflow-hidden shadow-md flex flex-col"
              style={bgPaper}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-5 lg:py-6 py-3 border-b-2 border-[#c9b896]">
                <div>
                  <p className="text-[#5c4033] font-black text-base">
                    Quiz Harian ⚡
                  </p>
                  <p className="text-[#a08060] text-xs">
                    +{quizHarian.xpReward} XP · Update tiap hari
                  </p>
                </div>

                {quizSudahJawab && (
                  <span className="bg-[#4a7c59]/20 text-[#4a7c59] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#4a7c59]/30">
                    ✅ Selesai
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div className="px-5 py-6 space-y-2 relative">
                <p className="text-[#5c4033] font-semibold text-sm leading-snug">
                  {quizHarian.pertanyaan}
                </p>

                {/* OPTIONS */}
                <div className="grid grid-cols-2 gap-3">
                  {quizHarian.options.map((opt, i) => {
                    const huruf = ["A", "B", "C", "D"][i];
                    const isSelected = quizSelectedOptionId === opt.id;
                    const isBenar = quizResult?.correctOptionId === opt.id;

                    let borderStyle = "border-[#c9b896] text-[#5c4033]";
                    let hurufBg = "bg-[#e8dcc0] text-[#a08060]";

                    if (quizSudahJawab) {
                      if (isBenar) {
                        borderStyle =
                          "border-[#4a7c59] bg-[#4a7c59]/10 text-[#4a7c59]";
                        hurufBg = "bg-[#4a7c59] text-white";
                      } else if (isSelected) {
                        borderStyle =
                          "border-[#8b3a3a] bg-[#8b3a3a]/10 text-[#8b3a3a]";
                        hurufBg = "bg-[#8b3a3a] text-white";
                      } else {
                        borderStyle = "border-[#c9b896] text-[#a08060]";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleJawabQuiz(opt.id)}
                        disabled={quizSudahJawab || quizSubmitting}
                        style={!quizSudahJawab ? bgPaper : {}}
                        className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${borderStyle} ${
                          !quizSudahJawab && !quizSubmitting
                            ? "hover:border-[#BD9B2C] cursor-pointer"
                            : "cursor-default"
                        } ${quizSubmitting && isSelected ? "opacity-60" : ""}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${hurufBg}`}
                        >
                          {quizSubmitting && isSelected ? (
                            <div className="w-2.5 h-2.5 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            huruf
                          )}
                        </span>

                        <span className="text-left leading-tight">
                          {opt.optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* OVERLAY */}
              {quizSudahJawab && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1.5 px-4 rounded-b-2xl"
                  style={{
                    ...bgPaper,
                    backgroundColor: "rgba(255,255,255,0.9)"
                  }}
                >
                  <span className="text-2xl">🎉</span>

                  <p className="text-[#5c4033] font-black text-sm leading-tight">
                    Quiz Selesai!
                  </p>

                  <p className="text-[#a08060] text-[11px] leading-tight">
                    Kembali lagi besok!
                  </p>

                  {quizResult && (
                    <p
                      className={`text-[11px] font-bold ${
                        quizResult.isCorrect
                          ? "text-[#4a7c59]"
                          : "text-[#8b3a3a]"
                      }`}
                    >
                      {quizResult.isCorrect
                        ? `✅ Benar! +${quizResult.xpGained} XP`
                        : `❌ Jawaban salah · +${quizResult.xpGained} XP partisipasi`}
                    </p>
                  )}
                </div>
              )}
              </div>
            </div>

            {/* Task Mingguan */}
            <div
              className="border-2 border-[#c9b896] rounded-2xl overflow-hidden shadow-md flex flex-col flex-1 min-h-0"
              style={bgPaper}
            >
              <div className="px-5 py-3 border-b-2 border-[#c9b896] flex items-center justify-between flex-shrink-0">
                <div>
                  <p className="text-[#5c4033] font-black text-base">
                    Task Mingguan 🎯
                  </p>
                  <p className="text-[#a08060] text-xs">
                    Mingguan · Klaim XP sekarang!
                  </p>
                </div>
                <span className="bg-[#BD9B2C]/20 text-[#81691A] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#BD9B2C]/40">
                  {tasks.filter((t) => t.sudahClaim).length}/{tasks.length}{" "}
                  Selesai
                </span>
              </div>

              <div
                className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-[#e8dcc0]
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#BD9B2C]
                [&::-webkit-scrollbar-thumb:hover]:bg-[#81691A]"
              >
                {tasks.map((task) => {
                  const persen = task.progressPercent;
                  const isFull = task.isCompleted;
                  const isClaimed = task.sudahClaim;
                  const isAnimating = claimAnim === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`border-2 rounded-2xl px-4 py-3 transition-all duration-300 ${
                        isClaimed
                          ? "border-[#4a7c59]/40 opacity-60"
                          : isFull
                            ? "border-[#BD9B2C] shadow-md shadow-[#BD9B2C]/20"
                            : "border-[#c9b896]"
                      }`}
                      style={bgPaper}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-2xl flex-shrink-0 ${
                            isClaimed ? "grayscale" : ""
                          }`}
                        >
                          {task.icon}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p
                              className={`font-black text-sm truncate ${
                                isClaimed
                                  ? "text-[#a08060] line-through"
                                  : "text-[#5c4033]"
                              }`}
                            >
                              {task.judul}
                            </p>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${
                                isClaimed
                                  ? "bg-[#4a7c59]/20 text-[#4a7c59]"
                                  : "bg-[#BD9B2C]/20 text-[#81691A]"
                              }`}
                            >
                              +{task.xpReward} XP
                            </span>
                          </div>
                          <p className="text-[#a08060] text-xs mb-2">
                            {task.deskripsi}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-[#a08060] text-[10px] flex-shrink-0">
                              {task.progress}/{task.target}
                            </span>
                            <div className="flex-1 h-2.5 bg-[#e8dcc0] rounded-full border border-[#c9b896] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  isClaimed
                                    ? "bg-[#4a7c59]"
                                    : isFull
                                      ? "bg-gradient-to-r from-[#BD9B2C] to-[#81691A]"
                                      : "bg-gradient-to-r from-[#c9b896] to-[#a08060]"
                                }`}
                                style={{ width: `${persen}%` }}
                              />
                            </div>
                            <span className="text-[#5c4033] text-[10px] font-bold flex-shrink-0">
                              {persen}%
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-2">
                          {isClaimed ? (
                            <span className="text-[#4a7c59] text-xl">✅</span>
                          ) : isFull ? (
                            <button
                              onClick={() => handleClaim(task.id)}
                              className={`px-3 py-2 rounded-xl font-black text-xs bg-gradient-to-r from-[#BD9B2C] to-[#81691A] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1 ${
                                isAnimating ? "scale-95 opacity-75" : ""
                              }`}
                            >
                              {isAnimating ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>⚡ Klaim</>
                              )}
                            </button>
                          ) : (
                            <span className="text-[#b8a88a] text-xs font-semibold whitespace-nowrap">
                              {task.target - task.progress} lagi
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}