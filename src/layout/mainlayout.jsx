// mainlayout.jsx
import { useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import UserCard from "../components/usercard";

export default function MainLayout({ children }) {
  const location = useLocation();
  const showUserCard = ["/", "/peta", "/peringkat"].includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-56 bg-gray-100 min-h-screen font-lora relative pb-20 lg:pb-0">

        {showUserCard && (
          <div className="absolute 
          top-6
          lg:left-24 md:left-20 sm:left-16 left-12
          z-40">
            <UserCard />
          </div>
        )}

        {children}

      </main>
    </div>
  );
}