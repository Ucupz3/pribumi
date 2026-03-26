import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://nusa-api.vercel.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Fix 1: header wajib ada
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json(); // ✅ Fix 2: parse response

      if (!res.ok || !data.success) {
        // ✅ Fix 3: tangkap error dari backend (401, dll)
        setError(data.message ?? "Email atau password salah");
        return;
      }

      // ✅ Fix 4: simpan token dari struktur { success, message, data: { user, access_token, refresh_token } }
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);

      navigate("/");
    } catch (err) {
      // ✅ Fix 5: tangkap error jaringan (server mati, timeout, dll)
      setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
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
                  e.currentTarget.nextSibling.style.display = "flex";
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

      {/* ===== KANAN — Form Login ===== */}
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
          <div className="hidden justify-center mb-8">
            <img src="/images/logofx.png" alt="Nusa Quest" />
          </div>

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
                d="M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1m3.663-5.113Q8.5 10.976 8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13t-2.488-1.012M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
              />
            </svg>
          </div>

          {/* Judul */}
          <h1 className="text-4xl font-lora font-semibold text-[#BD9B2C] text-center mb-8">
            LOGIN
          </h1>

          {/* ✅ Fix 6: Tampilkan pesan error ke user */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-xl text-red-600 text-sm text-center font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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

            {/* Lupa kata sandi */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[#BD9B2C] text-xs font-bold hover:underline"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#BD9B2C] hover:bg-[#a08020] text-white font-bold text-base py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#c9b896]" />
            <span className="text-[#5c4033] text-sm font-bold">
              Atau Masuk Dengan
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

            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] border-2 border-[#1877F2] rounded-xl hover:bg-[#1666d6] hover:shadow-md transition-all duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-white font-bold text-sm">Facebook</span>
            </button>
          </div>

          {/* Daftar */}
          <p className="text-center text-[#5c4033] text-sm mt-6 font-semibold">
            Belum punya akun?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#BD9B2C] font-bold hover:underline"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
