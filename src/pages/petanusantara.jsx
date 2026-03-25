import { useState, useEffect, useRef } from "react";
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

const MAX_ZOOM = 4;

function QuestCard({ marker, onBack, onMulai, isUnlocked, userXP }) {
  const progress =
    marker.xpRequired > 0
      ? Math.min((userXP / marker.xpRequired) * 100, 100)
      : 100;

  const xpKurang = marker.xpRequired - userXP;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 md:p-6 pointer-events-none">
      
      <div
        className="
          w-full 
          max-w-[85%] 
          sm:max-w-sm 
          md:max-w-md 
          lg:max-w-lg
          max-h-[90vh] overflow-y-auto
          rounded-3xl overflow-hidden shadow-2xl 
          border-2 border-[#c9b896] 
          pointer-events-auto font-lora
          animate-[fadeIn_0.3s_ease]
        "
        style={bgPaper}
      >
        {/* THUMBNAIL */}
        <div className="relative h-28 sm:h-36 md:h-40">
          <img
            src={marker.thumbnail}
            alt={marker.nama}
            className={`w-full h-full object-cover ${
              !isUnlocked ? "grayscale opacity-60" : ""
            }`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* BACK BUTTON */}
          <div className="absolute top-2 left-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/30 hover:bg-white/30 active:scale-95 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
          </div>

          {/* TITLE */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-black text-base sm:text-lg leading-tight">
              {marker.nama}
            </p>
            <p className="text-white/60 text-[10px] mt-0.5">
              {marker.wilayah ?? "Sumatera"} · Indonesia
            </p>
          </div>

          {/* XP BADGE */}
          <div
            className={`absolute bottom-3 right-3 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-xl shadow-lg ${
              isUnlocked
                ? "bg-[#BD9B2C] text-white"
                : "bg-gray-500 text-gray-200"
            }`}
          >
            {isUnlocked
              ? `+${marker.xpReward} XP`
              : `🔒 ${marker.xpRequired} XP`}
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-3 sm:px-4 py-3 space-y-3">
          <p className="text-[#5c4033] text-xs sm:text-sm leading-relaxed">
            {marker.deskripsi}
          </p>

          {/* INFO GRID */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-xl px-2 py-2 text-center">
              <p className="text-[#5c4033] font-black text-base sm:text-lg">
                {marker.totalSoal}
              </p>
              <p className="text-[#a08060] text-[9px] mt-0.5">Soal</p>
            </div>

            <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-xl px-2 py-2 text-center">
              <p className="text-[#5c4033] font-black text-xs sm:text-sm">
                {marker.estimasiMenit ??
                  Math.ceil(marker.totalSoal * 1.5)}{" "}
                mnt
              </p>
              <p className="text-[#a08060] text-[9px] mt-0.5">
                Estimasi
              </p>
            </div>

            <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-xl px-2 py-2 text-center">
              <p className="text-[#5c4033] font-black text-xs sm:text-sm truncate">
                {marker.wilayah ?? "Sumatera"}
              </p>
              <p className="text-[#a08060] text-[9px] mt-0.5">
                Wilayah
              </p>
            </div>
          </div>

          {/* LOCKED INFO */}
          {!isUnlocked && (
            <div className="bg-[#8b3a3a]/10 border border-[#8b3a3a]/20 rounded-xl px-3 py-2 space-y-2">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <p className="text-[#8b3a3a] font-semibold text-xs">
                  Belum bisa dimulai
                </p>
              </div>

              <p className="text-[#8b3a3a]/70 text-[10px]">
                Butuh{" "}
                <span className="font-bold">{xpKurang} XP lagi</span>{" "}
                untuk membuka lokasi ini
              </p>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#a08060] text-[9px]">
                    Progress XP
                  </span>
                  <span className="text-[#5c4033] text-[9px] font-bold">
                    {userXP} / {marker.xpRequired} XP
                  </span>
                </div>

                <div className="w-full bg-[#e8dcc0] rounded-full h-2 border border-[#c9b896] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#BD9B2C] to-[#81691A] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-[#c9b896]" />

          {/* BUTTON */}
          <button
            onClick={() => isUnlocked && onMulai(marker.slug)}
            disabled={!isUnlocked}
            style={isUnlocked ? bgPaper : {}}
            className={`
              w-full font-black text-[11px] tracking-wide py-2.5 rounded-xl
              transition-all duration-200 flex items-center justify-center gap-2
              ${
                isUnlocked
                  ? "border-2 border-[#BD9B2C] text-[#5c4033] hover:bg-[#BD9B2C]/10 active:scale-95 cursor-pointer shadow-md"
                  : "bg-[#e8dcc0]/50 text-[#a08060] border-2 border-[#c9b896] cursor-not-allowed"
              }
            `}
          >
            {isUnlocked ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                MULAI QUEST
              </>
            ) : (
              <>
                🔒 TERKUNCI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────
function calcInitial(cW, cH) {
  const mapW = 1200;
  const mapH = 675;

  const scaleX = cW / mapW;
  const scaleY = cH / mapH;

  const z = Math.min(scaleX, scaleY);

  return {
    z,
    tx: (cW - mapW * z) / 2,
    ty: (cH - mapH * z) / 2,
  };
}

// Helper: apakah perangkat touch/mobile/iPad
function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

// Clamp translate agar peta tidak keluar layar terlalu jauh
function clampTranslate(tx, ty, zoom, cW, cH) {
  const mapW = 1600 * zoom;
  const mapH = 1200 * zoom;

  // Batas: peta masih kelihatan minimal 100px di dalam layar
  const margin = 100;
  const minX = Math.min(0, cW - mapW + margin);
  const maxX = Math.max(0, cW - mapW) + (mapW > cW ? margin : 0);
  const minY = Math.min(0, cH - mapH + margin);
  const maxY = Math.max(0, cH - mapH) + (mapH > cH ? margin : 0);

  return {
    x: Math.min(Math.max(tx, minX), maxX),
    y: Math.min(Math.max(ty, minY), maxY),
  };
}

// ─────────────────────────────────────────────────────────────
export default function PetaNusantara({ userXP = 0 }) {
  const mapRef   = useRef(null);
  const innerRef = useRef(null);
  const navigate = useNavigate();

  const [zoom,         setZoom]         = useState(1);
  const [translate,    setTranslate]    = useState({ x: 0, y: 0 });
  const [activeCard,   setActiveCard]   = useState(null);
  const [cardUnlocked, setCardUnlocked] = useState(false);
  const [isAnimating,  setIsAnimating]  = useState(false);

  const zoomRef      = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const activeCardRef = useRef(null);
  const minZoomRef   = useRef(1);
  const initialRef   = useRef({ z: 1, tx: 0, ty: 0 });

  // ── Gesture state refs (hanya dipakai untuk touch) ──────────
  const gesture = useRef({
    isDragging:    false,
    lastX:         0,
    lastY:         0,
    lastDist:      null,   // jarak dua jari terakhir (pinch)
    startZoom:     1,      // zoom saat pinch mulai
    startTx:       0,
    startTy:       0,
    startMidX:     0,      // titik tengah dua jari saat pinch mulai
    startMidY:     0,
    moved:         false,  // apakah sudah bergerak (bedain tap vs drag)
  });

  useEffect(() => { zoomRef.current      = zoom;      }, [zoom]);
  useEffect(() => { translateRef.current = translate; }, [translate]);
  useEffect(() => { activeCardRef.current = activeCard; }, [activeCard]);

  // ── Init zoom ────────────────────────────────────────────────
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    const raf = requestAnimationFrame(() => {
      const cW = el.clientWidth;
      const cH = el.clientHeight;
      const { z, tx, ty } = calcInitial(cW, cH);

      zoomRef.current      = z;
      translateRef.current = { x: tx, y: ty };
      minZoomRef.current   = z;
      initialRef.current   = { z, tx, ty };

      setZoom(z);
      setTranslate({ x: tx, y: ty });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Touch event handlers (hanya aktif di touch device) ──────
  useEffect(() => {
    const el = mapRef.current;
    if (!el || !isTouchDevice()) return;

    const getTouchDist = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchMid = (touches) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    const onTouchStart = (e) => {
      // Jika ada card aktif, biarkan touch di area card jalan normal
      if (activeCardRef.current) return;

      const g = gesture.current;
      g.moved = false;

      if (e.touches.length === 1) {
        g.isDragging = true;
        g.lastX      = e.touches[0].clientX;
        g.lastY      = e.touches[0].clientY;
        g.lastDist   = null;
      } else if (e.touches.length === 2) {
        g.isDragging  = false;
        g.lastDist    = getTouchDist(e.touches);
        g.startZoom   = zoomRef.current;
        g.startTx     = translateRef.current.x;
        g.startTy     = translateRef.current.y;
        const mid     = getTouchMid(e.touches);
        g.startMidX   = mid.x;
        g.startMidY   = mid.y;
      }
    };

    const onTouchMove = (e) => {
      if (activeCardRef.current) return;

      e.preventDefault(); // cegah scroll browser
      const g = gesture.current;
      const cW = el.clientWidth;
      const cH = el.clientHeight;

      if (e.touches.length === 1 && g.isDragging) {
        const dx = e.touches[0].clientX - g.lastX;
        const dy = e.touches[0].clientY - g.lastY;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) g.moved = true;

        const raw = {
          x: translateRef.current.x + dx,
          y: translateRef.current.y + dy,
        };
        const clamped = clampTranslate(raw.x, raw.y, zoomRef.current, cW, cH);

        translateRef.current = clamped;
        setTranslate(clamped);

        g.lastX = e.touches[0].clientX;
        g.lastY = e.touches[0].clientY;

      } else if (e.touches.length === 2 && g.lastDist !== null) {
        const newDist  = getTouchDist(e.touches);
        const scale    = newDist / g.lastDist;
        const newZoom  = Math.min(Math.max(g.startZoom * scale, minZoomRef.current), MAX_ZOOM);

        // Zoom ke arah titik tengah dua jari
        const mid    = getTouchMid(e.touches);
        const ratio  = newZoom / g.startZoom;
        const newTx  = mid.x - ratio * (g.startMidX - g.startTx);
        const newTy  = mid.y - ratio * (g.startMidY - g.startTy);

        const clamped = clampTranslate(newTx, newTy, newZoom, cW, cH);

        zoomRef.current      = newZoom;
        translateRef.current = clamped;
        setZoom(newZoom);
        setTranslate(clamped);

        g.moved = true;
      }
    };

    const onTouchEnd = (e) => {
      const g = gesture.current;
      if (e.touches.length === 0) {
        g.isDragging = false;
        g.lastDist   = null;
      } else if (e.touches.length === 1) {
        // Sisa 1 jari setelah pinch → lanjut drag
        g.isDragging = true;
        g.lastX      = e.touches[0].clientX;
        g.lastY      = e.touches[0].clientY;
        g.lastDist   = null;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove",  onTouchMove,  { passive: false });
    el.addEventListener("touchend",   onTouchEnd,   { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove",  onTouchMove);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, []); // sekali mount sudah cukup karena pakai ref

  // ─────────────────────────────────────────────────────────────
  const handleMarkerClick = (markerPos, markerData, isUnlocked) => {
    if (!mapRef.current) return;

    // Kalau user baru saja drag (bukan tap), abaikan
    if (gesture.current.moved) {
      gesture.current.moved = false;
      return;
    }

    const mapRect = mapRef.current.getBoundingClientRect();

    const targetZoom      = 2.8;
    const horizontalFocus = 0.45;
    const verticalFocus   = 0.45;

    const focalX = mapRect.width  * horizontalFocus;
    const focalY = mapRect.height * verticalFocus;

    const rawX = (markerPos.x - mapRect.left - translate.x) / zoom;
    const rawY = (markerPos.y - mapRect.top  - translate.y) / zoom;

    setIsAnimating(true);
    setTranslate({
      x: focalX - rawX * targetZoom,
      y: focalY - rawY * targetZoom,
    });
    setZoom(targetZoom);
    setActiveCard(markerData);
    setCardUnlocked(isUnlocked);
  };

  // ─────────────────────────────────────────────────────────────
  const handleBack = () => {
    const mobile = isTouchDevice();
    const { z, tx, ty } = initialRef.current;

    zoomRef.current      = z;
    translateRef.current = { x: tx, y: ty };

    setIsAnimating(!mobile);
    setZoom(z);
    setTranslate({ x: tx, y: ty });

    setActiveCard(null);
    setCardUnlocked(false);
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={mapRef}
      className="relative w-full h-full overflow-hidden"
      style={{ touchAction: "none" }}
    >
      <div
        ref={innerRef}
        className="absolute top-0 left-0"
        style={{
          width: "1200px",
          height: "675px",
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: isAnimating ? "transform 500ms ease" : "none",
        }}
        onTransitionEnd={() => setIsAnimating(false)}
      >
        <Sumatra      onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Jawa         onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Kalimantan   onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Papua        onMarkerClick={handleMarkerClick} userXP={userXP} />
        <NusaTenggara onMarkerClick={handleMarkerClick} userXP={userXP} />
        <Malaka       onMarkerClick={handleMarkerClick} userXP={userXP} />
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