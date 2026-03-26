import { useState, useEffect } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

const getToken = () => localStorage.getItem("token");

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "API Error");
  }

  return res.json();
};

// ─── API Functions ─────────────────────────────────────────────────────────────
const fetchMe = () => apiFetch("/auth/me");
const fetchLeaderboard = () => apiFetch("/users/leaderboard");
const fetchDailyQuiz = () => apiFetch("/api/daily/quiz");
const fetchWeeklyTasks = () => apiFetch("/api/daily/tasks");

const submitDailyQuiz = (selectedOptionId) =>
  apiFetch("/api/daily/quiz/submit", {
    method: "POST",
    body: JSON.stringify({ selected_option_id: selectedOptionId }),
  });

const claimWeeklyTask = (userWeeklyTaskId) =>
  apiFetch(`/api/daily/tasks/${userWeeklyTaskId}/claim`, { method: "POST" });

// ─── Styles ───────────────────────────────────────────────────────────────────
const bgPaper = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

// ─── Task icon mapping ────────────────────────────────────────────────────────
const TASK_ICONS = {
  complete_levels: "🗺️",
  perfect_score: "⭐",
  login_streak: "🔥",
  collect_xp: "⚡",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Beranda() {
  // User / profil
  const [user, setUser] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // Quiz
  const [quizData, setQuizData] = useState(null);
  const [quizLoading, setQuizLoading] = useState(true);
  const [quizError, setQuizError] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tasks
  const [tasksData, setTasksData] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);
  const [claimAnim, setClaimAnim] = useState(null);

  // ── Fetch profil + rank ──────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([fetchMe(), fetchLeaderboard()])
      .then(([meData, leaderboardData]) => {
        setUser(meData);

        // Cari rank user di leaderboard
        // Sesuaikan jika response-nya { data: [...] } atau langsung array
        const list = Array.isArray(leaderboardData)
          ? leaderboardData
          : (leaderboardData.data ?? []);

        const idx = list.findIndex(
          (entry) => entry.id === meData.id || entry.userId === meData.id,
        );
        setUserRank(idx !== -1 ? idx + 1 : null);
      })
      .catch((e) => setProfileError(e.message))
      .finally(() => setProfileLoading(false));
  }, []);

  // ── Fetch quiz harian ────────────────────────────────────────────────────
  useEffect(() => {
    fetchDailyQuiz()
      .then((d) => {
        setQuizData(d);
        if (d.result?.selectedOptionId) {
          setSelectedOptionId(d.result.selectedOptionId);
        }
      })
      .catch((e) => setQuizError(e.message))
      .finally(() => setQuizLoading(false));
  }, []);

  // ── Fetch weekly tasks ───────────────────────────────────────────────────
  useEffect(() => {
    fetchWeeklyTasks()
      .then(setTasksData)
      .catch((e) => setTasksError(e.message))
      .finally(() => setTasksLoading(false));
  }, []);

  // ── Handler: submit jawaban quiz ─────────────────────────────────────────
  const handleJawabQuiz = async (option) => {
    if (!quizData || quizData.isAnswered || isSubmitting) return;
    setSelectedOptionId(option.id);
    setIsSubmitting(true);
    try {
      const result = await submitDailyQuiz(option.id);
      setSubmitResult(result);
      setQuizData((prev) =>
        prev
          ? {
              ...prev,
              isAnswered: true,
              result: {
                isCorrect: result.isCorrect,
                xpGained: result.xpGained,
                selectedOptionId: option.id,
                answeredAt: new Date().toISOString(),
              },
              quiz: { ...prev.quiz, explanation: result.explanation },
            }
          : prev,
      );
      // Refresh tasks & profil karena XP berubah
      fetchWeeklyTasks()
        .then(setTasksData)
        .catch(() => {});
      fetchMe()
        .then(setUser)
        .catch(() => {});
    } catch (e) {
      setQuizError(e?.message ?? "Gagal submit jawaban");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Handler: klaim XP task ───────────────────────────────────────────────
  const handleClaim = async (userWeeklyTaskId) => {
    setClaimAnim(userWeeklyTaskId);
    try {
      await claimWeeklyTask(userWeeklyTaskId);
      setTasksData((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) =>
                t.id === userWeeklyTaskId ? { ...t, xpClaimed: true } : t,
              ),
            }
          : prev,
      );
      fetchMe()
        .then(setUser)
        .catch(() => {});
    } catch (e) {
      alert(e?.message ?? "Gagal klaim XP");
    } finally {
      setClaimAnim(null);
    }
  };

  // ── Derived values ───────────────────────────────────────────────────────
  const isQuizAnswered = quizData?.isAnswered ?? false;
  const correctOptionId = submitResult?.correctOptionId ?? null;

  const xp = user?.totalXp ?? user?.xp ?? 0;
  const xpMax = user?.xpToNextLevel ?? user?.xpMax ?? user?.nextLevelXp ?? 1000;
  const xpPersen = Math.min((xp / xpMax) * 100, 100);
  const totalQuestSelesai =
    user?.totalQuestCompleted ??
    user?.questCompleted ??
    user?.totalQuestSelesai ??
    0;
  const xpHariIni = user?.xpToday ?? user?.dailyXp ?? user?.xpHariIni ?? 0;

  // ── Full page loading ────────────────────────────────────────────────────
  if (profileLoading && quizLoading && tasksLoading) {
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

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div
      className="h-screen lg:overflow-hidden overflow-auto flex flex-col font-lora"
      style={bgPaper}
    >
      {/* ── Bagian Atas (banner) ── */}
      <div
        className="w-full shadow-lg flex-shrink-0 h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[40vh]"
        style={{
          backgroundImage: "url('/images/bgfix.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* ── Bagian Bawah ── */}
      <div className="flex-1 px-6 md:px-12 py-6 lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* ══ KIRI — Card Profil ══════════════════════════════════════════ */}
          <div
            className="border-2 border-[#c9b896] rounded-2xl overflow-hidden shadow-md flex flex-col"
            style={bgPaper}
          >
            {/* Header avatar + nama */}
            <div className="px-6 py-4 border-b-2 border-[#c9b896] flex items-center gap-4 flex-shrink-0">
              <div className="w-14 h-14 rounded-xl border-2 border-[#BD9B2C] overflow-hidden flex-shrink-0 shadow">
                {profileLoading ? (
                  <div className="w-full h-full bg-[#e8dcc0] animate-pulse" />
                ) : user?.avatar || user?.avatarUrl ? (
                  <img
                    src={user.avatar ?? user.avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#e8dcc0] flex items-center justify-center text-[#5c4033] font-black text-2xl">
                    {(user?.name ?? user?.nama ?? "?").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                {profileLoading ? (
                  <>
                    <div className="h-4 w-28 bg-[#e8dcc0] rounded animate-pulse mb-2" />
                    <div className="h-3 w-16 bg-[#e8dcc0] rounded animate-pulse" />
                  </>
                ) : profileError ? (
                  <p className="text-[#8b3a3a] text-sm">
                    ⚠️ Gagal memuat profil
                  </p>
                ) : (
                  <>
                    <p className="text-[#5c4033] font-black text-lg">
                      {user?.name ?? user?.nama ?? "—"}
                    </p>
                    <p className="text-[#a08060] text-sm">
                      Level {user?.level ?? "—"}
                    </p>
                  </>
                )}
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
                    {profileLoading
                      ? "..."
                      : `${xp.toLocaleString("id-ID")} / ${xpMax.toLocaleString("id-ID")}`}
                  </span>
                </div>
                <div className="w-full h-4 bg-[#e8dcc0] rounded-full border border-[#c9b896] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#81691A] to-[#BD9B2C] rounded-full transition-all duration-700"
                    style={{ width: profileLoading ? "0%" : `${xpPersen}%` }}
                  />
                </div>
              </div>

              {/* Grid stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#BD9B2C] font-black text-xl">
                    {profileLoading ? "..." : `+${xpHariIni}`}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">
                    XP Hari Ini
                  </p>
                </div>
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#5c4033] font-black text-xl">
                    {profileLoading ? "..." : totalQuestSelesai}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">
                    Quest Selesai
                  </p>
                </div>
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#5c4033] font-black text-xl">
                    {profileLoading ? "..." : userRank ? `#${userRank}` : "—"}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">Peringkat</p>
                </div>
              </div>
            </div>
          </div>

          {/* ══ KANAN ═══════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* Quiz Harian */}
            <div
              className="border-2 border-[#c9b896] rounded-2xl overflow-hidden shadow-md relative flex-shrink-0"
              style={bgPaper}
            >
              <div className="px-5 py-3 border-b-2 border-[#c9b896] flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[#5c4033] font-black text-base">
                    Quiz Harian ⚡
                  </p>
                  <p className="text-[#a08060] text-xs">
                    +{quizData?.xpReward ?? 20} XP · Ganti tiap hari
                  </p>
                </div>
                {isQuizAnswered && (
                  <span className="bg-[#4a7c59]/20 text-[#4a7c59] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#4a7c59]/30">
                    ✅ Selesai
                  </span>
                )}
              </div>

              <div className="px-5 py-3 space-y-3 relative">
                {quizLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-[3px] border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : quizError ? (
                  <p className="text-center text-[#8b3a3a] text-xs py-6">
                    ⚠️ {quizError}
                  </p>
                ) : quizData ? (
                  <>
                    <p className="text-[#5c4033] font-semibold text-sm leading-snug">
                      {quizData.quiz.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {quizData.quiz.options.map((opt, i) => {
                        const huruf = ["A", "B", "C", "D"][i];
                        const isSelected = selectedOptionId === opt.id;
                        const isBenar = correctOptionId
                          ? opt.id === correctOptionId
                          : false;

                        let borderStyle = "border-[#c9b896] text-[#5c4033]";
                        let hurufBg = "bg-[#e8dcc0] text-[#a08060]";

                        if (isQuizAnswered) {
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
                            onClick={() => handleJawabQuiz(opt)}
                            disabled={isQuizAnswered || isSubmitting}
                            style={!isQuizAnswered ? bgPaper : {}}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${borderStyle} ${
                              !isQuizAnswered && !isSubmitting
                                ? "hover:border-[#BD9B2C] cursor-pointer"
                                : "cursor-default"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${hurufBg}`}
                            >
                              {isSubmitting && isSelected ? (
                                <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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

                    {/* Overlay selesai */}
                    {isQuizAnswered && (
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-b-2xl"
                        style={{
                          ...bgPaper,
                          backgroundColor: "rgba(255,255,255,0.88)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <span className="text-3xl">🎉</span>
                        <p className="text-[#5c4033] font-black text-sm">
                          Quiz Selesai!
                        </p>
                        <p className="text-[#a08060] text-xs text-center px-4">
                          Kembali lagi besok!
                        </p>
                        {quizData.result && (
                          <p
                            className={`text-xs font-bold mt-0.5 ${quizData.result.isCorrect ? "text-[#4a7c59]" : "text-[#8b3a3a]"}`}
                          >
                            {quizData.result.isCorrect
                              ? `✅ Benar! +${quizData.result.xpGained} XP`
                              : `❌ Jawaban salah · +${quizData.result.xpGained} XP`}
                          </p>
                        )}
                        {quizData.quiz.explanation && (
                          <p className="text-[#a08060] text-[11px] text-center px-6 mt-1 italic">
                            💡 {quizData.quiz.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : null}
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
                    Ganti tiap 7 hari · Klaim XP-mu!
                  </p>
                </div>
                {tasksData && (
                  <span className="bg-[#BD9B2C]/20 text-[#81691A] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#BD9B2C]/40">
                    {tasksData.tasks.filter((t) => t.xpClaimed).length}/
                    {tasksData.tasks.length} Selesai
                  </span>
                )}
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
                {tasksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-[3px] border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : tasksError ? (
                  <p className="text-center text-[#8b3a3a] text-xs py-6">
                    ⚠️ {tasksError}
                  </p>
                ) : !tasksData?.tasks.length ? (
                  <p className="text-center text-[#a08060] text-xs py-6">
                    Tidak ada task tersedia minggu ini.
                  </p>
                ) : (
                  tasksData.tasks.map((task) => {
                    const persen = task.progressPercent;
                    const isFull = task.isCompleted;
                    const isClaimed = task.xpClaimed;
                    const isAnimating = claimAnim === task.id;
                    const icon = TASK_ICONS[task.type] ?? "🎯";

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
                            className={`text-2xl flex-shrink-0 ${isClaimed ? "grayscale" : ""}`}
                          >
                            {icon}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p
                                className={`font-black text-sm truncate ${isClaimed ? "text-[#a08060] line-through" : "text-[#5c4033]"}`}
                              >
                                {task.title}
                              </p>
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${isClaimed ? "bg-[#4a7c59]/20 text-[#4a7c59]" : "bg-[#BD9B2C]/20 text-[#81691A]"}`}
                              >
                                +{task.xpReward} XP
                              </span>
                            </div>
                            <p className="text-[#a08060] text-xs mb-2">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-[#a08060] text-[10px] flex-shrink-0">
                                {task.currentValue}/{task.targetValue}
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
                                disabled={isAnimating}
                                className={`px-3 py-2 rounded-xl font-black text-xs bg-gradient-to-r from-[#BD9B2C] to-[#81691A] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-1 ${isAnimating ? "scale-95 opacity-75" : ""}`}
                              >
                                {isAnimating ? (
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <>⚡ Klaim</>
                                )}
                              </button>
                            ) : (
                              <span className="text-[#b8a88a] text-xs font-semibold whitespace-nowrap">
                                {task.targetValue - task.currentValue} lagi
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
