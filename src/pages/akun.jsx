import { useState, useEffect } from "react";
import { BADGE_CATEGORIES } from "../config/badgeConfig";
import { getUserProfile, updateUserProfile } from "../api/userApi";

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
      <path fill="#3e4347" d="M36.6 56.4l-1.9-12.3c1.1-.8 1.9-2.2 1.9-3.7c0-2.5-2-4.6-4.6-4.6s-4.6 2.1-4.6 4.6c0 1.5.7 2.9 1.9 3.7l-1.9 12.3z"/>
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

    try {
      setLoading(true);
      await onSave({ nama: nama.trim(), avatar });
      onClose();
    } catch (err) {
      console.error("Update gagal:", err);
    } finally {
      setLoading(false);
    }
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
          <button onClick={onClose} className="text-[#a08060] hover:text-[#5c4033]">
            ✕
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
                  className={`w-full aspect-square rounded-full overflow-hidden border-2
                  ${avatar === av ? "border-[#BD9B2C]" : "border-[#c9b896]"}`}
                >
                  <img src={av} alt="avatar" className="w-full h-full object-cover" />
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
              className="w-full px-4 py-3 rounded-xl border-2 border-[#c9b896] text-sm"
            />
            {namaError && (
              <p className="text-xs text-red-500 mt-1">{namaError}</p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-[#c9b896] text-[#a08060] font-bold text-sm py-3 rounded-xl"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!!namaError || !nama.trim() || loading}
              className="flex-1 border-2 border-[#BD9B2C] text-[#5c4033] font-bold text-sm py-3 rounded-xl"
            >
              {loading ? "Menyimpan..." : "Simpan"}
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
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error("User error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={bgStyle}>
        Memuat Akun...
      </div>
    );
  }

  const xpPersen = Math.min((user.xp / user.xpMax) * 100, 100);

  const handleSave = async (updated) => {
    const data = await updateUserProfile(updated);
    setUser(data);
  };

  return (
    <div className="min-h-screen w-full px-6 py-10 font-lora" style={bgStyle}>
      <div className="flex gap-10 items-center mb-12">

        <div className="w-32 h-32 rounded-lg border-4 border-[#BD9B2C] overflow-hidden">
          <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[#5c4033]">
            {user.nama}
          </h1>
          <p className="text-xl font-bold text-[#5c4033]">
            Level {user.level}
          </p>

          <div className="w-64 h-6 bg-[#e8dcc0] rounded-full border-2 border-[#c9b896] mt-3">
            <div
              className="h-full bg-gradient-to-r from-[#81691A] to-[#BD9B2C] rounded-full"
              style={{ width: `${xpPersen}%` }}
            />
          </div>
        </div>

      </div>

      <button
        onClick={() => setShowEdit(true)}
        className="px-6 py-3 border-2 border-[#BD9B2C] rounded-lg"
      >
        Edit Profile
      </button>

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