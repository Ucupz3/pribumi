import { useState, useEffect } from "react";
import { getLeaderboard } from "../api/leaderboardApi";

const bgStyle = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const medalColor = {
  0: { border: "border-yellow-500", text: "text-yellow-600", label: "#1", size: "w-28 h-28" },
  1: { border: "border-gray-400",   text: "text-gray-500",   label: "#2", size: "w-20 h-20" },
  2: { border: "border-orange-500", text: "text-orange-500", label: "#3", size: "w-20 h-20" },
};

const podiumOrder = [1, 0, 2];

const Peringkat = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(data => setPlayers(data))
      .finally(() => setLoading(false));
  }, []);

  const topThree = players.slice(0, 3);
  const others = players.slice(3);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 font-lora" style={bgStyle}>
        <div className="w-10 h-10 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#5c3b1e] font-semibold">Memuat Peringkat...</p>
      </div>
    );
  }

  return (
    <div 
  className="w-full min-h-screen p-6 pt-28 xl:pt-6 font-lora" 
  style={bgStyle}
>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-[#5c3b1e] mb-10">
        Leaderboard
      </h1>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-6 md:gap-12 mb-12">
        {podiumOrder.map((i) => {
          const player = topThree[i];
          if (!player) return null;
          const medal = medalColor[i];
          const isFirst = i === 0;

          return (
            <div key={i} className={`flex flex-col items-center ${isFirst ? "scale-110" : ""}`}>
              {isFirst && <span className="text-2xl mb-1">👑</span>}

              <div className={`${medal.size} rounded-full border-4 ${medal.border} overflow-hidden bg-[#e8dcc0]`}>
                {player.avatar ? (
                  <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#a08060] font-black text-xl">
                    {player.name.charAt(0)}
                  </div>
                )}
              </div>

              <p className={`mt-2 font-black text-base ${medal.text}`}>{medal.label}</p>
              <p className={`font-semibold text-sm text-[#5c3b1e] ${isFirst ? "text-base" : ""}`}>
                {player.name}
              </p>
              <p className="text-xs text-[#a08060]">
                {player.xp.toLocaleString("id-ID")} XP
              </p>
            </div>
          );
        })}
      </div>

      <div className="border-t-2 border-[#c9b896] mb-6" />

      {/* Rank 4 dst */}
      <div className="space-y-3">
        {others.map((player, idx) => {
          const rank = idx + 4;
          return (
            <div
              key={player.id}
              className="flex items-center justify-between border border-[#cdb895] rounded-xl px-5 py-3 hover:bg-[#BD9B2C]/5 transition-colors"
              style={bgStyle}
            >
              <div className="flex items-center gap-4">
                <span className="font-black text-[#a08060] w-8 text-sm">#{rank}</span>

                <div className="w-10 h-10 rounded-full bg-[#e8dcc0] border-2 border-[#c9b896] overflow-hidden flex items-center justify-center">
                  {player.avatar ? (
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#a08060] font-black text-sm">
                      {player.name.charAt(0)}
                    </span>
                  )}
                </div>

                <span className="text-[#5c3b1e] font-semibold text-sm">{player.name}</span>
              </div>

              <span className="text-sm font-bold text-[#BD9B2C]">
                {player.xp.toLocaleString("id-ID")} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Peringkat;