import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startSession, submitSession } from "../api/petaApi";

const bgPage = {
  backgroundImage: "url('/images/bgpetafix.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const bgPaper = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

// ── Shuffle array (Fisher-Yates) ─────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Layar Loading ────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 font-lora px-4"
      style={bgPage}
    >
      <div className="w-12 h-12 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#5c4033] font-bold">Memuat Gulungan Quest...</p>
    </div>
  );
}

// ── Layar Error ──────────────────────────────────────────────
function ErrorScreen({ message, onBack }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-lora px-4"
      style={bgPage}
    >
      <div
        className="p-6 rounded-2xl shadow-2xl text-center border-2 border-[#BD9B2C] max-w-sm w-full"
        style={bgPaper}
      >
        <p className="text-4xl mb-3">❗</p>
        <h2 className="text-xl font-bold text-red-800 mb-2">
          {message || "Terjadi Kesalahan"}
        </h2>
        <p className="text-[#5c4033] text-sm mb-6">
          Silakan kembali ke peta dan coba lagi.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-[#BD9B2C] text-white font-bold rounded-lg hover:bg-[#a08020] transition-colors"
        >
          ← Kembali ke Peta
        </button>
      </div>
    </div>
  );
}

// ── Layar Hasil ──────────────────────────────────────────────
function HasilScreen({ hasil, markerName, onBack, onUlang }) {
  const {
    score,
    correctAnswers,
    totalQuestions,
    xpGained,
    isPassed,
    newBadges = [],
  } = hasil;

  return (
    <div
      className="min-h-screen flex items-center justify-center font-lora p-4"
      style={bgPage}
    >
      <div
        className="p-6 rounded-2xl shadow-2xl border-2 border-[#BD9B2C] w-full max-w-md"
        style={bgPaper}
      >
        {/* Header hasil */}
        <div className="text-center mb-6">
          <p className="text-5xl mb-2">{isPassed ? "🏆" : "📜"}</p>
          <h2 className="text-2xl font-bold text-[#5c4033]">
            {isPassed ? "Quest Selesai!" : "Belum Berhasil"}
          </h2>
          <p className="text-[#a08060] text-sm mt-1">{markerName}</p>
        </div>

        {/* Skor */}
        <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-2xl p-5 mb-5 space-y-3">
          {/* Progress bar skor */}
          <div>
            <div className="flex justify-between text-xs text-[#a08060] mb-1">
              <span>Skor</span>
              <span className="font-bold text-[#5c4033]">{score}%</span>
            </div>
            <div className="w-full bg-[#d4c9b0] rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isPassed
                    ? "bg-gradient-to-r from-[#81691A] to-[#BD9B2C]"
                    : "bg-gradient-to-r from-red-700 to-red-400"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Grid statistik */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="text-center">
              <p className="text-lg font-black text-[#5c4033]">
                {correctAnswers}
              </p>
              <p className="text-[9px] text-[#a08060] font-bold uppercase">
                Benar
              </p>
            </div>
            <div className="text-center border-x border-[#c9b896]">
              <p className="text-lg font-black text-[#5c4033]">
                {totalQuestions - correctAnswers}
              </p>
              <p className="text-[9px] text-[#a08060] font-bold uppercase">
                Salah
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-[#BD9B2C]">+{xpGained}</p>
              <p className="text-[9px] text-[#a08060] font-bold uppercase">
                XP
              </p>
            </div>
          </div>
        </div>

        {/* Badge baru */}
        {newBadges.length > 0 && (
          <div className="bg-[#BD9B2C]/10 border border-[#BD9B2C]/30 rounded-xl p-3 mb-5">
            <p className="text-xs font-bold text-[#BD9B2C] mb-2">
              🎖️ Badge Baru Terbuka!
            </p>
            {newBadges.map((badge, i) => (
              <p key={i} className="text-xs text-[#5c4033]">
                • {badge.name || badge}
              </p>
            ))}
          </div>
        )}

        {/* Info gagal */}
        {!isPassed && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
            <p className="text-xs text-red-700 font-semibold">
              Minimal skor 60% untuk lulus. Kamu mendapat {score}%.
            </p>
            <p className="text-xs text-red-500 mt-1">
              Tetap semangat! Kamu tetap mendapat {xpGained} XP.
            </p>
          </div>
        )}

        {/* Tombol aksi */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 border-2 border-[#c9b896] text-[#a08060] font-bold text-sm py-3 rounded-xl hover:border-[#BD9B2C] transition-colors"
            style={bgPaper}
          >
            ← Peta
          </button>
          <button
            onClick={onUlang}
            className="flex-1 border-2 border-[#BD9B2C] text-[#5c4033] font-bold text-sm py-3 rounded-xl hover:bg-[#BD9B2C]/10 transition-colors"
            style={bgPaper}
          >
            🔄 Ulangi
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Komponen Utama ───────────────────────────────────────────
export default function QuestPage() {
  const { slug: markerId } = useParams();
  const navigate = useNavigate();

  // State sesi
  const [sessionId, setSessionId] = useState(null);
  const [markerName, setMarkerName] = useState("");
  const [questions, setQuestions] = useState([]); // soal dengan opsi sudah diacak
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quiz
  const [index, setIndex] = useState(0);
  const [jawaban, setJawaban] = useState(null); // option id yang dipilih
  const [sudahJawab, setSudahJawab] = useState(false);
  const [answers, setAnswers] = useState([]); // kumpulan jawaban untuk submit

  // State hasil
  const [selesai, setSelesai] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Timer
  const startTimeRef = useRef(Date.now());

  // ── Fetch & mulai sesi ─────────────────────────────────────
  const initSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIndex(0);
    setJawaban(null);
    setSudahJawab(false);
    setAnswers([]);
    setSelesai(false);
    setHasil(null);
    startTimeRef.current = Date.now();

    try {
      const data = await startSession(markerId);
      // data = { sessionId, marker, questions: [...], totalQuestions, timeLimitSec }

      setSessionId(data.sessionId);
      setMarkerName(data.marker?.name ?? "Quest");

      // Acak urutan soal DAN acak urutan opsi tiap soal
      const shuffledQuestions = shuffleArray(data.questions).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));

      setQuestions(shuffledQuestions);
    } catch (err) {
      console.error("startSession error:", err);
      if (err.message === "MARKER_LOCKED") {
        setError("Kamu belum memiliki cukup XP untuk membuka quest ini.");
      } else if (err.message === "NO_QUESTIONS") {
        setError("Quest ini belum memiliki soal.");
      } else if (err.message === "SESSION_ACTIVE") {
        setError("Kamu memiliki sesi aktif yang belum selesai.");
      } else {
        setError("Gagal memuat quest. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }, [markerId]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // ── Pilih jawaban ──────────────────────────────────────────
  const cekJawaban = (optionId) => {
    if (sudahJawab) return;
    setJawaban(optionId);
    setSudahJawab(true);
  };

  // ── Lanjut ke soal berikutnya atau submit ──────────────────
  const handleNext = async () => {
    const soal = questions[index];

    // Simpan jawaban soal ini
    const updatedAnswers = [
      ...answers,
      {
        quiz_id: soal.id,
        selected_option_id: jawaban ?? undefined,
      },
    ];
    setAnswers(updatedAnswers);

    const isLast = index + 1 >= questions.length;

    if (!isLast) {
      // Lanjut soal berikutnya
      setIndex((i) => i + 1);
      setJawaban(null);
      setSudahJawab(false);
      return;
    }

    // Semua soal selesai — submit ke backend
    setSubmitting(true);
    try {
      const timeSpentSec = Math.round(
        (Date.now() - startTimeRef.current) / 1000,
      );
      const result = await submitSession(
        sessionId,
        updatedAnswers,
        timeSpentSec,
      );
      setHasil(result);
      setSelesai(true);
    } catch (err) {
      console.error("submitSession error:", err);
      setError("Gagal mengirim jawaban. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render kondisional ─────────────────────────────────────
  if (loading) return <LoadingScreen />;

  if (error)
    return <ErrorScreen message={error} onBack={() => navigate("/peta")} />;

  if (selesai && hasil)
    return (
      <HasilScreen
        hasil={hasil}
        markerName={markerName}
        onBack={() => navigate("/peta")}
        onUlang={initSession}
      />
    );

  // ── UI Quiz ────────────────────────────────────────────────
  const soal = questions[index];
  const totalSoal = questions.length;
  const progress = ((index + 1) / totalSoal) * 100;

  // Cari teks jawaban benar dari opsi (untuk highlight setelah jawab)
  const correctOption = soal.options.find(
    (o) => o.isCorrect, // backend tidak kirim isCorrect, ini akan undefined — lihat keterangan di bawah
  );

  const getOptionStyle = (opt) => {
    const base =
      "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ";

    if (!sudahJawab) {
      return (
        base +
        (jawaban === opt.id
          ? "border-[#BD9B2C] bg-[#BD9B2C]/10 text-[#5c4033]"
          : "border-[#c9b896] bg-white/60 text-[#5c4033] hover:border-[#BD9B2C] hover:bg-[#BD9B2C]/5")
      );
    }

    // Setelah jawab — backend tidak kirim isCorrect di soal (keamanan)
    // Hanya highlight pilihan user: kuning jika dipilih, abu jika tidak
    // Jawaban benar akan terungkap di layar hasil (answerBreakdown)
    if (opt.id === jawaban) {
      return base + "border-[#BD9B2C] bg-[#BD9B2C]/15 text-[#5c4033]";
    }
    return base + "border-[#c9b896] bg-white/30 text-[#a08060] opacity-60";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-lora p-4"
      style={bgPage}
    >
      <div
        className="p-5 rounded-2xl shadow-2xl border border-[#BD9B2C]/60 w-full max-w-md"
        style={bgPaper}
      >
        {/* Header: nama quest + progress */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-[#8b5a2b] font-bold text-xs truncate flex-1 mr-2">
              {markerName}
            </h2>
            <p className="text-[#5c4033] font-bold text-xs whitespace-nowrap">
              {index + 1} / {totalSoal}
            </p>
          </div>
          <div className="w-full bg-[#e6d5b8] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#81691A] to-[#BD9B2C] h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Pertanyaan */}
        <div className="mb-5 bg-white/40 border border-[#c9b896] p-4 rounded-xl min-h-[80px] flex items-center">
          <p className="font-bold text-[#4a332a] leading-relaxed text-sm">
            {soal.question}
          </p>
        </div>

        {/* Opsi jawaban (sudah diacak) */}
        <div className="space-y-2.5 mb-5">
          {soal.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => cekJawaban(opt.id)}
              disabled={sudahJawab}
              className={getOptionStyle(opt)}
            >
              {opt.optionText}
            </button>
          ))}
        </div>

        {/* Tombol lanjut — muncul setelah menjawab */}
        {sudahJawab && (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="w-full bg-[#BD9B2C] hover:bg-[#a08020] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : index + 1 >= totalSoal ? (
              "Selesaikan Quest 🏆"
            ) : (
              "Lanjut →"
            )}
          </button>
        )}

        {/* Tombol keluar */}
        <button
          onClick={() => navigate("/peta")}
          className="w-full mt-2 text-[#a08060] text-xs font-semibold py-2 hover:text-[#5c4033] transition-colors"
        >
          ✕ Keluar Quest
        </button>
      </div>
    </div>
  );
}
