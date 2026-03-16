import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestBySlug, submitQuest } from "../api/questapi";

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

export default function QuestPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [quest, setQuest] = useState(null);
  const [loadingQuest, setLoadingQuest] = useState(true);
  const [index, setIndex] = useState(0);
  const [jawaban, setJawaban] = useState(null);
  const [sudahJawab, setSudahJawab] = useState(false);
  const [skorBenar, setSkorBenar] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getQuestBySlug(slug)
      .then(data => setQuest(data))
      .finally(() => setLoadingQuest(false));
  }, [slug]);

  // Loading quest
  if (loadingQuest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-lora" style={bgPage}>
        <div className="w-12 h-12 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#5c4033] font-semibold">Memuat quest...</p>
      </div>
    );
  }

  // Quest tidak ditemukan
  if (!quest) {
    return (
      <div className="min-h-screen flex items-center justify-center font-lora" style={bgPage}>
        <div className="text-center space-y-4">
          <p className="text-[#5c4033] font-bold text-xl">Quest tidak ditemukan</p>
          <button
            onClick={() => navigate("/peta")}
            className="border-2 border-[#BD9B2C] text-[#5c4033] font-bold px-6 py-2.5 rounded-xl hover:bg-[#BD9B2C]/10 transition-all"
            style={bgPaper}
          >
            ← Kembali ke Peta
          </button>
        </div>
      </div>
    );
  }

  const soal = quest.soal[index];
  const totalSoal = quest.soal.length;
  const progress = (index / totalSoal) * 100;

  const cekJawaban = (pil) => {
    if (sudahJawab) return;
    setJawaban(pil);
    setSudahJawab(true);
    if (pil === soal.jawaban) setSkorBenar((s) => s + 1);
  };

  const handleNext = async () => {
    const skorFinal = jawaban === soal.jawaban ? skorBenar + 1 : skorBenar;

    if (index + 1 >= totalSoal) {
      setLoadingSubmit(true);
      try {
        const res = await submitQuest({ slug, skorBenar: skorFinal, totalSoal });
        setHasil(res);
        setSelesai(true);
      } catch (err) {
        console.error("Gagal submit quest:", err);
      } finally {
        setLoadingSubmit(false);
      }
    } else {
      setIndex((i) => i + 1);
      setJawaban(null);
      setSudahJawab(false);
    }
  };

  // Loading submit
  if (loadingSubmit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-lora" style={bgPage}>
        <div className="w-12 h-12 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#5c4033] font-semibold">Menghitung hasil...</p>
      </div>
    );
  }

  // ===== HALAMAN HASIL =====
  if (selesai && hasil) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 font-lora" style={bgPage}>
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl rounded-2xl overflow-hidden border-2 border-[#c9b896] shadow-2xl" style={bgPaper}>

          {/* Header hasil */}
          <div className="px-6 sm:px-10 lg:px-16 py-8 lg:py-12 text-center border-b-2 border-[#c9b896]">
            <div className="text-5xl sm:text-6xl lg:text-7xl mb-3">
              {skorBenar === totalSoal ? "🎉" : skorBenar >= totalSoal / 2 ? "👏" : "💪"}
            </div>
            <p className="text-[#5c4033] font-bold text-xl sm:text-2xl lg:text-3xl">
              {skorBenar === totalSoal ? "Sempurna!" : skorBenar >= totalSoal / 2 ? "Bagus!" : "Tetap Semangat!"}
            </p>
            <p className="text-[#a08060] text-sm lg:text-base mt-1">{quest.nama} selesai</p>
          </div>

          <div className="px-6 sm:px-10 lg:px-16 py-6 lg:py-10 space-y-4 lg:space-y-5">

            {/* Skor */}
            <div className="text-center border-2 border-[#c9b896] rounded-xl py-4 lg:py-6">
              <p className="text-[#a08060] text-xs lg:text-sm mb-1 uppercase tracking-widest">Jawaban Benar</p>
              <p className="text-5xl lg:text-6xl font-bold text-[#5c4033]">
                {skorBenar}<span className="text-[#c9b896] text-3xl lg:text-4xl">/{totalSoal}</span>
              </p>
            </div>

            {/* XP didapat */}
            <div className="border-2 border-[#BD9B2C] rounded-xl px-5 lg:px-8 py-4 lg:py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl lg:text-3xl">⚡</span>
                <div>
                  <p className="text-[#5c4033] font-bold text-sm lg:text-base">XP Didapat</p>
                  <p className="text-[#a08060] text-xs lg:text-sm">dari quest ini</p>
                </div>
              </div>
              <p className="text-[#BD9B2C] font-black text-3xl lg:text-4xl">+{hasil.xpDidapat}</p>
            </div>

            {/* Badge */}
            {hasil.badge && (
              <div className="border-2 border-[#BD9B2C] rounded-xl px-5 lg:px-8 py-4 lg:py-5 flex items-center gap-4">
                <span className="text-4xl lg:text-5xl">{hasil.badge.emoji}</span>
                <div>
                  <p className="text-[#5c4033] font-bold text-sm lg:text-base">Badge {hasil.badge.nama} Terbuka!</p>
                  <p className="text-[#a08060] text-xs lg:text-sm">Kamu sudah mencapai {hasil.badge.min} XP</p>
                </div>
              </div>
            )}

            {/* Tombol kembali */}
            <button
              onClick={() => navigate("/peta")}
              style={bgPaper}
              className="w-full border-2 border-[#BD9B2C] text-[#5c4033] font-bold text-sm lg:text-base py-3.5 lg:py-4 rounded-xl hover:bg-[#BD9B2C]/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
            >
              🗺️ Kembali ke Peta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== HALAMAN SOAL =====
  return (
    <div className="min-h-screen flex items-start lg:items-center justify-center p-4 sm:p-6 lg:p-10 font-lora" style={bgPage}>
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl rounded-2xl overflow-hidden border-2 border-[#c9b896] shadow-2xl" style={bgPaper}>

        {/* Header */}
        <div className="px-5 sm:px-8 lg:px-12 pt-5 sm:pt-7 lg:pt-8 pb-4 border-b-2 border-[#c9b896]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/peta")}
              className="flex items-center gap-1.5 text-[#a08060] hover:text-[#5c4033] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 lg:w-6 lg:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
              </svg>
              <span className="text-sm lg:text-base font-semibold">Kembali</span>
            </button>
            <p className="text-[#5c4033] text-sm lg:text-base font-bold">{quest.nama}</p>
            <p className="text-[#a08060] text-sm lg:text-base font-semibold">{index + 1}/{totalSoal}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 lg:h-5 bg-[#e8dcc0] rounded-full border border-[#c9b896] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#81691A] to-[#BD9B2C] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Soal */}
        <div className="px-5 sm:px-8 lg:px-12 py-5 lg:py-8 space-y-4 lg:space-y-6">

          <span className="inline-block bg-[#BD9B2C]/20 text-[#81691A] border border-[#BD9B2C]/40 text-[10px] lg:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Pilihan Ganda
          </span>

          <p className="text-[#5c4033] font-semibold text-base sm:text-lg lg:text-xl leading-snug">
            {soal.pertanyaan}
          </p>

          {/* Pilihan */}
          <div className="space-y-2 lg:space-y-3">
            {soal.pilihan.map((pil, i) => {
              const isSelected = jawaban === pil;
              const isBenar = pil === soal.jawaban;
              const huruf = ["A", "B", "C", "D"][i];
              let borderStyle = "border-[#c9b896]";
              let textStyle = "text-[#5c4033]";
              let hurufBg = "bg-[#e8dcc0] text-[#a08060]";
              if (sudahJawab) {
                if (isBenar) { borderStyle = "border-[#4a7c59]"; textStyle = "text-[#4a7c59]"; hurufBg = "bg-[#4a7c59] text-white"; }
                else if (isSelected) { borderStyle = "border-[#8b3a3a]"; textStyle = "text-[#8b3a3a]"; hurufBg = "bg-[#8b3a3a] text-white"; }
                else { borderStyle = "border-[#c9b896]"; textStyle = "text-[#a08060]"; }
              }
              return (
                <button
                  key={pil}
                  onClick={() => cekJawaban(pil)}
                  disabled={sudahJawab}
                  style={!sudahJawab ? bgPaper : {}}
                  className={`w-full text-left px-4 lg:px-5 py-3 lg:py-4 rounded-xl border-2 font-medium text-sm lg:text-base transition-all duration-200 flex items-center gap-3 ${borderStyle} ${textStyle} ${!sudahJawab ? "hover:border-[#BD9B2C] cursor-pointer" : "cursor-default"}`}
                >
                  <span className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-black flex-shrink-0 transition-all duration-200 ${hurufBg}`}>
                    {huruf}
                  </span>
                  {pil}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {sudahJawab && (
            <div className={`rounded-xl px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base font-semibold border-2 ${
              jawaban === soal.jawaban
                ? "border-[#4a7c59] text-[#4a7c59] bg-[#4a7c59]/10"
                : "border-[#8b3a3a] text-[#8b3a3a] bg-[#8b3a3a]/10"
            }`}>
              {jawaban === soal.jawaban ? "✅ Jawaban kamu benar!" : `❌ Jawaban benar: ${soal.jawaban}`}
            </div>
          )}
        </div>

        {/* Tombol Next */}
        {sudahJawab && (
          <div className="px-5 sm:px-8 lg:px-12 pb-6 lg:pb-10">
            <button
              onClick={handleNext}
              style={bgPaper}
              className="w-full border-2 border-[#BD9B2C] text-[#5c4033] font-bold text-sm lg:text-base py-3.5 lg:py-4 rounded-xl hover:bg-[#BD9B2C]/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {index + 1 >= totalSoal ? "Lihat Hasil 🎉" : "Lanjut →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}