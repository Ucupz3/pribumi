// ✅ PETA.JSX - ganti useEffect getUserXP dengan ini

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import PetaNusantara from "./petanusantara";

const Peta = () => {
  const [userXP, setUserXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXP = async () => {
      // ✅ Ambil dari auth beneran
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("xp")
          .eq("id", user.id)
          .single();

        setUserXP(data?.xp || 0);
      }

      setLoading(false);
    };

    fetchXP();
  }, []);

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
          <PetaNusantara userXP={userXP} />  // ✅ XP real dikirim ke semua pulau
        )}
      </div>
    </div>
  );
};

export default Peta;