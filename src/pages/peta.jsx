import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PetaNusantara from "./petanusantara";
import { getUserProfile } from "../api/userApi";

const Peta = () => {
  const navigate = useNavigate();
  const [userXP, setUserXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const userData = await getUserProfile();
        if (userData) {
          setUserXP(userData.xp || 0);
        } else {
          setError("Gagal mengambil data pengguna.");
        }
      } catch (err) {
        setError(err?.message ?? "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchXP();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-lora"
        style={{ backgroundImage: "url('/images/bglaut.jpg')", backgroundSize: "cover" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex flex-col items-center gap-3 text-center px-6">
          <span className="text-4xl">😕</span>
          <p className="text-white font-black text-base">Gagal memuat peta</p>
          <p className="text-white/70 text-sm">{error}</p>
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
            className="text-xs text-white/60 underline underline-offset-2 hover:text-white transition-colors"
          >
            Atau coba logout dan masuk kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col font-lora relative overflow-hidden touch-none">
      <div
        className="absolute inset-0 blur-[3px]"
        style={{
          backgroundImage: "url('/images/bglaut.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-semibold font-lora">Memuat Peta...</p>
          </div>
        ) : (
          <PetaNusantara userXP={userXP} />
        )}
      </div>
    </div>
  );
};

export default Peta;