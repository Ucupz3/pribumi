export const BADGE_CATEGORIES = [
  {
    id: "xp",
    nama: "XP Hunter",
    icon: "⚡",
    tiers: [
      { nama: "Bronze", syarat: "500 XP",    minXP: 500,  icon: "🥉", image: "/images/badges/xphunter_1.png" },
      { nama: "Silver", syarat: "1.000 XP",  minXP: 1000, icon: "🥈", image: "/images/badges/xphunter_2.png" },
      { nama: "Emas",   syarat: "2.000 XP",  minXP: 2000, icon: "🥇", image: "/images/badges/xphunter_3.png" },
    ],
    cek: (stats) => {
      if (stats.totalXP >= 2000) return 2;
      if (stats.totalXP >= 1000) return 1;
      if (stats.totalXP >= 500)  return 0;
      return -1;
    },
  },

  {
    id: "penjelajah",
    nama: "Penjelajah",
    icon: "🗺️",
    tiers: [
      { nama: "Pemula",    syarat: "Jelajahi 1 pulau",    icon: "🗺️", image: "/images/badges/penjelajah_1.png" },
      { nama: "Nusantara", syarat: "Jelajahi 3 pulau",    icon: "🧭", image: "/images/badges/penjelajah_2.png" },
      { nama: "Sejati",    syarat: "Jelajahi semua pulau", icon: "🌏", image: "/images/badges/penjelajah_3.png" },
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
      { nama: "Murid",    syarat: "3 quest",     icon: "📖", image: "/images/badges/cendikiawan_1.png" },
      { nama: "Sarjana",  syarat: "10 quest",    icon: "📚", image: "/images/badges/cendikiawan_2.png" },
      { nama: "Mahaguru", syarat: "Semua quest", icon: "🎓", image: "/images/badges/cendikiawan_3.png" },
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
      { nama: "Baru",    syarat: "1 jam",  icon: "⏱️", image: "/images/badges/veteran_1.png" },
      { nama: "Tangguh", syarat: "5 jam",  icon: "🎖️", image: "/images/badges/veteran_2.png" },
      { nama: "Sejati",  syarat: "10 jam", icon: "🏆", image: "/images/badges/veteran_3.png" },
    ],
    cek: (stats) => {
      if (stats.menitBermain >= 600) return 2;
      if (stats.menitBermain >= 300) return 1;
      if (stats.menitBermain >= 60)  return 0;
      return -1;
    },
  },

  {
    id: "problem_solver",
    nama: "Problem Solver",
    icon: "🧠",
    tiers: [
      { nama: "Bronze", syarat: "5 tanpa salah",  icon: "🥉", image: "/images/badges/problemsolver_1.png" },
      { nama: "Silver", syarat: "10 tanpa salah", icon: "🥈", image: "/images/badges/problemsolver_2.png" },
      { nama: "Emas",   syarat: "15 tanpa salah", icon: "🥇", image: "/images/badges/problemsolver_3.png" },
    ],
    cek: (stats) => {
      if (stats.questPerfect >= 15) return 2;
      if (stats.questPerfect >= 10) return 1;
      if (stats.questPerfect >= 5)  return 0;
      return -1;
    },
  },
];