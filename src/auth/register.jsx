import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agreeTerms) {
      setErrorMsg("Anda harus menyetujui syarat dan ketentuan!");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password minimal 8 karakter!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://nusa-api.vercel.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Registrasi gagal. Silakan coba lagi.");
        return;
      }

      navigate("/login");
    } catch (err) {
      setErrorMsg(
        "Terjadi kesalahan jaringan. Periksa koneksi Anda dan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-lora">
      {/* ===== KIRI — Borobudur ===== */}
      <div className="relative w-full lg:w-[65%] xl:w-[70%] hidden lg:flex items-center justify-center overflow-hidden">
        {/* Background Borobudur */}
        <img
          src="/images/bgborobudur.png"
          alt="Borobudur"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay gelap tipis */}
        <div className="absolute inset-0 bg-black/3" />

        {/* Konten tengah */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Oval putih tipis di belakang */}
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 bg-white/15 backdrop-blur-[2px] rounded-[60%]" />

            {/* Logo Nusa Quest */}
            <div className="relative z-10 flex flex-col items-center px-16 py-8">
              <img
                src="/images/logofx.png"
                alt="Nusa Quest"
                className="w-72 lg:w-[460px] xl:w-[700px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const nextSibling = e.currentTarget.nextSibling;
                  if (nextSibling) nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback kalau gambar ga ada */}
              <div className="hidden items-center justify-center">
                <h1
                  className="text-5xl lg:text-7xl font-black text-[#BD9B2C] drop-shadow-2xl"
                  style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}
                >
                  Nusa Quest
                </h1>
              </div>

              {/* Tulisan bawah dalam div dengan efek oval */}
              <div className="mt-3 px-4 xl:px-8 py-1 xl:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <p
                  className="text-white font-bold text-lg xl:text-xl text-center drop-shadow-md tracking-wide"
                  style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.6)" }}
                >
                  Jelajahi Sejarah dan Budaya Nusantara
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== KANAN — Form Register ===== */}
      <div
        className="w-full lg:w-[35%] xl:w-[30%] flex flex-col items-center justify-center px-8 py-10 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/bgpaper.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "-8px 0px 24px rgba(0,0,0,0.60)",
        }}
      >
        {/* Corak batik pojok */}
        <img
          src="/images/bgbatik1.svg"
          alt=""
          className="absolute top-0 left-0 w-[55%] lg:w-[59%] xl:w-[60%] z-90 pointer-events-none select-none"
        />

        {/* Batik pojok kiri bawah */}
        <img
          src="/images/bgbatikbw.png"
          alt=""
          className="absolute bottom-0 right-0 w-[10%] lg:w-[10%] xl:w-[12%] pointer-events-none select-none rotate-180"
        />

        <div className="w-full max-w-sm relative z-10">
          {/* Icon user */}
          <div className="flex justify-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-20 h-20 sm:w-24 sm:h-24 xl:w-24 xl:h-24"
              style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" }}
            >
              <path
                fill="#BD9B2C"
                d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4"
              />
            </svg>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-lora font-semibold text-[#BD9B2C] text-center mb-8">
            DAFTAR
          </h1>

          {/* FIX 3: Tampilkan pesan error secara inline (lebih baik dari alert) */}
          {errorMsg && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-3">
            {/* Nama Lengkap */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nama Lengkap"
              required
              minLength={3}
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#c9b896] bg-white/80 text-[#5c4033] placeholder-[#b8a88a] text-sm outline-none focus:border-[#BD9B2C] transition-all duration-200"
            />

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-[#c9b896] bg-white/80 text-[#5c4033] placeholder-[#b8a88a] text-sm outline-none focus:border-[#BD9B2C] transition-all duration-200"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={8} // FIX 1: Disamakan dengan backend (minLength: 8)
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#c9b896] bg-white/80 text-[#5c4033] placeholder-[#b8a88a] text-sm outline-none focus:border-[#BD9B2C] transition-all duration-200 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08060] hover:text-[#5c4033] transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Hint password */}
            <p className="text-xs text-[#b8a88a] -mt-1 pl-1">
              Minimal 8 karakter
            </p>

            {/* Checkbox Syarat & Ketentuan */}
            <div className="flex items-start gap-2 py-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-[#c9b896] text-[#BD9B2C] focus:ring-[#BD9B2C] cursor-pointer"
              />
              <label
                htmlFor="agreeTerms"
                className="text-[#5c4033] text-xs font-semibold cursor-pointer"
              >
                Saya menyetujui{" "}
                <button
                  type="button"
                  className="text-[#BD9B2C] hover:underline"
                >
                  Syarat & Ketentuan
                </button>{" "}
                dan{" "}
                <button
                  type="button"
                  className="text-[#BD9B2C] hover:underline"
                >
                  Kebijakan Privasi
                </button>
              </label>
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BD9B2C] hover:bg-[#a08020] text-white font-bold text-base py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Daftar"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#c9b896]" />
            <span className="text-[#5c4033] text-sm font-bold">
              Atau Daftar Dengan
            </span>
            <div className="flex-1 h-px bg-[#c9b896]" />
          </div>

          {/* Social login */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#c9b896] rounded-xl hover:border-[#BD9B2C] hover:shadow-md transition-all duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[#5c4033] font-bold text-sm">Google</span>
            </button>
          </div>

          {/* Login */}
          <p className="text-center text-[#5c4033] text-sm mt-5 font-semibold">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#BD9B2C] font-bold hover:underline"
            >
              Login Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
