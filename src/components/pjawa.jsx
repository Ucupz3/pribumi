const markers = [
  {
    id: 1,
    top: "38%",
    left: "10%",
    nama: "Jakarta",
    xpRequired: 0,
    slug: "jakarta",
    wilayah: "Jawa",
    estimasiMenit: 8,
    deskripsi:
      "Jelajahi ibu kota Indonesia, pusat pemerintahan dan kebudayaan Betawi yang kaya sejarah.",
    thumbnail: "/images/Quest/jakarta.jpg",
    xpReward: 100,
    totalSoal: 8,
  },
  {
    id: 2,
    top: "45%",
    left: "15%",
    nama: "Bandung",
    xpRequired: 100,
    slug: "bandung",
    wilayah: "Jawa",
    estimasiMenit: 10,
    deskripsi:
      "Kenali budaya Sunda dan keindahan Kota Kembang yang terkenal dengan seni dan kulinernya.",
    thumbnail: "/images/Quest/bandung.jpg",
    xpReward: 150,
    totalSoal: 10,
  },
  {
    id: 3,
    top: "52%",
    left: "30%",
    nama: "Yogyakarta",
    xpRequired: 250,
    slug: "yogyakarta",
    wilayah: "Jawa",
    estimasiMenit: 10,
    deskripsi:
      "Temukan warisan budaya Jawa di kota pelajar, tanah kelahiran Keraton dan Candi Borobudur.",
    thumbnail: "/images/Quest/yogyakarta.jpg",
    xpReward: 200,
    totalSoal: 10,
  },
  {
    id: 4,
    top: "49%",
    left: "38%",
    nama: "Surabaya",
    xpRequired: 450,
    slug: "surabaya",
    wilayah: "Jawa",
    estimasiMenit: 10,
    deskripsi:
      "Eksplorasi kota pahlawan, pusat perdagangan dan budaya Jawa Timur yang penuh semangat.",
    thumbnail: "/images/Quest/surabaya.jpg",
    xpReward: 250,
    totalSoal: 10,
  },
  {
    id: 5,
    top: "43%",
    left: "29%",
    nama: "Semarang",
    xpRequired: 700,
    slug: "semarang",
    wilayah: "Jawa",
    estimasiMenit: 8,
    deskripsi:
      "Jelajahi kota tua Semarang dengan perpaduan budaya Jawa, Tionghoa, dan kolonial Belanda.",
    thumbnail: "/images/Quest/semarang.jpg",
    xpReward: 200,
    totalSoal: 8,
  },
];

function LockIcon({ size = 28 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
    >
      <path
        fill="#ffce31"
        d="M2 28.3v31.4C2 62.1 3.9 64 6.3 64h51.4c2.4 0 4.3-1.9 4.3-4.3V28.3z"
        strokeWidth={0.1}
        stroke="#ffce31"
      />
      <path
        fill="#ff8736"
        d="M62 24c0-2.4-1.9-4.3-4.3-4.3H6.3C3.9 19.6 2 21.6 2 24v4.3h60z"
        strokeWidth={0.1}
        stroke="#ff8736"
      />
      <g fill="#3e4347" strokeWidth={0.1} stroke="#3e4347">
        <ellipse cx={12.4} cy={23.5} rx={5.9} ry={2.5} />
        <ellipse cx={51.6} cy={23.5} rx={5.9} ry={2.5} />
      </g>
      <path
        fill="#dfe9ef"
        d="M32 0C19.1 0 8.6 10.6 8.6 23.5c0 .8 1.6 1.4 3.8 1.4v-1.4c.8-11 9.3-19.7 19.6-19.7c10.4 0 18.9 8.7 19.6 19.7v1.4c2.2 0 3.8-.6 3.8-1.4C55.4 10.6 44.9 0 32 0"
        strokeWidth={0.1}
        stroke="#dfe9ef"
      />
      <path
        fill="#b0bdc6"
        d="M51.6 23.5C50.9 12.6 42.4 3.9 32 3.9s-18.9 8.7-19.6 19.7V25c2.2 0 4.2-.6 4.2-1.4C16.5 16.4 22.5 8 32 8s15.5 8.4 15.5 15.5c0 .8 2 1.4 4.2 1.4z"
        strokeWidth={0.1}
        stroke="#b0bdc6"
      />
      <path
        fill="#3e4347"
        d="m36.6 56.4l-1.9-12.3c1.1-.8 1.9-2.2 1.9-3.7c0-2.5-2-4.6-4.6-4.6s-4.6 2.1-4.6 4.6c0 1.5.7 2.9 1.9 3.7l-1.9 12.3z"
        strokeWidth={0.1}
        stroke="#3e4347"
      />
    </svg>
  );
}

export default function Jawa({ onMarkerClick, userXP = 0 }) {
  const handleClick = (e, marker, isUnlocked) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onMarkerClick(
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      marker,
      isUnlocked,
    );
  };

  return (
    <div className="absolute top-[83%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="relative">
        <img
          src="/images/Pulau/Jawa.png"
          alt="Pulau Jawa"
          className="w-[50%] min-w-[150px] h-auto"
        />

        {markers.map((m) => {
          const isUnlocked = userXP >= m.xpRequired;
          return (
            <div
              key={m.id}
              className="absolute group"
              style={{ top: m.top, left: m.left }}
            >
              {isUnlocked ? (
                <div
                  onClick={(e) => handleClick(e, m, true)}
                  className="relative cursor-pointer z-50"
                >
                  <div className="relative w-4 h-4">
                    <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping" />
                    <div className="relative w-4 h-4 bg-yellow-500 rounded-full border-2 border-white" />
                  </div>
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.nama}
                  </span>
                </div>
              ) : (
                <div
                  onClick={(e) => handleClick(e, m, false)}
                  className="relative cursor-pointer z-50"
                >
                  <LockIcon size={28} />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    🔒 {m.xpRequired} XP
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
