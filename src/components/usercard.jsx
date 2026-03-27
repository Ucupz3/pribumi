import { useState, useEffect } from "react";

// Rumus level yang sama dengan Beranda (XP Max = level berikutnya * 500)
const getXpForLevel = (level) => (level + 1) * 500;

export default function UserCard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("NO_TOKEN");
      return;
    }

    try {
      const res = await fetch("https://nusa-api.vercel.app/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const json = await res.json();
      
      if (res.status === 401) {
        localStorage.removeItem("access_token");
        throw new Error("UNAUTHORIZED");
      }

      if (json.success) {
        const u = json.data;
        setUser({
          nama: u.username,
          avatar: u.avatarUrl ?? null,
          xp: u.totalXp, // Menggunakan totalXp dari database
          xpMax: getXpForLevel(u.level), // Hitung batas XP berdasarkan level saat ini
          level: u.level
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Jalankan fetch pertama kali
    fetchUserData();

    // Listener agar sinkron saat Beranda update XP (handleJawabQuiz/handleClaim)
    const handleUpdate = () => {
      fetchUserData();
    };

    window.addEventListener("updateXP", handleUpdate);
    return () => window.removeEventListener("updateXP", handleUpdate);
  }, []);

  if (!user || error) return null;

  const percentage = Math.min((user.xp / user.xpMax) * 100, 100);

  return (
    <div className="fixed font-lora flex items-center">
      {/* Avatar - Style Asli Kamu */}
      <div className="absolute -left-7 sm:-left-9 lg:-left-12">
        <div
          className="
            rounded-full border-[3px] lg:border-[4px] border-[#BD9B2C]
            overflow-hidden bg-gray-200 shadow-lg
            w-20 h-20
            sm:w-20 sm:h-20
            2xl:w-24 2xl:h-24
          "
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-full bg-[#e8dcc0] items-center justify-center text-[#5c4033] font-black text-xl lg:text-2xl"
            style={{ display: user.avatar ? "none" : "flex" }}
          >
            {user.nama.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Card - Style Asli Kamu */}
      <div
        className="
          border-[3px] lg:border-[4px] border-[#BD9B2C] rounded-lg shadow-md
          bg-cover bg-center
          w-44 sm:w-48 lg:w-52 2xl:w-64
          px-4 lg:px-6
          py-1
        "
        style={{ backgroundImage: "url('/images/bgpaper.png')" }}
      >
        {/* Name */}
        <h2
          className="
            font-bold text-[#7a3b1c] truncate
            text-sm sm:text-base 2xl:text-lg
            ml-10 sm:ml-8 lg:ml-3 2xl:ml-7
          "
        >
          {user.nama}
        </h2>

        {/* XP Section */}
        <div
          className="
            flex items-center gap-2 lg:gap-3
            ml-10 sm:ml-8 lg:ml-3 2xl:ml-7
            mt-1 lg:mt-2
            mb-1
          "
        >
          <span className="font-bold text-[#7a3b1c] text-sm sm:text-base 2xl:text-lg">
            XP
          </span>
          <div
            className="
              bg-yellow-100 border-2 border-[#BD9B2C] rounded-full overflow-hidden
              w-20 sm:w-24 lg:w-32
              h-2.5 lg:h-3
            "
          >
            <div
              className="h-full bg-gradient-to-r from-red-800 to-orange-500 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        {/* Menampilkan level kecil di bawah bar agar user tahu progressnya */}
        <div className="text-[10px] text-right font-bold text-[#a08060] -mt-1 opacity-70">
           Lv.{user.level}
        </div>
      </div>
    </div>
  );
}