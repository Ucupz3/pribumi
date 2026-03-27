import { useState, useEffect } from "react";
import { BADGE_CATEGORIES } from "../config/badgeConfig";
import { getUserProfile, updateUserProfile } from "../api/userApi";
import { getUserProgress } from "../api/badgesApi";

const AVATAR_OPTIONS = [
  "/images/avatar/mas_jaka.png",
  "/images/avatar/lilis.png",
];

const bgStyle = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

// ================== EMAIL CONFIG ==================
const email = "support@nusantaraquest.com"; // ganti email tujuan

const subject = encodeURIComponent("Pertanyaan tentang Nusantara Quest");

const body = encodeURIComponent(
`Halo, selamat siang 👋

Saya ingin bertanya tentang Nusantara Quest.

- Cara bermainnya bagaimana ya?
- Saya mengalami kendala di aplikasi.

Terima kasih 🙏`
);

const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
// ==================================================
// ── Helper XP ─────────────────────────────────────────────────
// Sesuaikan dengan fungsi calculateLevel di backend
const getXpForLevel = (level) => level * 500;

// ===== GEMBOK SVG =====
function GembokIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 64 64"
    >
      <path
        fill="#ffce31"
        d="M2 28.3v31.4C2 62.1 3.9 64 6.3 64h51.4c2.4 0 4.3-1.9 4.3-4.3V28.3z"
      />
      <path
        fill="#ff8736"
        d="M62 24c0-2.4-1.9-4.3-4.3-4.3H6.3C3.9 19.6 2 21.6 2 24v4.3h60z"
      />
      <g fill="#3e4347">
        <ellipse cx="12.4" cy="23.5" rx="5.9" ry="2.5" />
        <ellipse cx="51.6" cy="23.5" rx="5.9" ry="2.5" />
      </g>
      <path
        fill="#dfe9ef"
        d="M32 0C19.1 0 8.6 10.6 8.6 23.5c0 .8 1.6 1.4 3.8 1.4v-1.4c.8-11 9.3-19.7 19.6-19.7c10.4 0 18.9 8.7 19.6 19.7v1.4c2.2 0 3.8-.6 3.8-1.4C55.4 10.6 44.9 0 32 0"
      />
      <path
        fill="#b0bdc6"
        d="M51.6 23.5C50.9 12.6 42.4 3.9 32 3.9s-18.9 8.7-19.6 19.7V25c2.2 0 4.2-.6 4.2-1.4C16.5 16.4 22.5 8 32 8s15.5 8.4 15.5 15.5c0 .8 2 1.4 4.2 1.4z"
      />
      <path
        fill="#3e4347"
        d="m36.6 56.4l-1.9-12.3c1.1-.8 1.9-2.2 1.9-3.7c0-2.5-2-4.6-4.6-4.6s-4.6 2.1-4.6 4.6c0 1.5.7 2.9 1.9 3.7l-1.9 12.3z"
      />
    </svg>
  );
}

// ===== POPUP EDIT PROFIL =====
function EditPopup({ user, onClose, onSave }) {
  const [nama, setNama] = useState(user.nama);
  const [avatar, setAvatar] = useState(user.avatar);
  const [namaError, setNamaError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNamaChange = (e) => {
    const val = e.target.value;
    setNama(val);
    if (!val.trim()) setNamaError("Nama tidak boleh kosong");
    else if (val.trim().length < 3) setNamaError("Nama minimal 3 karakter");
    else setNamaError("");
  };

  const handleSave = async () => {
    if (namaError || !nama.trim()) return;
    setSaveError("");
    setLoading(true);
    try {
      await onSave({ nama: nama.trim(), avatar });
      onClose();
    } catch (err) {
      setSaveError(
        err?.message === "USERNAME_TAKEN"
          ? "Nama sudah digunakan orang lain"
          : "Gagal menyimpan. Coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

return (
    <>
      {/* Overlay tetap sama */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* MODAL CONTAINER: Perhatikan perubahan pada class w-[92%] dan max-w-md */}
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-[#c9b896] font-lora"
        style={bgStyle}
      >
        {/* HEADER: Dibuat sedikit lebih ramping di mobile */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-b-2 border-[#c9b896] flex items-center justify-between">
          <p className="text-[#5c4033] font-black text-lg">Edit Profil</p>
          <button
            onClick={onClose}
            className="text-[#a08060] hover:text-[#5c4033] transition-colors p-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CONTENT BODY */}
        <div className="px-5 py-5 sm:px-6 sm:py-6 space-y-5">
          {/* AVATAR PREVIEW */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#BD9B2C] overflow-hidden shadow-lg bg-[#e8dcc0]">
              <img
                src={avatar}
                alt="preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* PILIH AVATAR: Grid diperbaiki agar lebih fleksibel */}
          <div>
            <p className="text-[#5c4033] text-sm font-bold mb-3">
              Pilih Avatar
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`
                    w-full aspect-square rounded-full overflow-hidden border-2 transition-all duration-200
                    ${
                      avatar === av
                        ? "border-[#BD9B2C] ring-2 ring-[#BD9B2C] ring-offset-1 scale-105"
                        : "border-[#c9b896] hover:border-[#BD9B2C] opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <img
                    src={av}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.parentElement.style.display = "none";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INPUT NAMA */}
          <div>
            <p className="text-[#5c4033] text-sm font-bold mb-2">Nama</p>
            <input
              type="text"
              value={nama}
              onChange={handleNamaChange}
              maxLength={50}
              placeholder="Masukkan nama..."
              style={bgStyle}
              className={`
                w-full px-4 py-2.5 sm:py-3 rounded-xl border-2 text-sm font-lora outline-none
                text-[#5c4033] placeholder-[#b8a88a] transition-all duration-200
                ${
                  namaError
                    ? "border-red-400"
                    : nama !== user.nama
                      ? "border-[#4a7c59]"
                      : "border-[#c9b896] focus:border-[#BD9B2C]"
                }
              `}
            />
            <div className="flex justify-between mt-1.5 px-1">
              <p className={`text-[10px] sm:text-xs ${namaError ? "text-red-500 font-semibold" : "text-transparent"}`}>
                {namaError || "ok"}
              </p>
              <p className="text-[#a08060] text-[10px] sm:text-xs">{nama.length}/50</p>
            </div>
          </div>

          {saveError && (
            <p className="text-xs text-red-500 text-center font-semibold">
              {saveError}
            </p>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              style={bgStyle}
              className="flex-1 border-2 border-[#c9b896] text-[#a08060] font-bold text-sm py-2.5 sm:py-3 rounded-xl hover:border-[#a08060] active:scale-95 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!!namaError || !nama.trim() || loading}
              className={`
                flex-1 font-bold text-sm py-2.5 sm:py-3 rounded-xl
                transition-all duration-200 flex items-center justify-center gap-2
                ${
                  !namaError && nama.trim() && !loading
                    ? "border-2 border-[#BD9B2C] text-[#5c4033] bg-[#BD9B2C]/5 hover:bg-[#BD9B2C]/20 active:scale-95"
                    : "bg-[#e8dcc0] text-[#a08060] cursor-not-allowed border-2 border-[#c9b896]"
                }
              `}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ===== HALAMAN AKUN =====
const Akun = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("access_token");

    // Redirect ke halaman login
    window.location.href = "/login"; // kalau pakai react-router: navigate("/login")
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchAll = async () => {
      try {
        const [profileData, progressData] = await Promise.all([
          getUserProfile(),
          getUserProgress(),
        ]);

        if (!profileData) {
          window.location.href = "/login";
          return;
        }

        // ── Hitung xpMax dari level karena backend tidak return field ini ──
        const level = profileData.level ?? 1;
        const xpMax = getXpForLevel(level + 1);
        setUser({ ...profileData, xpMax });

        // ── FIX: progressData shape = { user, stats, progress } ──────────
        // Akses via progressData.stats, bukan progressData langsung
        if (progressData?.stats) {
          const s = progressData.stats;
          setStats({
            totalXP: s.totalXP ?? s.totalXp ?? profileData.xp ?? 0,
            pulauDijelajahi: s.pulauDijelajahi ?? s.islandsExplored ?? 0,
            questSelesai: s.questSelesai ?? s.markersCompleted ?? 0,
            menitBermain: s.menitBermain ?? s.minutesPlayed ?? 0,
            questPerfect: s.questPerfect ?? s.perfectQuests ?? 0,
            pulauKomplit: s.pulauKomplit ?? s.islandsCompleted ?? 0,
          });
        } else {
          // Fallback jika progress gagal
          setStats({
            totalXP: profileData.xp ?? 0,
            pulauDijelajahi: 0,
            questSelesai: 0,
            menitBermain: 0,
            questPerfect: 0,
            pulauKomplit: 0,
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading || !user) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={bgStyle}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#5c4033] font-semibold font-lora">
            Memuat Akun...
          </p>
        </div>
      </div>
    );
  }

  const xpPersen = Math.min((user.xp / user.xpMax) * 100, 100);

  // ── FIX: handleSave update state user dengan data terbaru dari API ──
  const handleSave = async (updated) => {
    const data = await updateUserProfile(updated);
    if (data) {
      // updateUserProfile sudah return mapped user via mapUser()
      // Pertahankan xpMax yang sudah dihitung sebelumnya
      const level = data.level ?? user.level;
      const xpMax = getXpForLevel(level + 1);
      setUser({ ...data, xpMax });
    }
  };

  return (
    <div
      className="min-h-screen w-full px-6 md:px-16 py-10 flex justify-center font-lora"
      style={bgStyle}
    >
      <div className="w-full">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-lg border-4 border-[#BD9B2C] overflow-hidden shadow-lg flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#e8dcc0] flex items-center justify-center text-[#5c4033] font-black text-4xl">
                {user.nama.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col gap-4 max-w-md">
              <h1 className="text-3xl 2xl:text-5xl font-bold text-[#5c4033] leading-tight">
                {user.nama}
              </h1>
              <p className="text-xl font-bold text-[#5c4033]">
                Level {user.level}
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-xl text-[#5c4033] font-bold">XP</p>
                <div className="w-52 md:w-full h-7 bg-[#e8dcc0] rounded-full border-2 p-1 border-[#c9b896] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#81691A] to-[#BD9B2C] rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                    style={{ width: `${xpPersen}%` }}
                  >
                    {xpPersen > 20 && (
                      <span className="text-xs font-bold text-white whitespace-nowrap">
                        {(user.xp ?? 0).toLocaleString("id-ID")} /{" "}
                        {(user.xpMax ?? 0).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                </div>
                {xpPersen <= 20 && (
                  <p className="text-xs text-[#a08060]">
                    {(user.xp ?? 0).toLocaleString("id-ID")} /{" "}
                    {(user.xpMax ?? 0).toLocaleString("id-ID")} XP
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="lg:text-3xl text-xl font-medium text-[#5c4033] font-serif mb-10 border-b-2 border-[#C2AF9F] pb-2">
            Achievements
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-6 justify-items-center border-b-2 border-[#C2AF9F] pb-8 mb-6">
            {BADGE_CATEGORIES.map((cat) => {
              const tierIndex = stats ? cat.cek(stats) : -1;
              const isUnlocked = tierIndex >= 0;
              const activeTier = isUnlocked ? cat.tiers[tierIndex] : null;
              const nextTier = !isUnlocked
                ? cat.tiers[0]
                : tierIndex < cat.tiers.length - 1
                  ? cat.tiers[tierIndex + 1]
                  : null;

              return (
                <div
                  key={cat.id}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`
                    w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden
                    flex items-center justify-center
                    hover:scale-105 transition-all duration-200
                    ${!isUnlocked ? "border-4 border-[#b8a88a] bg-[#d4c9b0]" : ""}
                  `}
                  >
                    {isUnlocked ? (
                      <>
                        <img
                          src={activeTier.image}
                          alt={activeTier.nama}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="w-full h-full items-center justify-center text-4xl"
                          style={{ display: "none" }}
                        >
                          {activeTier.icon}
                        </div>
                      </>
                    ) : (
                      <GembokIcon className="w-8 h-8 md:w-12 md:h-12 opacity-70" />
                    )}
                  </div>

                  <p
                    className={`text-xs md:text-sm font-bold text-center ${isUnlocked ? "text-[#5c4033]" : "text-[#a08060]"}`}
                  >
                    {cat.nama}
                  </p>
                  <p
                    className={`text-[10px] md:text-xs text-center ${isUnlocked ? "text-[#BD9B2C]" : "text-[#b8a88a]"}`}
                  >
                    {isUnlocked
                      ? activeTier.nama
                      : (nextTier?.syarat ?? "Terkunci")}
                  </p>
                  {isUnlocked && nextTier && (
                    <p className="text-[9px] text-[#a08060] text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      Next: {nextTier.syarat}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <button
            onClick={() => setShowEdit(true)}
            className="w-full flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-[#a69076] rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-[#4E2C12] font-semibold tracking-wide"
            style={bgStyle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 24 24"
            >
              <path
                fill="#4E2C12"
                d="M18.58 2.944a2 2 0 0 0-2.828 0L14.107 4.59l5.303 5.303l1.645-1.644a2 2 0 0 0 0-2.829zm-.584 8.363l-5.303-5.303l-8.835 8.835l-1.076 6.38l6.38-1.077z"
              />
            </svg>
            Edit Profile
          </button>
          <a href={mailtoLink} target="_blank" rel="noopener noreferrer" className="w-full flex-1">
              <button
                className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-[#a69076] rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-[#4E2C12] font-semibold tracking-wide"
                style={bgStyle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="#4E2C12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.9}
                    d="M10.5 10.5h2V18m0 0H15m-2.5 0H10m1.5-11V6h1v1z"
                  />
                </svg>
                Bantuan
              </button>
            </a>
          {/* Tombol Logout versi mobile */}
          <button
            onClick={handleLogout}
            className="w-full flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-[#a69076] rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-[#8b3a3a] font-semibold tracking-wide lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#8b3a3a"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M16 17l5-5-5-5M21 12H9M13 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"
              />
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {showEdit && (
        <EditPopup
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Akun;
