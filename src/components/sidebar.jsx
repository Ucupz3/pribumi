import { NavLink, useNavigate } from "react-router-dom";
import { clearBerandaCache } from "../api/berandaApi";
import { cacheHelper } from "../api/cacheHelper";

// ===== ICONS =====
function IconBeranda() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M20 10v1c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1v-1H2v1c0 .88.39 1.67 1 2.22V21c0 .55.45 1 1 1h5v-6h6v6h5c.55 0 1-.45 1-1v-7.78c.61-.55 1-1.34 1-2.22v-1z"
      />
      <path
        fill="currentColor"
        d="M6.79 5.74L5.47 11h13.06l-1.32-5.26A3.01 3.01 0 0 0 19 3V2h-2v1c0 .55-.45 1-1 1h-1V2h-2v2h-2V2H9v2H8c-.55 0-1-.45-1-1V2H5v1c0 1.22.74 2.27 1.79 2.74"
      />
    </svg>
  );
}

function IconPeta() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 512 512"
    >
      <path
        fill="currentColor"
        d="m203.97 23l-18.032 4.844l11.656 43.468c-25.837 8.076-50.32 21.653-71.594 40.75L94.53 80.594l-13.218 13.22l31.376 31.374c-19.467 21.125-33.414 45.53-41.813 71.343l-42.313-11.343l-4.843 18.063l42.25 11.313c-6.057 27.3-6.157 55.656-.345 83L23.72 308.78l4.843 18.064l41.812-11.22a193.3 193.3 0 0 0 31.25 59.876l-29.97 52.688l-16.81 29.593l29.56-16.842l52.657-29.97a193.3 193.3 0 0 0 60.094 31.407l-11.22 41.844l18.033 4.81l11.218-41.905a195.7 195.7 0 0 0 83-.375l11.312 42.28l18.063-4.81l-11.344-42.376c25.812-8.4 50.217-22.315 71.342-41.78l31.375 31.373l13.22-13.218l-31.47-31.47a193.3 193.3 0 0 0 40.72-71.563l43.53 11.657l4.813-18.063l-43.625-11.686a195.7 195.7 0 0 0-.344-82.063l43.97-11.78l-4.813-18.063L440.908 197c-6.73-20.866-17.08-40.79-31.032-58.844l29.97-52.656l16.842-29.563l-29.593 16.844l-52.656 29.97c-17.998-13.875-37.874-24.198-58.657-30.906l11.783-44L309.5 23l-11.78 43.97c-27-5.925-55.02-6.05-82.064-.376zm201.56 85L297.25 298.313l-.75.437l-40.844-40.875l-148.72 148.72l-2.186 1.25l109.125-191.75l41.78 41.78L405.532 108zm-149.686 10.594c21.858 0 43.717 5.166 63.594 15.47l-116.625 66.342l-2.22 1.28l-1.28 2.22l-66.25 116.406c-26.942-52.04-18.616-117.603 25.03-161.25c26.99-26.988 62.38-40.468 97.75-40.468zm122.72 74.594c26.994 52.054 18.67 117.672-25.002 161.343c-43.66 43.662-109.263 52.005-161.312 25.033l116.438-66.282l2.25-1.25l1.25-2.25l66.375-116.592z"
      />
    </svg>
  );
}

function IconPeringkat() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M137.273 41c1.41 59.526 16.381 119.035 35.125 167.77c19.69 51.191 44.086 90.988 57.965 104.867l2.637 2.636V343h46v-26.727l2.637-2.636c13.879-13.88 38.275-53.676 57.965-104.867c18.744-48.735 33.715-108.244 35.125-167.77zm-50.605 68.295c-17.97 6.05-32.296 18.214-37.625 30.367c-3.015 6.875-3.48 13.44-.988 20.129c.285.766.62 1.54.996 2.318a119 119 0 0 1 8.504-4.812l6.277-3.215l4.621 5.326c5.137 5.92 9.61 12.37 13.422 19.125c2.573-3.06 5.207-7.864 7.05-14.037c4.491-15.034 4.322-36.95-2.257-55.201m338.664 0c-6.58 18.25-6.748 40.167-2.258 55.201c1.844 6.173 4.478 10.977 7.051 14.037c3.813-6.756 8.285-13.205 13.422-19.125l4.621-5.326l6.277 3.215a119 119 0 0 1 8.504 4.812c.375-.779.71-1.552.996-2.318c2.492-6.689 2.027-13.254-.988-20.129c-5.329-12.153-19.655-24.317-37.625-30.367m-365.975 67.74c-20.251 12.486-34.121 31.475-36.746 47.973c-1.447 9.1.09 17.224 5.323 24.545c1.66 2.324 3.743 4.594 6.304 6.76a116.6 116.6 0 0 1 11.44-14.977l4.72-5.24l6.217 3.33c7.91 4.236 15.262 9.424 21.94 15.252c.973-3.633 1.619-7.892 1.773-12.616c.636-19.438-6.762-45.536-20.97-65.027zm393.286 0c-14.21 19.49-21.607 45.59-20.971 65.027c.154 4.724.8 8.983 1.773 12.616c6.678-5.828 14.03-11.016 21.94-15.252l6.217-3.33l4.72 5.24a116.6 116.6 0 0 1 11.44 14.976c2.56-2.165 4.643-4.435 6.304-6.76c5.233-7.32 6.77-15.444 5.323-24.544c-2.625-16.498-16.495-35.487-36.746-47.973M54.4 259.133c-14.394 18.806-20.496 41.413-17.004 57.748c1.928 9.014 6.298 16.078 13.844 21.078c4.944 3.276 11.48 5.7 19.94 6.645a120.6 120.6 0 0 1 7.101-17.852l3.125-6.338l6.9 1.535c4.095.911 8.133 2.046 12.094 3.377c-.373-3.838-1.309-8.185-2.925-12.82c-6.416-18.396-22.749-40.184-43.075-53.373m403.2 0c-20.326 13.189-36.66 34.977-43.075 53.373c-1.616 4.635-2.552 8.982-2.925 12.82a119 119 0 0 1 12.093-3.377l6.9-1.535l3.126 6.338a120.6 120.6 0 0 1 7.101 17.852c8.46-.944 14.996-3.37 19.94-6.645c7.546-5 11.916-12.065 13.844-21.078c3.492-16.335-2.61-38.942-17.004-57.748M91.5 341.527c-9.285 23.14-9.027 47.85-.709 63.54c4.57 8.619 11.106 14.607 20.268 17.562c4.586 1.479 9.957 2.19 16.185 1.803c-2.135-11.155-2.771-22.97-1.756-34.938l.602-7.074l7.02-1.065a129 129 0 0 1 13.458-1.312c.554-.025 1.107-.04 1.66-.059c-12.419-15.776-33.883-31.43-56.728-38.457m329 0c-22.845 7.027-44.31 22.68-56.729 38.457c.554.019 1.107.034 1.66.059c4.5.206 8.995.637 13.46 1.312l7.02 1.065l.6 7.074c1.016 11.967.38 23.783-1.755 34.938c6.228.386 11.6-.324 16.185-1.803c9.162-2.955 15.699-8.943 20.268-17.563c8.318-15.69 8.576-40.4-.709-63.539M199.729 361c-1.943 7.383-6.045 14.043-11.366 19.363a47 47 0 0 1-3.484 3.125c14.804 3.295 28.659 8.692 40.404 15.46c2.384-5.36 5.376-10.345 9.408-14.534C239.96 378.942 247.51 375 256 375s16.041 3.942 21.309 9.414c4.032 4.19 7.024 9.175 9.408 14.533c11.815-6.808 25.766-12.23 40.67-15.52a48 48 0 0 1-3.739-3.413c-5.227-5.333-9.27-11.852-11.261-19.014zM256 393c-3.434 0-5.635 1.084-8.34 3.895s-5.395 7.52-7.527 13.298c-4.265 11.556-6.343 27-7.156 38.446c-1.07 15.043 3 33.368 12.285 40.06c4.733 3.412 16.743 3.412 21.476 0c9.285-6.692 13.355-25.017 12.285-40.06c-.813-11.446-2.891-26.89-7.156-38.446c-2.132-5.777-4.823-10.488-7.527-13.298c-2.705-2.81-4.906-3.895-8.34-3.895m-103.521 4.979q-2.572-.012-5.127.09c-1.405.055-2.77.281-4.164.39c-.418 27.817 9.816 53.543 24.994 66.644c8.264 7.134 17.586 10.772 28.35 10.157c5.908-.338 12.394-2.03 19.374-5.52c-1.27-7.665-1.377-15.42-.883-22.379c.632-8.89 1.852-19.962 4.479-30.877c-17.16-10.686-42.426-18.395-67.023-18.506zm207.042 0c-24.597.11-49.863 7.82-67.023 18.505c2.627 10.915 3.847 21.987 4.479 30.877c.494 6.958.387 14.714-.883 22.38c6.98 3.49 13.466 5.181 19.375 5.519c10.763.615 20.085-3.023 28.35-10.156c15.177-13.102 25.411-38.828 24.993-66.645c-1.393-.109-2.76-.335-4.164-.39a116 116 0 0 0-5.127-.09" />
    </svg>
  );
}

function IconAkun() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0M3.751 20.105a8.25 8.25 0 0 1 16.498 0a.75.75 0 0 1-.437.695A18.7 18.7 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
      />
    </svg>
  );
}

// ===== NAV ITEMS =====
const NAV_ITEMS = [
  { to: "/", label: "Beranda", icon: <IconBeranda /> },
  { to: "/peta", label: "Peta", icon: <IconPeta /> },
  { to: "/peringkat", label: "Peringkat", icon: <IconPeringkat /> },
  { to: "/akun", label: "Akun", icon: <IconAkun /> },
];

const bgSidebarStyle = {
  backgroundImage: "url('/images/sidebarbg.svg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const bgBottomStyle = {
  backgroundImage: "url('/images/bgpaper.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Sidebar() {
  const navigate = useNavigate();

const handleLogout = () => {
  cacheHelper.clearAll();
  clearBerandaCache();

  // 🔥 FIX: bersihin total
  localStorage.clear();
  sessionStorage.clear();

  navigate("/login", { replace: true });
};

  return (
    <>
      {/* ===== SIDEBAR — desktop lg ke atas ===== */}
      <div
        className="hidden lg:flex flex-col w-56 fixed min-h-screen font-lora font-medium text-sm px-6 py-8 z-20 shadow-[2px_0px_10px_#00000040]"
        style={bgSidebarStyle}
      >
        <div className="mb-12">
          <img src="/images/logokeris.png" alt="Logo" />
        </div>

        {/* Nav items */}
        <nav className="space-y-4 flex-1">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "bg-[#BD9B2C] text-white shadow-bottom"
                    : "text-[#BD9B2C] hover:bg-yellow-200/40"
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Tombol logout — selalu di bawah */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 text-[#8b3a3a] hover:bg-red-100/40 w-full mt-4"
        >
          <IconLogout />
          Keluar
        </button>
      </div>

      {/* ===== BOTTOM NAVBAR — mobile & iPad (< lg) ===== */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-20 shadow-[0px_-2px_10px_#00000030] border-t-2 border-[#c9b896]"
        style={bgBottomStyle}
      >
        <nav className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {({ isActive }) => (
                <div
                  className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                  transition-all duration-300 font-lora text-xs font-medium
                  ${isActive ? "text-[#BD9B2C]" : "text-[#a08060]"}
                `}
                >
                  <div
                    className={`
                    p-1.5 rounded-xl transition-all duration-300
                    ${isActive ? "bg-[#BD9B2C]/15" : ""}
                  `}
                  >
                    {icon}
                  </div>
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}

          {/* Tombol logout di bottom navbar */}
          <button
            onClick={handleLogout}
            className="hidden lg:flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 font-lora text-xs font-medium text-[#8b3a3a]"
          >
            <div className="p-1.5 rounded-xl">
              <IconLogout />
            </div>
            <span>Keluar</span>
          </button>
        </nav>
      </div>
    </>
  );
}
