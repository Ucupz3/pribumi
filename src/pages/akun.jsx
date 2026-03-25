import { useState, useEffect } from "react";
import { BADGE_CATEGORIES } from "../config/badgeConfig";

async function getUserProfile() {
  await new Promise(res => setTimeout(res, 300));
  return {
    nama: "Kimi Hime",
    avatar: "/images/ppcowo.jpeg",
    level: 42,
    xp: 10000,
    xpMax: 20000,
    stats: {
      totalXP: 10000,
      pulauDijelajahi: 4,
      questSelesai: 5,
      menitBermain: 90,
      pulauKomplit: 1,
    },
  };
}

const AVATAR_OPTIONS = [
  "/images/ppcowo.jpeg",
  "/images/ppcowo2.jpeg",
  "/images/ppcowo3.jpeg",
  "/images/ppcewek.jpeg",
  "/images/ppcewek2.jpeg",
  "/images/ppcewek3.jpeg",
];

const NAMA_TERPAKAI = ["Ricky", "Thomas", "Jatmiko", "Dela", "Azka"];

const bgStyle = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

// ===== GEMBOK SVG =====
function GembokIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 64 64">
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

// ===== POPUP EDIT PROFIL =====
function EditPopup({ user, onClose, onSave }) {
  const [nama, setNama] = useState(user.nama);
  const [avatar, setAvatar] = useState(user.avatar);
  const [namaError, setNamaError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNamaChange = (e) => {
    const val = e.target.value;
    setNama(val);

    if (!val.trim()) {
      setNamaError("Nama tidak boleh kosong");
    } else if (val.trim().length < 3) {
      setNamaError("Nama minimal 3 karakter");
    } else if (NAMA_TERPAKAI.includes(val.trim())) {
      setNamaError("Nama sudah dipakai orang lain");
    } else {
      setNamaError("");
    }
  };

  const handleSave = async () => {
    if (namaError || !nama.trim()) return;
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    onSave({ nama: nama.trim(), avatar });
    setLoading(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 border-[#c9b896] font-lora"
        style={bgStyle}
      >
        <div className="px-6 py-4 border-b-2 border-[#c9b896] flex items-center justify-between">
          <p className="text-[#5c4033] font-black text-lg">Edit Profil</p>
          <button onClick={onClose} className="text-[#a08060] hover:text-[#5c4033] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-[#BD9B2C] overflow-hidden shadow-lg">
              <img src={avatar} alt="preview" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <p className="text-[#5c4033] text-sm font-bold mb-3">Pilih Avatar</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`
                    w-full aspect-square rounded-full overflow-hidden border-3 transition-all duration-200
                    ${avatar === av
                      ? "border-[#BD9B2C] ring-2 ring-[#BD9B2C] ring-offset-1 scale-110"
                      : "border-[#c9b896] hover:border-[#BD9B2C] hover:scale-105 opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <img
                    src={av}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[#5c4033] text-sm font-bold mb-2">Nama</p>
            <input
              type="text"
              value={nama}
              onChange={handleNamaChange}
              maxLength={20}
              placeholder="Masukkan nama..."
              style={bgStyle}
              className={`
                w-full px-4 py-3 rounded-xl border-2 text-sm font-lora outline-none
                text-[#5c4033] placeholder-[#b8a88a] transition-all duration-200
                ${namaError
                  ? "border-[#8b3a3a]"
                  : nama !== user.nama
                    ? "border-[#4a7c59]"
                    : "border-[#c9b896] focus:border-[#BD9B2C]"
                }
              `}
            />
            <div className="flex justify-between mt-1.5">
              <p className={`text-xs ${namaError ? "text-[#8b3a3a] font-semibold" : "text-transparent"}`}>
                {namaError || "ok"}
              </p>
              <p className="text-[#a08060] text-xs">{nama.length}/20</p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              style={bgStyle}
              className="flex-1 border-2 border-[#c9b896] text-[#a08060] font-bold text-sm py-3 rounded-xl hover:border-[#a08060] transition-all duration-200"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!!namaError || !nama.trim() || loading}
              style={!namaError && nama.trim() ? bgStyle : {}}
              className={`
                flex-1 font-bold text-sm py-3 rounded-xl
                transition-all duration-200 flex items-center justify-center gap-2
                ${!namaError && nama.trim() && !loading
                  ? "border-2 border-[#BD9B2C] text-[#5c4033] hover:bg-[#BD9B2C]/10 hover:-translate-y-0.5"
                  : "bg-[#e8dcc0] text-[#a08060] cursor-not-allowed border-2 border-[#c9b896]"
                }
              `}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
              ) : "Simpan"}
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
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then(data => setUser(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={bgStyle}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#BD9B2C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#5c4033] font-semibold font-lora">Memuat Akun...</p>
        </div>
      </div>
    );
  }

  const xpPersen = Math.min((user.xp / user.xpMax) * 100, 100);

  const handleSave = (updated) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen w-full px-6 md:px-16 py-10 flex justify-center font-lora" style={bgStyle}>
      <div className="w-full">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-lg border-4 border-[#BD9B2C] overflow-hidden shadow-lg flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#e8dcc0] flex items-center justify-center text-[#5c4033] font-black text-4xl">
                {user.nama.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col gap-4 max-w-md">
              <h1 className="text-3xl md:text-3xl 2xl:text-5xl font-bold text-[#5c4033] leading-tight">
                {user.nama}
              </h1>
              <p className="text-xl font-bold text-[#5c4033]">Level {user.level}</p>
              <div className="flex flex-col gap-2">
                <p className="text-xl text-[#5c4033] font-bold">XP</p>
                <div className="w-52 md:w-full h-7 bg-[#e8dcc0] rounded-full border-2 p-1 border-[#c9b896] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#81691A] to-[#BD9B2C] rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                    style={{ width: `${xpPersen}%` }}
                  >
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {user.xp.toLocaleString("id-ID")} / {user.xpMax.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
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
              const tierIndex = cat.cek(user.stats);
              const isUnlocked = tierIndex >= 0;
              const activeTier = isUnlocked ? cat.tiers[tierIndex] : null;
              const nextTier = !isUnlocked
                ? cat.tiers[0]
                : tierIndex < cat.tiers.length - 1
                  ? cat.tiers[tierIndex + 1]
                  : null;

              return (
                <div key={cat.id} className="flex flex-col items-center gap-2 group">

                  {/* ===== BADGE CIRCLE — YANG DIUBAH ===== */}
                  <div className={`
                    w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden
                    flex items-center justify-center
                    hover:scale-105
                    transition-all duration-200
                    ${!isUnlocked ? "border-4 border-[#b8a88a] bg-[#d4c9b0]" : ""}
                  `}>
                    {isUnlocked ? (
                      <img
                        src={activeTier.image}
                        alt={activeTier.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <GembokIcon className="w-8 h-8 md:w-12 md:h-12 opacity-70" />
                    )}
                  </div>

                  <p className={`text-xs md:text-sm font-bold text-center ${isUnlocked ? "text-[#5c4033]" : "text-[#a08060]"}`}>
                    {cat.nama}
                  </p>
                  <p className={`text-[10px] md:text-xs text-center ${isUnlocked ? "text-[#BD9B2C]" : "text-[#b8a88a]"}`}>
                    {isUnlocked ? activeTier.nama : nextTier?.syarat ?? "Terkunci"}
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
            <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
              <path fill="#4E2C12" d="M18.58 2.944a2 2 0 0 0-2.828 0L14.107 4.59l5.303 5.303l1.645-1.644a2 2 0 0 0 0-2.829zm-.584 8.363l-5.303-5.303l-8.835 8.835l-1.076 6.38l6.38-1.077z"/>
            </svg>
            Edit Profile
          </button>
          <button
            className="w-full flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-[#a69076] rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-[#4E2C12] font-semibold tracking-wide"
            style={bgStyle}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path fill="none" stroke="#4E2C12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.9} d="M10.5 10.5h2V18m0 0H15m-2.5 0H10m1.5-11V6h1v1z"/>
            </svg>
            Bantuan
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