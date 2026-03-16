export const BADGE_CATEGORIES = [
  {
    id: "xp",
    nama: "Petualang XP",
    icon: "⚡",
    tiers: [
      { nama: "Bronze",   syarat: "500 XP",        minXP: 500,  icon: "🥉" },
      { nama: "Silver",   syarat: "1.000 XP",       minXP: 1000, icon: "🥈" },
      { nama: "Emas",     syarat: "2.000 XP",       minXP: 2000, icon: "🥇" },
    ],
    cek: (stats) => {
      if (stats.totalXP >= 2000) return 2;
      if (stats.totalXP >= 1000) return 1;
      if (stats.totalXP >= 500)  return 0;
      return -1; // belum dapat
    },
  },
  {
    id: "penjelajah",
    nama: "Penjelajah",
    icon: "🗺️",
    tiers: [
      { nama: "Pemula",    syarat: "Jelajahi 1 pulau",   icon: "🗺️" },
      { nama: "Nusantara", syarat: "Jelajahi 3 pulau",   icon: "🧭" },
      { nama: "Sejati",    syarat: "Jelajahi semua pulau", icon: "🌏" },
    ],
    cek: (stats) => {
      if (stats.pulauDijelajahi >= 6) return 2;
      if (stats.pulauDijelajahi >= 3) return 1;
      if (stats.pulauDijelajahi >= 1) return 0;
      return -1;
    },
  },
  {
    id: "cendekiawan",
    nama: "Cendekiawan",
    icon: "📚",
    tiers: [
      { nama: "Murid",    syarat: "Selesaikan 3 quest",    icon: "📖" },
      { nama: "Sarjana",  syarat: "Selesaikan 10 quest",   icon: "📚" },
      { nama: "Mahaguru", syarat: "Selesaikan semua quest", icon: "🎓" },
    ],
    cek: (stats) => {
      if (stats.questSelesai >= 20) return 2;
      if (stats.questSelesai >= 10) return 1;
      if (stats.questSelesai >= 3)  return 0;
      return -1;
    },
  },
  {
    id: "veteran",
    nama: "Veteran",
    icon: "🎖️",
    tiers: [
      { nama: "Baru",    syarat: "Bermain 1 jam",   icon: "⏱️" },
      { nama: "Tangguh", syarat: "Bermain 5 jam",   icon: "🎖️" },
      { nama: "Sejati",  syarat: "Bermain 10 jam",  icon: "🏆" },
    ],
    cek: (stats) => {
      if (stats.menitBermain >= 600) return 2;
      if (stats.menitBermain >= 300) return 1;
      if (stats.menitBermain >= 60)  return 0;
      return -1;
    },
  },
  {
    id: "geografer",
    nama: "Geografer",
    icon: "🌏",
    tiers: [
      { nama: "Pemula",  syarat: "Buka semua marker 1 pulau",    icon: "📍" },
      { nama: "Handal",  syarat: "Buka semua marker 3 pulau",    icon: "🗾" },
      { nama: "Sejati",  syarat: "Buka semua marker semua pulau", icon: "🌏" },
    ],
    cek: (stats) => {
      if (stats.pulauKomplit >= 6) return 2;
      if (stats.pulauKomplit >= 3) return 1;
      if (stats.pulauKomplit >= 1) return 0;
      return -1;
    },
  },
];