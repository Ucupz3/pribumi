import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/mainlayout";
import Beranda from "./pages/beranda";
import Akun from "./pages/akun";
import Peringkat from "./pages/peringkat";
import Peta from "./pages/peta";
import Quest from "./pages/quest";
import Login from "./auth/login";
import Register from "./auth/register";
import CharacterSelect from "./pages/characterselect";

// ── Protected Route ───────────────────────────────────────────
// Redirect ke /login jika tidak ada access_token di localStorage
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  
  // Kalau benar-benar kosong (user belum pernah login / sudah logout), baru ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Protected routes ── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Beranda />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/peta"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Peta />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/peringkat"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Peringkat />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/akun"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Akun />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quest/:slug"
          element={
            <ProtectedRoute>
              <Quest />
            </ProtectedRoute>
          }
        />

        {/* ── Public routes ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/character-select" element={<CharacterSelect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
