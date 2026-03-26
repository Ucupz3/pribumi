import { useState, useEffect } from "react";

async function getBerandaData() {
  await new Promise((res) => setTimeout(res, 300));
  return {
    user: {
      nama: "Kimi Hime",
      avatar: "/images/ppcowo.jpeg",
      level: 42,
      xp: 15000,
      xpMax: 20000,
      xpHariIni: 120,
      totalQuestSelesai: 12,
      rank: 3,
    },
    quizHarian: {
      id: "quiz-001",
      pertanyaan: "Siapakah proklamator kemerdekaan Indonesia?",
      pilihan: [
        "Soekarno & Hatta",
        "Sudirman & Nasution",
        "Diponegoro & Kartini",
        "Gajah Mada & Hayam Wuruk",
      ],
      jawaban: "Soekarno & Hatta",
      xpReward: 20,
      sudahDikerjakan: false,
    },
    tasks: [
      {
        id: 1,
        icon: "🗺️",
        judul: "Buka Pulau Sumatera",
        deskripsi: "Selesaikan semua marker di Pulau Sumatera",
        xpReward: 150,
        progress: 2,
        target: 3,
        sudahClaim: false,
      },
      {
        id: 2,
        icon: "📚",
        judul: "Selesaikan 3 Quest",
        deskripsi: "Selesaikan 3 quest di peta manapun",
        xpReward: 100,
        progress: 3,
        target: 3,
        sudahClaim: false,
      },
      {
        id: 3,
        icon: "⚡",
        judul: "Kumpulkan 200 XP",
        deskripsi: "Dapatkan 200 XP minggu ini",
        xpReward: 75,
        progress: 120,
        target: 200,
        sudahClaim: false,
      },
    ],
  };
}

const bgPaper = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

export default function Beranda() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizJawaban, setQuizJawaban] = useState(null);
  const [quizSudahJawab, setQuizSudahJawab] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [claimAnim, setClaimAnim] = useState(null);

  useEffect(() => {
    getBerandaData()
      .then((d) => {
        setData(d);
        setTasks(d.tasks);
        setQuizSudahJawab(d.quizHarian.sudahDikerjakan);
      })
      .finally(() => setLoading(false));
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

  const { user, quizHarian } = data;
  const xpPersen = Math.min((user.xp / user.xpMax) * 100, 100);

  const handleJawabQuiz = (pil) => {
    if (quizSudahJawab) return;
    setQuizJawaban(pil);
    setQuizSudahJawab(true);
  };

  const handleClaim = (taskId) => {
    setClaimAnim(taskId);
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, sudahClaim: true } : t)),
      );
      setClaimAnim(null);
    }, 600);
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
                    {user.nama.charAt(0)}
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
                    +{user.xpHariIni}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">
                    XP Hari Ini
                  </p>
                </div>
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#5c4033] font-black text-xl">
                    {user.totalQuestSelesai}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">
                    Quest Selesai
                  </p>
                </div>
                <div className="bg-[#e8dcc0]/50 border border-[#c9b896] rounded-xl px-3 py-3 text-center">
                  <p className="text-[#5c4033] font-black text-xl">
                    #{user.rank}
                  </p>
                  <p className="text-[#a08060] text-[10px] mt-0.5">Peringkat</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== KANAN ===== */}
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
                    +{quizHarian.xpReward} XP · Ganti tiap hari
                  </p>
                </div>
                {quizSudahJawab && (
                  <span className="bg-[#4a7c59]/20 text-[#4a7c59] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#4a7c59]/30">
                    ✅ Selesai
                  </span>
                )}
              </div>

              <div className="px-5 py-3 space-y-3 relative">
                <p className="text-[#5c4033] font-semibold text-sm leading-snug">
                  {quizHarian.pertanyaan}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quizHarian.pilihan.map((pil, i) => {
                    const huruf = ["A", "B", "C", "D"][i];
                    const isSelected = quizJawaban === pil;
                    const isBenar = pil === quizHarian.jawaban;
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
                        key={pil}
                        onClick={() => handleJawabQuiz(pil)}
                        disabled={quizSudahJawab}
                        style={!quizSudahJawab ? bgPaper : {}}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${borderStyle} ${!quizSudahJawab ? "hover:border-[#BD9B2C] cursor-pointer" : "cursor-default"}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${hurufBg}`}
                        >
                          {huruf}
                        </span>
                        <span className="text-left leading-tight">{pil}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Overlay selesai */}
                {quizSudahJawab && (
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
                    <p
                      className={`text-xs font-bold mt-0.5 ${quizJawaban === quizHarian.jawaban ? "text-[#4a7c59]" : "text-[#8b3a3a]"}`}
                    >
                      {quizJawaban === quizHarian.jawaban
                        ? `✅ Benar! +${quizHarian.xpReward} XP`
                        : `❌ Jawaban salah`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Task Mingguan — flex-1 sisa tinggi */}
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
                <span className="bg-[#BD9B2C]/20 text-[#81691A] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#BD9B2C]/40">
                  {tasks.filter((t) => t.sudahClaim).length}/{tasks.length}{" "}
                  Selesai
                </span>
              </div>

              {/* Scroll hanya di dalam task, bukan halaman */}
              <div
                className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-0
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-[#e8dcc0]
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#BD9B2C]
                [&::-webkit-scrollbar-thumb:hover]:bg-[#81691A]
              "
              >
                {tasks.map((task) => {
                  const persen = Math.min(
                    (task.progress / task.target) * 100,
                    100,
                  );
                  const isFull = task.progress >= task.target;
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
                          className={`text-2xl flex-shrink-0 ${isClaimed ? "grayscale" : ""}`}
                        >
                          {task.icon}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p
                              className={`font-black text-sm truncate ${isClaimed ? "text-[#a08060] line-through" : "text-[#5c4033]"}`}
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
                              {Math.round(persen)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 ml-2">
                          {isClaimed ? (
                            <span className="text-[#4a7c59] text-xl">✅</span>
                          ) : isFull ? (
                            <button
                              onClick={() => handleClaim(task.id)}
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
