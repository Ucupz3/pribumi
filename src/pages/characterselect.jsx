import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CHARACTERS = [
  {
    id: "mas_jaka",
    label: "Mas Jaka",
    avatar: "/images/avatar/mas_jaka.png",
  },
  {
    id: "lilis_dayak",
    label: "Lilis",
    avatar: "/images/avatar/lilis.png",
  },
];

export default function CharacterSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("mas_jaka");
  const [namaChar, setNamaChar] = useState("");
  const [hovered, setHovered] = useState(null);

  const handleStart = () => {
    if (!namaChar.trim()) return;
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 font-lora relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/bgpaper.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Soft vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(60,35,10,0.45) 100%)",
        }}
      />

      {/* Decorative top ornament */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
        {/* Logo */}
        <img
          src="/images/logofx.png"
          alt="logo"
          className="w-32 sm:w-40 lg:w-52 mb-3 drop-shadow-lg"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 mb-4 w-full justify-center">
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to right, transparent, #BD9B2C)" }} />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#BD9B2C" className="opacity-80">
            <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
          </svg>
          <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(to left, transparent, #BD9B2C)" }} />
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-1 tracking-wide"
          style={{
            color: "#BD9B2C",
            textShadow: "0 2px 12px rgba(189,155,44,0.25), 0 1px 0 rgba(255,255,255,0.15)",
            letterSpacing: "0.06em",
          }}
        >
          Pilih Karaktermu
        </h1>
        <p className="text-xs sm:text-sm text-center mb-8 italic" style={{ color: "#a08060" }}>
          Siapa yang akan menemanimu hari ini?
        </p>

        {/* CHARACTER SELECTION — clean, no borders/backgrounds */}
        <div className="flex items-end justify-center gap-8 sm:gap-14 lg:gap-20 mb-10 w-full">
          {CHARACTERS.map((c) => {
            const isActive = selected === c.id;
            const isHovered = hovered === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                className="flex flex-col items-center focus:outline-none group"
                style={{
                  transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1), opacity 0.3s",
                  transform: isActive
                    ? "scale(1.12) translateY(-6px)"
                    : isHovered
                    ? "scale(1.04) translateY(-2px)"
                    : "scale(0.93) translateY(0px)",
                  opacity: isActive ? 1 : 0.55,
                }}
              >
                <img
                  src={c.avatar}
                  alt={c.label}
                  className="object-contain w-36 sm:w-48 lg:w-64"
                  style={{
                    filter: isActive
                      ? "drop-shadow(0 16px 32px rgba(189,155,44,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.18))"
                      : "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
                    transition: "filter 0.35s",
                  }}
                />

                {/* Name with animated underline indicator */}
                <div className="mt-3 flex flex-col items-center gap-1">
                  <span
                    className="font-semibold text-sm sm:text-base tracking-wider"
                    style={{
                      color: isActive ? "#5c3d1e" : "#a08060",
                      transition: "color 0.3s",
                      textShadow: isActive ? "0 1px 4px rgba(189,155,44,0.18)" : "none",
                    }}
                  >
                    {c.label}
                  </span>
                  <div
                    style={{
                      height: "2px",
                      width: isActive ? "100%" : "0%",
                      background: "linear-gradient(90deg, #BD9B2C, #e8c96a)",
                      borderRadius: "2px",
                      transition: "width 0.4s cubic-bezier(.34,1.56,.64,1)",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* INPUT NAMA */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={namaChar}
              onChange={(e) => setNamaChar(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="Masukkan nama karaktermu..."
              maxLength={24}
              className="w-full px-4 py-3 rounded-2xl focus:outline-none text-sm sm:text-base"
              style={{
                background: "rgba(255,252,245,0.82)",
                border: "1.5px solid #d4b87a",
                color: "#3d2a10",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 12px rgba(189,155,44,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
                fontFamily: "inherit",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#BD9B2C";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(189,155,44,0.15), inset 0 1px 0 rgba(255,255,255,0.6)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d4b87a";
                e.target.style.boxShadow =
                  "0 2px 12px rgba(189,155,44,0.10), inset 0 1px 0 rgba(255,255,255,0.6)";
              }}
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!namaChar.trim()}
            style={{
              background: namaChar.trim()
                ? "linear-gradient(135deg, #c9a83c 0%, #BD9B2C 50%, #a07820 100%)"
                : "rgba(189,155,44,0.3)",
              color: namaChar.trim() ? "#fff" : "rgba(255,255,255,0.5)",
              border: "none",
              borderRadius: "16px",
              padding: "13px 0",
              fontWeight: "700",
              fontSize: "1rem",
              letterSpacing: "0.05em",
              fontFamily: "inherit",
              cursor: namaChar.trim() ? "pointer" : "not-allowed",
              boxShadow: namaChar.trim()
                ? "0 4px 18px rgba(189,155,44,0.35), 0 1px 0 rgba(255,255,255,0.15) inset"
                : "none",
              transition: "transform 0.18s, box-shadow 0.18s, background 0.25s",
            }}
            onMouseEnter={(e) => {
              if (!namaChar.trim()) return;
              e.target.style.transform = "scale(1.02)";
              e.target.style.boxShadow = "0 6px 24px rgba(189,155,44,0.45), 0 1px 0 rgba(255,255,255,0.15) inset";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = namaChar.trim()
                ? "0 4px 18px rgba(189,155,44,0.35), 0 1px 0 rgba(255,255,255,0.15) inset"
                : "none";
            }}
            onMouseDown={(e) => {
              if (!namaChar.trim()) return;
              e.target.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              if (!namaChar.trim()) return;
              e.target.style.transform = "scale(1.02)";
            }}
          >
            ✦ Mulai Petualangan ✦
          </button>
        </div>

        {/* Bottom ornament */}
        <div className="flex items-center gap-3 mt-7 w-full justify-center opacity-50">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, #BD9B2C)" }} />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#BD9B2C">
            <circle cx="12" cy="12" r="4" />
          </svg>
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, #BD9B2C)" }} />
        </div>
      </div>
    </div>
  );
}