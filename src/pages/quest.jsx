import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
  const { slug: id } = useParams(); // ✅ pakai id
  const navigate = useNavigate();

  const [quest, setQuest] = useState(null);
  const [loadingQuest, setLoadingQuest] = useState(true);
  const [index, setIndex] = useState(0);
  const [jawaban, setJawaban] = useState(null);
  const [sudahJawab, setSudahJawab] = useState(false);
  const [skorBenar, setSkorBenar] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [hasil, setHasil] = useState(null);

  useEffect(() => {
    const fetchQuest = async () => {
      const { data, error } = await supabase
        .from("markers")
        .select(`
          id,
          name,
          xp_reward,
          quizzes (
            id,
            question,
            quiz_options (
              id,
              option_text,
              is_correct
            )
          )
        `)
        .eq("id", id)
        .single();

      console.log("ID:", id);
      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) {
        console.error("ERROR:", error);
        setLoadingQuest(false);
        return;
      }

      const soalFormatted = (data.quizzes || []).map((q) => ({
        pertanyaan: q.question,
        pilihan: q.quiz_options.map((opt) => opt.option_text),
        jawaban: q.quiz_options.find((opt) => opt.is_correct)?.option_text,
      }));

      setQuest({
        nama: data.name,
        xpReward: data.xp_reward,
        soal: soalFormatted,
      });

      setLoadingQuest(false);
    };

    fetchQuest();
  }, [id]); // ✅ FIX disini

  // ===============================
  // LOADING
  // ===============================
  if (loadingQuest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 font-lora px-4" style={bgPage}>
        <div className="w-12 h-12 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#5c4033] font-bold">Memuat Gulungan Quest...</p>
      </div>
    );
  }

  // ===============================
  // DATA TIDAK ADA
  // ===============================
  if (!quest || quest.soal.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-lora px-4" style={bgPage}>
        <div className="p-6 rounded-2xl shadow-2xl text-center bg-white/80 border-2 border-[#BD9B2C]">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Soal Belum Tersedia ❗
          </h2>
          <p className="text-[#5c4033] mb-6">
            Quest ini belum punya soal di database.
          </p>
          <button
            onClick={() => navigate("/peta")}
            className="px-6 py-2 bg-[#BD9B2C] text-white font-bold rounded-lg"
          >
            ← Kembali ke Peta
          </button>
        </div>
      </div>
    );
  }

  const soal = quest.soal[index];
  const totalSoal = quest.soal.length;
  const progress = ((index + 1) / totalSoal) * 100;

  const cekJawaban = (pil) => {
    if (sudahJawab) return;
    setJawaban(pil);
    setSudahJawab(true);
    if (pil === soal.jawaban) {
      setSkorBenar((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (index + 1 >= totalSoal) {
      const xpDidapat = Math.floor((skorBenar / totalSoal) * quest.xpReward);

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("xp")
          .eq("email", user.email)
          .single();

        const xpBaru = (userData?.xp || 0) + xpDidapat;

        await supabase
          .from("users")
          .update({ xp: xpBaru })
          .eq("email", user.email)
      }

      setHasil({ xpDidapat });
      setSelesai(true);
    } else {
      setIndex((i) => i + 1);
      setJawaban(null);
      setSudahJawab(false);
    }
  };

  const getOptionStyle = (pil) => {
    const base = "block w-full text-left p-3 rounded-xl border-2 ";

    if (!sudahJawab) {
      return base + "border-[#BD9B2C]/40 bg-white/60";
    }
    if (pil === soal.jawaban) {
      return base + "border-green-600 bg-green-100";
    }
    if (pil === jawaban) {
      return base + "border-red-500 bg-red-100";
    }
    return base + "border-gray-300 bg-gray-50 opacity-60";
  };

  // ===============================
  // UI UTAMA (TIDAK DIUBAH)
  // ===============================
  return (
    <div className="min-h-screen flex items-center justify-center font-lora p-4" style={bgPage}>
      <div className="p-5 rounded-2xl shadow-2xl border border-[#BD9B2C]/60 w-full max-w-md" style={bgPaper}>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <h2 className="text-[#8b5a2b] font-bold text-xs truncate">{quest.nama}</h2>
            <p className="text-[#5c4033] font-bold text-xs">
              {index + 1} / {totalSoal}
            </p>
          </div>

          <div className="w-full bg-[#e6d5b8] h-2 rounded-full">
            <div
              className="bg-[#BD9B2C] h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-6 bg-white/40 p-4 rounded-xl">
          <p className="font-bold text-[#4a332a]">
            {soal.pertanyaan}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {soal.pilihan.map((pil, i) => (
            <button
              key={i}
              onClick={() => cekJawaban(pil)}
              disabled={sudahJawab}
              className={getOptionStyle(pil)}
            >
              {pil}
            </button>
          ))}
        </div>

        {sudahJawab && (
          <button
            onClick={handleNext}
            className="w-full bg-[#BD9B2C] text-white font-bold p-3 rounded-xl"
          >
            {index + 1 >= totalSoal ? "Selesaikan Quest 🏆" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}