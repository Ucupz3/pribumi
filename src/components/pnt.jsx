import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function LockIcon({ size = 28 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 64 64">
      <path fill="#ffce31" d="M2 28.3v31.4C2 62.1 3.9 64 6.3 64h51.4c2.4 0 4.3-1.9 4.3-4.3V28.3z"/>
      <path fill="#ff8736" d="M62 24c0-2.4-1.9-4.3-4.3-4.3H6.3C3.9 19.6 2 21.6 2 24v4.3h60z"/>
      <g fill="#3e4347">
        <ellipse cx="12.4" cy="23.5" rx="5.9" ry="2.5"/>
        <ellipse cx="51.6" cy="23.5" rx="5.9" ry="2.5"/>
      </g>
      <path fill="#dfe9ef" d="M32 0C19.1 0 8.6 10.6 8.6 23.5c0 .8 1.6 1.4 3.8 1.4v-1.4c.8-11 9.3-19.7 19.6-19.7c10.4 0 18.9 8.7 19.6 19.7v1.4c2.2 0 3.8-.6 3.8-1.4C55.4 10.6 44.9 0 32 0"/>
      <path fill="#b0bdc6" d="M51.6 23.5C50.9 12.6 42.4 3.9 32 3.9s-18.9 8.7-19.6 19.7V25c2.2 0 4.2-.6 4.2-1.4C16.5 16.4 22.5 8 32 8s15.5 8.4 15.5 15.5c0 .8 2 1.4 4.2 1.4z"/>
      <path fill="#3e4347" d="m36.6 56.4l-1.9-12.3c1.1-.8 1.9-2.2 1.9-3.7c0-2.5-2-4.6-4.6-4.6s-4.6 2.1-4.6 4.6c0 1.5.7 2.9 1.9 3.7l-1.9 12.3z"/>
    </svg>
  );
}

export default function NusaTenggara({ onMarkerClick }) {
  const [markers, setMarkers] = useState([]);
  const [realXP, setRealXP] = useState(0);

  useEffect(() => {
    const getData = async () => {
      // 1. Ambil token & Sinkronisasi XP dari API (Sesuai gaya Jawa)
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.log("❌ Belum login");
        return;
      }

      try {
        const res = await fetch("https://nusa-api.vercel.app/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (json.success) {
          setRealXP(json.data.totalXp);
        }
      } catch (err) {
        console.error("Gagal sinkron XP:", err.message);
      }

      // 2. Ambil marker khusus Bali - Nusa Tenggara (Gaya Query Konsisten)
      const { data, error } = await supabase
        .from("markers")
        .select(`
          id,
          name,
          slug,
          pos_top,
          pos_left,
          xp_reward,
          total_soal,
          wilayah,
          xp_required,
          thumbnail,
          islands!inner(slug)
        `)
        .eq("islands.slug", "bali-nusa-tenggara"); // 🔥 Slug tetap dipertahankan

      if (error) {
        console.error("Gagal ambil marker:", error.message);
      } else {
        setMarkers(data || []);
      }
    };

    getData();
  }, []);

  const handleClick = (e, marker, unlocked) => {
    e.stopPropagation();
    if (!unlocked) return;

    const rect = e.currentTarget.getBoundingClientRect();
    if (onMarkerClick) {
      onMarkerClick(
        {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        },
        marker,
        unlocked
      );
    }
  };

  return (
    <div className="absolute top-[90%] left-[66%] -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="relative">
        <img
          src="/images/Pulau/NT.png"
          alt="Pulau Nusa Tenggara"
          className="w-[74%] min-w-[140px] h-auto pointer-events-none"
        />

        {markers?.map((m) => {
          // Logika Unlock sinkron dengan realXP
          const isUnlocked = Number(realXP) >= Number(m.xp_required);

          return (
            <div
              key={m.id}
              className="absolute group"
              style={{
                top: m.pos_top,
                left: m.pos_left,
                transform: "translate(-50%,-50%)"
              }}
            >
              {isUnlocked ? (
                <div
                  onClick={(e) => handleClick(e, m, true)}
                  className="cursor-pointer z-50"
                >
                  <div className="relative w-4 h-4">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="relative w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                  </div>

                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {m.name}
                  </span>
                </div>
              ) : (
                <div className="cursor-not-allowed flex flex-col items-center">
                  <LockIcon size={26} />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-yellow-400 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap inline-block">
                    🔒 {m.xp_required} XP
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}