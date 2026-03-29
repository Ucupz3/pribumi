import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBerandaData, apiFetch, getXpForLevel } from "../api/berandaApi";

const bgPaper = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

export default function Beranda() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quizSelectedOptionId, setQuizSelectedOptionId] = useState(null);
  const [quizSudahJawab, setQuizSudahJawab] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [claimAnim, setClaimAnim] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getBerandaData()
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setTasks(d.tasks);
        setQuizSudahJawab(d.quizHarian.sudahDikerjakan);
        window.dispatchEvent(new CustomEvent("updateXP", { detail: d.user }));
        if (d.quizHarian.result) {
          setQuizSelectedOptionId(d.quizHarian.result.selectedOptionId);
          setQuizResult({
            isCorrect: d.quizHarian.result.isCorrect,
            xpGained: d.quizHarian.result.xpGained,
            correctOptionId: d.quizHarian.jawabanBenarOptionId,
          });
        }
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              navigate("/login", { replace: true });
            }}
            className="text-xs text-[#a08060] underline underline-offset-2 hover:text-[#8b3a3a] transition-colors"
          >
            Atau coba logout dan masuk kembali
          </button>
        </div>
      </div>
    );
  }

  const { user, quizHarian } = data;
  const xpPersen = Math.min((user.xp / user.xpMax) * 100, 100);

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

        setData((prev) => {
          const newXp = prev.user.xp + res.data.xpGained;
          const newLevel = Math.floor(newXp / 500);
          const newXpMax = getXpForLevel(newLevel + 1);
          const updatedUser = { ...prev.user, xp: newXp, level: newLevel, xpMax: newXpMax };
          window.dispatchEvent(new CustomEvent("updateXP", { detail: updatedUser }));
          return { ...prev, user: updatedUser };
        });
      } else if (res.message?.includes("sudah menjawab")) {
        setQuizSudahJawab(true);
      }
    } catch {
      setQuizSelectedOptionId(null);
    } finally {
      setQuizSubmitting(false);
    }
  };

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

        setData((prev) => {
          const newXp = res.data.newTotalXp;
          const newLevel = Math.floor(newXp / 500);
          const newXpMax = getXpForLevel(newLevel + 1);
          const updatedUser = { ...prev.user, xp: newXp, level: newLevel, xpMax: newXpMax };
          window.dispatchEvent(new CustomEvent("updateXP", { detail: updatedUser }));
          return { ...prev, user: updatedUser };
        });
      }
    } catch {
      // Silent fail
    } finally {
      setTimeout(() => setClaimAnim(null), 600);
    }
  };

  return (
    <div
      className="h-screen lg:overflow-hidden overflow-auto flex flex-col font-lora"
      style={bgPaper}
    >
      <div
        className="w-full shadow-lg flex-shrink-0 h-[20vh] sm:h-[25vh] md:h-[30vh] lg:h-[40vh]"
        style={{
          backgroundImage: "url('/images/bgfix.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="flex-1 px-6 md:px-12 py-6 lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <div
            className="border-2 border-[#c9b896] rounded-2xl overflow-hidden shadow-md flex flex-col"
            style={bgPaper}
          >
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

          <div className="flex flex-col gap-4 overflow-hidden">
            <div
              className="border-2 border-[#c9b896] rounded-2xl overflow-hidden shadow-md flex flex-col"
              style={bgPaper}
            >
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

              <div className="px-5 lg:py-3 py-6 space-y-2 relative">
                <p className="text-[#5c4033] font-semibold text-sm leading-snug">
                  {quizHarian.pertanyaan}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {quizHarian.options.map((opt, i) => {
                    const huruf = ["A", "B", "C", "D"][i];
                    const isSelected = quizSelectedOptionId === opt.id;
                    const isBenar = quizResult?.correctOptionId === opt.id;

                    let borderStyle = "border-[#c9b896] text-[#5c4033]";
                    let hurufBg = "bg-[#e8dcc0] text-[#a08060]";

                    if (quizSudahJawab) {
                      if (isBenar) {
                        borderStyle = "border-[#4a7c59] bg-[#4a7c59]/10 text-[#4a7c59]";
                        hurufBg = "bg-[#4a7c59] text-white";
                      } else if (isSelected) {
                        borderStyle = "border-[#8b3a3a] bg-[#8b3a3a]/10 text-[#8b3a3a]";
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

                {quizSudahJawab && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1.5 px-4 rounded-b-2xl"
                    style={{ ...bgPaper, backgroundColor: "rgba(255,255,255,0.9)" }}
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
                          quizResult.isCorrect ? "text-[#4a7c59]" : "text-[#8b3a3a]"
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
                  {tasks.filter((t) => t.sudahClaim).length}/{tasks.length} Selesai
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
                                isClaimed ? "text-[#a08060] line-through" : "text-[#5c4033]"
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