import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/mainlayout";
import Beranda from "./pages/beranda";
import Akun from "./pages/akun";
import Peringkat from "./pages/peringkat";
import Peta from "./pages/peta";
import Quest from "./pages/quest";
import Login from "./auth/login";
import Register from "./auth/register";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <MainLayout>
              <Beranda />
            </MainLayout>
          }
        />

        <Route
          path="/peta"
          element={
            <MainLayout>
              <Peta />
            </MainLayout>
          }
        />

        <Route
          path="/peringkat"
          element={
            <MainLayout>
              <Peringkat />
            </MainLayout>
          }
        />

        <Route
          path="/akun"
          element={
            <MainLayout>
              <Akun />
            </MainLayout>
          }
        />
        <Route path="/quest/:slug" element={<Quest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;