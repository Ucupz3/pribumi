import { useState, useEffect } from "react";

async function getUserCardData() {
  await new Promise(res => setTimeout(res, 200));
  return {
    nama: "Kimi Hime",
    avatar: "/images/ppcowo.jpeg",
    xp: 15000,
    xpMax: 20000,
  };
}

export default function UserCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserCardData().then(data => setUser(data));
  }, []);

  if (!user) return null;

  const percentage = Math.min((user.xp / user.xpMax) * 100, 100);

  return (
    <div className="fixed font-lora flex items-center

    ">

      {/* Avatar */}
      <div className="absolute -left-7 sm:-left-9 lg:-left-12">
        <div className="
          rounded-full border-[3px] lg:border-[4px] border-[#BD9B2C]
          overflow-hidden bg-gray-200 shadow-lg
          w-20 h-20
          sm:w-20 sm:h-20
          2xl:w-24 2xl:h-24
        ">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#e8dcc0] flex items-center justify-center text-[#5c4033] font-black text-xl lg:text-2xl">
              {user.nama.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Card */}
      <div
        className="
          border-[3px] lg:border-[4px] border-[#BD9B2C] rounded-lg shadow-md
          bg-cover bg-center
          w-44 sm:w-48 lg:w-52 2xl:w-64
          px-4 lg:px-6
          py-1
        "
        style={{ backgroundImage: "url('/images/bgpaper.png')" }}
      >
        {/* Name */}
        <h2 className="
          font-bold text-[#7a3b1c] truncate
          text-sm sm:text-base 2xl:text-lg
          ml-10 sm:ml-8 lg:ml-3 2xl:ml-7
        ">
          {user.nama}
        </h2>

        {/* XP Section */}
        <div className="flex items-center gap-2 lg:gap-3
          ml-10 sm:ml-8 lg:ml-3 2xl:ml-7
          mt-1 lg:mt-2
          mb-1
        ">
          <span className="font-bold text-[#7a3b1c] text-sm sm:text-base 2xl:text-lg">XP</span>
          <div className="
            bg-yellow-100 border-2 border-[#BD9B2C] rounded-full overflow-hidden
            w-20 sm:w-24 lg:w-32
            h-2.5 lg:h-3
          ">
            <div
              className="h-full bg-gradient-to-r from-red-800 to-orange-500 transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}