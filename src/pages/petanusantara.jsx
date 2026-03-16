import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Jawa from "../components/pjawa";
import Kalimantan from "../components/pkalimantan";
import Sumatra from "../components/psumatra";
import Papua from "../components/papua";
import NusaTenggara from "../components/pnt";
import Malaka from "../components/pmalaka";

const bgPaper = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

function QuestCard({ marker, onBack, onMulai, isUnlocked, userXP }) {
  const progress = marker.xpRequired > 0
    ? Math.min((userXP / marker.xpRequired) * 100, 100)
    : 100;
  const xpKurang = marker.xpRequired - userXP;

  return (
    <div className="fixed inset-0 left-60 z-40 flex items-center p-8 pointer-events-none">

      {/* Card */}
      <div
        className="w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#c9b896] pointer-events-auto font-lora"
        style={bgPaper}
      >

        {/* Thumbnail */}
        <div className="relative h-44">
          <img
            src={marker.thumbnail}
            alt={marker.nama}
            className={`w-full h-full object-cover ${!isUnlocked ? "grayscale opacity-60" : ""}`}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Tombol Back */}
          <div className="absolute top-3 left-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 active:scale-95 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
          </div>

          {/* Nama + wilayah */}
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-black text-xl leading-tight">{marker.nama}</p>
            <p className="text-white/60 text-xs mt-0.5">
              {marker.wilayah ?? "Sumatera"} · Indonesia
            </p>
          </div>

          {/* XP badge */}
          <div className={`absolute bottom-4 right-4 font-black text-sm px-3 py-1.5 rounded-2xl shadow-lg ${isUnlocked ? "bg-[#BD9B2C] text-white" : "bg-gray-500 text-gray-200"}`}>
            {isUnlocked ? `+${marker.xpReward} XP` : `🔒 ${marker.xpRequired} XP`}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">

          {/* Deskripsi */}
          <p className="text-[#5c4033] text-sm leading-relaxed">{marker.deskripsi}</p>

          {/* Info grid — Soal, Waktu, Wilayah */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-2xl px-3 py-3 text-center">
              <p className="text-[#5c4033] font-black text-xl">{marker.totalSoal}</p>
              <p className="text-[#a08060] text-[10px] mt-0.5">Soal</p>
            </div>
            <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-2xl px-3 py-3 text-center">
              <p className="text-[#5c4033] font-black text-base">
                {marker.estimasiMenit ?? Math.ceil(marker.totalSoal * 1.5)} mnt
              </p>
              <p className="text-[#a08060] text-[10px] mt-0.5">Estimasi</p>
            </div>
            <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-2xl px-3 py-3 text-center">
              <p className="text-[#5c4033] font-black text-base truncate">
                {marker.wilayah ?? "Sumatera"}
              </p>
              <p className="text-[#a08060] text-[10px] mt-0.5">Wilayah</p>
            </div>
          </div>

          {/* Warning kalau terkunci */}
          {!isUnlocked && (
            <div className="bg-[#8b3a3a]/10 border border-[#8b3a3a]/20 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <p className="text-[#8b3a3a] font-semibold text-sm">Belum bisa dimulai</p>
              </div>
              <p className="text-[#8b3a3a]/70 text-xs">
                Butuh <span className="font-bold">{xpKurang} XP lagi</span> untuk membuka lokasi ini
              </p>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#a08060] text-[10px]">Progress XP</span>
                  <span className="text-[#5c4033] text-[10px] font-bold">{userXP} / {marker.xpRequired} XP</span>
                </div>
                <div className="w-full bg-[#e8dcc0] rounded-full h-2.5 border border-[#c9b896] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#BD9B2C] to-[#81691A] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-[#c9b896]" />

          {/* Tombol Mulai */}
          <button
            onClick={() => isUnlocked && onMulai(marker.slug)}
            disabled={!isUnlocked}
            style={isUnlocked ? bgPaper : {}}
            className={`
              w-full font-black text-sm tracking-wide py-3.5 rounded-2xl
              transition-all duration-200 flex items-center justify-center gap-2
              ${isUnlocked
                ? "border-2 border-[#BD9B2C] text-[#5c4033] hover:bg-[#BD9B2C]/10 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-md"
                : "bg-[#e8dcc0]/50 text-[#a08060] border-2 border-[#c9b896] cursor-not-allowed"
              }
            `}
          >
            {isUnlocked ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                MULAI QUEST
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 64 64">
                  <path fill="#9ca3af" d="M2 28.3v31.4C2 62.1 3.9 64 6.3 64h51.4c2.4 0 4.3-1.9 4.3-4.3V28.3z"/>
                  <path fill="#d1d5db" d="M62 24c0-2.4-1.9-4.3-4.3-4.3H6.3C3.9 19.6 2 21.6 2 24v4.3h60z"/>
                  <path fill="#e5e7eb" d="M32 0C19.1 0 8.6 10.6 8.6 23.5c0 .8 1.6 1.4 3.8 1.4v-1.4c.8-11 9.3-19.7 19.6-19.7c10.4 0 18.9 8.7 19.6 19.7v1.4c2.2 0 3.8-.6 3.8-1.4C55.4 10.6 44.9 0 32 0"/>
                  <path fill="#6b7280" d="m36.6 56.4l-1.9-12.3c1.1-.8 1.9-2.2 1.9-3.7c0-2.5-2-4.6-4.6-4.6s-4.6 2.1-4.6 4.6c0 1.5.7 2.9 1.9 3.7l-1.9 12.3z"/>
                </svg>
                TERKUNCI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PetaNusantara({ userXP = 0 }) {
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const [cardUnlocked, setCardUnlocked] = useState(false);

  const mapRef = useRef(null);
  const navigate = useNavigate();

  const handleMarkerClick = (markerPos, markerData, isUnlocked) => {
    const mapRect = mapRef.current.getBoundingClientRect();
    const targetZoom = 2.5;

    const centerX = mapRect.width / 2;
    const centerY = mapRect.height / 2;

    const rawX = (markerPos.x - mapRect.left - translate.x) / zoom;
    const rawY = (markerPos.y - mapRect.top - translate.y) / zoom;

    setTranslate({
      x: centerX - rawX * targetZoom,
      y: centerY - rawY * targetZoom,
    });

    setZoom(targetZoom);
    setActiveCard(markerData);
    setCardUnlocked(isUnlocked);
  };

  const handleBack = () => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
    setActiveCard(null);
    setCardUnlocked(false);
  };

  return (
    <div ref={mapRef} className="relative w-full m-2 aspect-[16/8] overflow-hidden">
      <div
        className="w-full h-full transition-all duration-500"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        <Sumatra onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Jawa onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Kalimantan onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Papua onMarkerClick={handleMarkerClick} userXP={userXP} />
        <NusaTenggara onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Malaka onMarkerClick={handleMarkerClick} userXP={userXP} />
      </div>

      {activeCard && (
        <QuestCard
          marker={activeCard}
          onBack={handleBack}
          onMulai={(slug) => navigate(`/quest/${slug}`)}
          isUnlocked={cardUnlocked}
          userXP={userXP}
        />
      )}
    </div>
  );
}