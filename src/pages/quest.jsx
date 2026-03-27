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
// ── Hasil Screen (Internal) ──
function HasilScreen({ hasil, markerName, onBack, onUlang }) {
  // Hitung persentase warna berdasarkan skor (opsional, agar lebih dinamis)
  // Skor rendah = Merah, Skor tinggi = Hijau Kerajaan
  const scoreColor = hasil.score >= 70 ? "text-[#2D5A27]" : "text-[#7a3b1c]";

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 font-lora fixed inset-0 z-50 animate-fadeIn"
      style={bgPage} // Tetap gunakan background peta di paling luar
    >
      {/* Overlay Gelap agar background peta tidak terlalu mencolok */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      {/* Container Modal - Textur Kertas */}
      <div 
        className="relative w-full max-w-md p-10 rounded-[2.5rem] border-[6px] border-[#BD9B2C] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-scaleUp"
        style={bgPaper} // Background kertas di sini
      >
        <div className="text-center relative z-10">
          
          {/* PERBAIKAN: Judul dibuat coklat tua */}
          <h2 className="text-3xl font-black text-[#5c4033] mb-1 tracking-tight uppercase">
            Hasil Quest
          </h2>
          <div className="h-1 w-16 bg-[#BD9B2C] mx-auto mb-8 rounded-full opacity-50"></div>

          {/* Skor Besar */}
          <div className="mb-6 scale-110">
            
            {/* PERBAIKAN: Gunakan warna coklat tua atau emas tua untuk kontras */}
            <span className={`text-7xl font-black ${scoreColor} drop-shadow-[0_2px_1px_rgba(255,255,255,0.5)] block`}>
              {hasil.score}%
            </span>
            
            {/* PERBAIKAN: Teks keterangan dibuat Coklat Menengah */}
            <p className="text-[#a08060] font-bold mt-1 text-sm tracking-widest uppercase">
              {hasil.score >= 70 ? "Luar Bisa, Pendekar!" : "Terus Berlatih!"}
            </p>
          </div>

          {/* XP Badge */}
          {/* PERBAIKAN: Latar badge dibuat sedikit lebih gelap (krem tua) agar menonjol */}
          <div className="bg-[#e8dcc0] border border-[#BD9B2C]/20 py-3 px-8 rounded-2xl mb-10 inline-block shadow-inner">
            
            {/* PERBAIKAN: Teks XP dibuat Coklat Tua, angkanya Emas Tua */}
            <p className="text-[#5c4033] text-sm font-medium">
              Kamu mendapatkan <span className="text-[#81691A] font-black text-xl">{hasil.xpGained} XP</span>
            </p>
          </div>

          {/* Tombol Aksi - Tidak berubah karena warnanya sudah kontras */}
          <div className="flex flex-col gap-4">
            <button 
              onClick={onUlang} 
              className="w-full py-4 bg-[#BD9B2C] text-white font-extrabold text-lg rounded-2xl shadow-[0_5px_0_rgb(150,120,30)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wider"
            >
              Main Lagi
            </button>
            <button 
              onClick={onBack} 
              className="w-full py-3 font-bold text-[#a08060] border-2 border-[#c9b896]/50 rounded-2xl hover:bg-white/50 transition-all"
            >
              Ke Peta
            </button>
          </div>
        </div>
      </div>

      {/* Style Animasi */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-scaleUp { animation: scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}} />
    </div>
  );
}