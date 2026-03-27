import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { startSession, submitSession, getActiveSession, endSession } from "../api/petaApi";

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

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Komponen Layar Pendukung ──────────────────────────────────
function LoadingScreen({ message = "Memuat Gulungan Quest..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-lora px-4" style={bgPage}>
      <div className="w-12 h-12 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#5c4033] font-bold">{message}</p>
    </div>
  );
}

function ErrorScreen({ message, onBack }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-lora px-4" style={bgPage}>
      <div className="p-6 rounded-2xl shadow-2xl text-center border-2 border-[#BD9B2C] max-w-sm w-full" style={bgPaper}>
        <p className="text-4xl mb-3">❗</p>
        <h2 className="text-xl font-bold text-red-800 mb-2">Terjadi Kesalahan</h2>
        <p className="text-[#5c4033] text-sm mb-6">{message}</p>
        <button onClick={onBack} className="px-6 py-2 bg-[#BD9B2C] text-white font-bold rounded-lg hover:bg-[#a08020]">
          ← Kembali ke Peta
        </button>
      </div>
    </div>
  );
}

// ── Komponen Utama ───────────────────────────────────────────
export default function QuestPage() {
  const { slug: markerId } = useParams();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [markerName, setMarkerName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [jawaban, setJawaban] = useState(null);
  const [sudahJawab, setSudahJawab] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selesai, setSelesai] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const startTimeRef = useRef(Date.now());
  const hasInit = useRef(false);

  const initSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      try {
        data = await startSession(markerId);
      } catch (err) {
        if (err.message === "SESSION_ACTIVE") {
          data = await getActiveSession(markerId);
          if (!data) throw new Error("Sesi aktif tidak dapat ditemukan.");
        } else {
          throw err;
        }
      }

      setSessionId(data.sessionId);
      setMarkerName(data.marker?.name ?? "Quest");
      
      const shuffled = shuffleArray(data.questions || []).map((q) => ({
        ...q,
        options: shuffleArray(q.options || []),
      }));
      setQuestions(shuffled);
      startTimeRef.current = Date.now();
    } catch (err) {
      setError(err.message === "MARKER_LOCKED" ? "XP tidak cukup untuk membuka ini" : err.message);
    } finally {
      setLoading(false);
    }
  }, [markerId]);

  useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      initSession();
    }
  }, [initSession]);

  const handleKeluar = async () => {
    setLoading(true); // Kunci layar agar user menunggu proses endSession
    if (sessionId) {
      try { 
        await endSession(sessionId); 
      } catch (e) { 
        console.error("EndSession error:", e); 
      }
    }
    navigate("/peta");
  };

  const handleNext = async () => {
    const currentQuestion = questions[index];
    const newAnswers = [...answers, { 
      quiz_id: currentQuestion.id, 
      selected_option_id: jawaban 
    }];
    setAnswers(newAnswers);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setJawaban(null);
      setSudahJawab(false);
    } else {
      setSubmitting(true);
      try {
        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        const res = await submitSession(sessionId, newAnswers, timeSpent);
        setHasil(res);
        setSelesai(true);
      } catch (err) {
        setError("Gagal mengirim jawaban: " + err.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) return <LoadingScreen message={sessionId ? "Menutup Sesi..." : "Memuat Quest..."} />;
  if (error) return <ErrorScreen message={error} onBack={handleKeluar} />;
  
  if (selesai && hasil) {
    // Re-use komponen HasilScreen yang kamu punya (saya asumsikan sudah ada)
    // Jika belum ada, tampilkan div sederhana dulu.
    return <HasilScreen hasil={hasil} markerName={markerName} onBack={handleKeluar} onUlang={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-lora" style={bgPage}>
      <div className="w-full max-w-lg p-6 rounded-2xl shadow-xl border-2 border-[#BD9B2C]" style={bgPaper}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-[#5c4033]">{markerName}</h2>
          <span className="text-sm font-bold text-[#BD9B2C]">Soal {index + 1}/{questions.length}</span>
        </div>

        <h3 className="text-lg font-medium text-[#5c4033] mb-6">{questions[index]?.question}</h3>

        <div className="space-y-3 mb-8">
          {questions[index]?.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { setJawaban(opt.id); setSudahJawab(true); }}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                jawaban === opt.id 
                ? "border-[#BD9B2C] bg-[#BD9B2C]/10 text-[#5c4033] font-bold" 
                : "border-[#c9b896] text-[#a08060] bg-white/50"
              }`}
            >
              {/* Penting: Cek properti option_text atau optionText */}
              {opt.option_text || opt.optionText || "Opsi Jawaban"}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={handleKeluar} className="flex-1 py-3 font-bold text-[#a08060] border-2 border-[#c9b896] rounded-xl">
            Keluar
          </button>
          <button 
            onClick={handleNext} 
            disabled={!sudahJawab || submitting}
            className="flex-[2] py-3 font-bold text-white bg-[#BD9B2C] rounded-xl disabled:opacity-50"
          >
            {submitting ? "Mengirim..." : (index + 1 === questions.length ? "Selesai" : "Berikutnya →")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hasil Screen (Internal) ──
// ── Hasil Screen (Internal) ──
function HasilScreen({ hasil, markerName, onBack, onUlang }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-lora bg-black/40 backdrop-blur-sm fixed inset-0 z-50 animate-fadeIn">
      {/* Container Utama dengan Tekstur Kertas */}
      <div 
        className="relative w-full max-w-md p-8 rounded-[2rem] border-4 border-[#BD9B2C] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-scaleUp"
        style={bgPaper}
      >
        {/* Ornamen Sudut (Opsional untuk kesan klasik) */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#BD9B2C] rounded-tl-xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#BD9B2C] rounded-br-xl opacity-30"></div>

        <div className="text-center relative z-10">
          <h2 className="text-3xl font-black text-[#5c4033] mb-2 tracking-wide uppercase">
            Hasil Quest
          </h2>
          <div className="h-1 w-24 bg-[#BD9B2C] mx-auto mb-8 rounded-full"></div>

          {/* Skor Lingkaran atau Besar */}
          <div className="mb-6">
            <span className="text-7xl font-black text-[#BD9B2C] drop-shadow-md block">
              {hasil.score}%
            </span>
            <p className="text-[#a08060] font-bold mt-2 text-lg">
              {hasil.score >= 70 ? "Luar Biasa, Pendekar!" : "Terus Berlatih!"}
            </p>
          </div>

          {/* XP Badge */}
          <div className="bg-[#BD9B2C]/10 border border-[#BD9B2C]/30 py-3 px-6 rounded-2xl mb-8 inline-block">
            <p className="text-[#5c4033] font-medium">
              Kamu mendapatkan <span className="text-[#BD9B2C] font-black text-xl">{hasil.xpGained} XP</span>
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={onUlang} 
              className="w-full py-4 bg-[#BD9B2C] text-white font-extrabold text-lg rounded-2xl shadow-[0_4px_0_rgb(160,128,32)] hover:shadow-none hover:translate-y-1 transition-all"
            >
              MAIN LAGI
            </button>
            <button 
              onClick={onBack} 
              className="w-full py-3 font-bold text-[#a08060] border-2 border-[#c9b896] rounded-2xl hover:bg-[#c9b896]/10 transition-colors"
            >
              Ke Peta
            </button>
          </div>
        </div>
      </div>

      {/* Tambahkan Style Animasi di file CSS kamu atau inject via tag style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}} />
    </div>
  );
}