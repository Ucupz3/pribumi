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

// Mapping nama pulau dari API ke komponen
const ISLAND_SLUG_MAP = {
  jawa: "jawa",
  sumatra: "sumatra",
  sumatera: "sumatra",
  kalimantan: "kalimantan",
  papua: "papua",
  "nusa-tenggara": "nusatenggara",
  maluku: "malaka",
};

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
              {marker.wilayah ?? "Indonesia"} · Indonesia
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
                {marker.estimasiMenit ?? Math.ceil(marker.totalSoal * 1.5)} mnt
              </p>
              <p className="text-[#a08060] text-[9px] mt-0.5">Estimasi</p>
            </div>

            <div className="bg-[#e8dcc0]/60 border border-[#c9b896] rounded-xl px-2 py-2 text-center">
              <p className="text-[#5c4033] font-black text-xs sm:text-sm truncate">
                {marker.wilayah ?? "Indonesia"}
              </p>
              <p className="text-[#a08060] text-[9px] mt-0.5">Wilayah</p>
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
                Butuh <span className="font-bold">{xpKurang} XP lagi</span>{" "}
                untuk membuka lokasi ini
              </p>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#a08060] text-[9px]">Progress XP</span>
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
              <>🔒 TERKUNCI</>
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
  return { z, tx: (cW - mapW * z) / 2, ty: (cH - mapH * z) / 2 };
}

function isTouchDevice() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function clampTranslate(tx, ty, zoom, cW, cH) {
  const mapW = 1600 * zoom;
  const mapH = 1200 * zoom;
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
// Helper: normalisasi data dari API ke format marker yang dipakai komponen pulau
// Struktur API: Island → Chapters → Levels
// Kita flatten levels menjadi markers, pakai data chapter/level sesuai kebutuhan
function normalizeIslandMarkers(islandData) {
  const markers = [];

  if (!islandData?.chapters) return markers;

  islandData.chapters.forEach((chapter) => {
    if (!chapter?.levels) return;
    chapter.levels.forEach((level) => {
      markers.push({
        // ID & identitas
        id: level.id,
        slug: level.slug ?? `level-${level.id}`,

        // Tampilan
        nama: level.name ?? level.title ?? chapter.name,
        wilayah: islandData.name,
        deskripsi: level.description ?? chapter.description ?? "",
        thumbnail:
          level.thumbnailUrl ??
          chapter.thumbnailUrl ??
          `/images/Quest/${level.slug ?? "default"}.jpg`,

        // Posisi marker di peta (pakai koordinat dari API jika ada, fallback ke posisi chapter)
        top: level.mapTop ?? chapter.mapTop ?? "50%",
        left: level.mapLeft ?? chapter.mapLeft ?? "50%",

        // Gameplay
        xpRequired: level.xpRequired ?? chapter.xpRequired ?? 0,
        xpReward: level.xpReward ?? chapter.xpReward ?? 0,
        totalSoal: level.totalQuestions ?? 0,
        estimasiMenit:
          level.estimatedMinutes ??
          Math.ceil((level.totalQuestions ?? 0) * 1.5),

        // Progress dari API (jika ada)
        isCompleted: level.userProgress?.isCompleted ?? false,
        bestScore: level.userProgress?.bestScore ?? 0,
      });
    });
  });

  return markers;
}

// ─────────────────────────────────────────────────────────────
export default function PetaNusantara({ userXP = 0 }) {
  const mapRef = useRef(null);
  const innerRef = useRef(null);
  const navigate = useNavigate();

  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);
  const [cardUnlocked, setCardUnlocked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ── State data dari API ──────────────────────────────────────
  const [islandMarkers, setIslandMarkers] = useState({
    jawa: [],
    sumatra: [],
    kalimantan: [],
    papua: [],
    nusatenggara: [],
    malaka: [],
  });
  const [loadingMap, setLoadingMap] = useState(true);
  const [errorMap, setErrorMap] = useState("");

  const zoomRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const activeCardRef = useRef(null);
  const minZoomRef = useRef(1);
  const initialRef = useRef({ z: 1, tx: 0, ty: 0 });

  const gesture = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    lastDist: null,
    startZoom: 1,
    startTx: 0,
    startTy: 0,
    startMidX: 0,
    startMidY: 0,
    moved: false,
  });

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    translateRef.current = translate;
  }, [translate]);
  useEffect(() => {
    activeCardRef.current = activeCard;
  }, [activeCard]);

  // ── Fetch data semua pulau dari API ──────────────────────────
  useEffect(() => {
    const fetchMapData = async () => {
      setLoadingMap(true);
      setErrorMap("");

      try {
        const token = localStorage.getItem("access_token");

        // ✅ Fetch semua pulau sekaligus
        const res = await fetch("https://nusa-api.vercel.app/map/islands", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          // Token expired → redirect ke login
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (!data.success) {
          setErrorMap("Gagal memuat data peta.");
          return;
        }

        const islands = data.data ?? [];

        // ✅ Fetch chapters+levels untuk tiap pulau secara paralel
        const detailResults = await Promise.allSettled(
          islands.map((island) =>
            fetch(
              `https://nusa-api.vercel.app/map/islands/${island.id}/chapters`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            ).then((r) => r.json()),
          ),
        );

        // ✅ Gabungkan data island + chapters
        const newMarkers = {
          jawa: [],
          sumatra: [],
          kalimantan: [],
          papua: [],
          nusatenggara: [],
          malaka: [],
        };

        islands.forEach((island, i) => {
          const result = detailResults[i];
          if (result.status !== "fulfilled" || !result.value.success) return;

          const islandWithChapters = {
            ...island,
            chapters: result.value.data ?? [],
          };

          const slugKey =
            ISLAND_SLUG_MAP[island.slug?.toLowerCase()] ??
            island.slug?.toLowerCase();
          if (slugKey && newMarkers[slugKey] !== undefined) {
            newMarkers[slugKey] = normalizeIslandMarkers(islandWithChapters);
          }
        });

        setIslandMarkers(newMarkers);
      } catch (err) {
        setErrorMap("Tidak dapat terhubung ke server.");
      } finally {
        setLoadingMap(false);
      }
    };

    fetchMapData();
  }, [navigate]);

  // ── Init zoom ────────────────────────────────────────────────
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    const raf = requestAnimationFrame(() => {
      const cW = el.clientWidth;
      const cH = el.clientHeight;
      const { z, tx, ty } = calcInitial(cW, cH);

      zoomRef.current = z;
      translateRef.current = { x: tx, y: ty };
      minZoomRef.current = z;
      initialRef.current = { z, tx, ty };

      setZoom(z);
      setTranslate({ x: tx, y: ty });
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Touch handlers ───────────────────────────────────────────
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
      if (activeCardRef.current) return;
      const g = gesture.current;
      g.moved = false;

      if (e.touches.length === 1) {
        g.isDragging = true;
        g.lastX = e.touches[0].clientX;
        g.lastY = e.touches[0].clientY;
        g.lastDist = null;
      } else if (e.touches.length === 2) {
        g.isDragging = false;
        g.lastDist = getTouchDist(e.touches);
        g.startZoom = zoomRef.current;
        g.startTx = translateRef.current.x;
        g.startTy = translateRef.current.y;
        const mid = getTouchMid(e.touches);
        g.startMidX = mid.x;
        g.startMidY = mid.y;
      }
    };

    const onTouchMove = (e) => {
      if (activeCardRef.current) return;
      e.preventDefault();
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
        const newDist = getTouchDist(e.touches);
        const scale = newDist / g.lastDist;
        const newZoom = Math.min(
          Math.max(g.startZoom * scale, minZoomRef.current),
          MAX_ZOOM,
        );
        const mid = getTouchMid(e.touches);
        const ratio = newZoom / g.startZoom;
        const newTx = mid.x - ratio * (g.startMidX - g.startTx);
        const newTy = mid.y - ratio * (g.startMidY - g.startTy);
        const clamped = clampTranslate(newTx, newTy, newZoom, cW, cH);

        zoomRef.current = newZoom;
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
        g.lastDist = null;
      } else if (e.touches.length === 1) {
        g.isDragging = true;
        g.lastX = e.touches[0].clientX;
        g.lastY = e.touches[0].clientY;
        g.lastDist = null;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // ── Marker click ─────────────────────────────────────────────
  const handleMarkerClick = (markerPos, markerData, isUnlocked) => {
    if (!mapRef.current) return;
    if (gesture.current.moved) {
      gesture.current.moved = false;
      return;
    }

    const mapRect = mapRef.current.getBoundingClientRect();
    const targetZoom = 2.8;
    const horizontalFocus = 0.45;
    const verticalFocus = 0.45;
    const focalX = mapRect.width * horizontalFocus;
    const focalY = mapRect.height * verticalFocus;
    const rawX = (markerPos.x - mapRect.left - translate.x) / zoom;
    const rawY = (markerPos.y - mapRect.top - translate.y) / zoom;

    setIsAnimating(true);
    setTranslate({
      x: focalX - rawX * targetZoom,
      y: focalY - rawY * targetZoom,
    });
    setZoom(targetZoom);
    setActiveCard(markerData);
    setCardUnlocked(isUnlocked);
  };

  // ── Back ─────────────────────────────────────────────────────
  const handleBack = () => {
    const mobile = isTouchDevice();
    const { z, tx, ty } = initialRef.current;

    zoomRef.current = z;
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
      {/* Loading overlay */}
      {loadingMap && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/90 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl font-lora">
            <div className="w-5 h-5 border-2 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#5c4033] font-semibold text-sm">
              Memuat peta...
            </span>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {errorMap && !loadingMap && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 rounded-2xl px-6 py-4 text-center shadow-xl font-lora max-w-xs">
            <p className="text-red-600 font-semibold text-sm mb-3">
              {errorMap}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-[#BD9B2C] font-bold text-xs border border-[#BD9B2C] px-4 py-1.5 rounded-full hover:bg-[#BD9B2C]/10 transition-all"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

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
        {/* ✅ Semua komponen pulau sekarang menerima markers dari API */}
        <Sumatra
          onMarkerClick={handleMarkerClick}
          userXP={userXP}
          markers={islandMarkers.sumatra}
        />
        <Jawa
          onMarkerClick={handleMarkerClick}
          userXP={userXP}
          markers={islandMarkers.jawa}
        />
        <Kalimantan
          onMarkerClick={handleMarkerClick}
          userXP={userXP}
          markers={islandMarkers.kalimantan}
        />
        <Papua
          onMarkerClick={handleMarkerClick}
          userXP={userXP}
          markers={islandMarkers.papua}
        />
        <NusaTenggara
          onMarkerClick={handleMarkerClick}
          userXP={userXP}
          markers={islandMarkers.nusatenggara}
        />
        <Malaka
          onMarkerClick={handleMarkerClick}
          userXP={userXP}
          markers={islandMarkers.malaka}
        />
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
