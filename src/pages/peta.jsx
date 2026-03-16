import { useState, useEffect } from "react";
import PetaNusantara from "./petanusantara";
import { getUserXP } from "../api/petaApi";

const Peta = () => {
  const [userXP, setUserXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserXP()
      .then(data => setUserXP(data.xp))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-lora relative">

      {/* LAYER BACKGROUND */}
      <div
        className="absolute inset-0 blur-[3px]"
        style={{
          backgroundImage: "url('/images/bglaut.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* LAYER OVERLAY */}
      <div className="absolute inset-0 bg-black/20" />

      {/* LAYER PETA */}
      <div className="relative w-full h-[calc(100vh-120px)] flex items-center justify-center">
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