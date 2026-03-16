// =============================================
// MOCK API — Ganti dengan URL Elysia.js nanti
// =============================================

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const mockQuestData = {
  "banda-aceh": {
    nama: "Banda Aceh",
    wilayah: "Sumatera",
    xpReward: 100,
    soal: [
      { id: 1, pertanyaan: "Masjid Raya Baiturrahman terletak di kota mana?", pilihan: ["Medan", "Banda Aceh", "Padang", "Palembang"], jawaban: "Banda Aceh" },
      { id: 2, pertanyaan: "Tari tradisional khas Aceh yang terkenal adalah?", pilihan: ["Saman", "Pendet", "Jaipong", "Reog"], jawaban: "Saman" },
      { id: 3, pertanyaan: "Banda Aceh adalah ibu kota provinsi mana?", pilihan: ["Sumatera Utara", "Aceh", "Sumatera Barat", "Riau"], jawaban: "Aceh" },
      { id: 4, pertanyaan: "Sebutan lain Aceh adalah Serambi?", pilihan: ["Madinah", "Mekah", "Yerusalem", "Baghdad"], jawaban: "Mekah" },
      { id: 5, pertanyaan: "Tsunami besar melanda Banda Aceh pada tahun?", pilihan: ["2002", "2003", "2004", "2005"], jawaban: "2004" },
    ],
  },
  "medan": {
    nama: "Medan",
    wilayah: "Sumatera",
    xpReward: 150,
    soal: [
      { id: 1, pertanyaan: "Danau terbesar di Sumatera Utara adalah?", pilihan: ["Danau Kerinci", "Danau Toba", "Danau Maninjau", "Danau Singkarak"], jawaban: "Danau Toba" },
      { id: 2, pertanyaan: "Medan adalah kota terbesar ke berapa di Indonesia?", pilihan: ["Pertama", "Kedua", "Ketiga", "Keempat"], jawaban: "Ketiga" },
      { id: 3, pertanyaan: "Suku asli mayoritas di Medan adalah?", pilihan: ["Jawa", "Batak", "Minang", "Melayu"], jawaban: "Batak" },
    ],
  },
  "padang": {
    nama: "Padang",
    wilayah: "Sumatera",
    xpReward: 200,
    soal: [
      { id: 1, pertanyaan: "Rumah adat Minangkabau disebut?", pilihan: ["Joglo", "Rumah Gadang", "Honai", "Lamin"], jawaban: "Rumah Gadang" },
      { id: 2, pertanyaan: "Makanan khas Padang yang terkenal di dunia adalah?", pilihan: ["Soto", "Rendang", "Gado-gado", "Pempek"], jawaban: "Rendang" },
      { id: 3, pertanyaan: "Sistem kekerabatan Minangkabau mengikuti garis?", pilihan: ["Ayah", "Ibu", "Kakek", "Nenek"], jawaban: "Ibu" },
    ],
  },
};

/**
 * Ambil data quest berdasarkan slug
 *
 * ENDPOINT yang harus dibuat backend:
 * GET /quest/:slug
 *
 * RESPONSE:
 * {
 *   nama     : string
 *   wilayah  : string
 *   xpReward : number
 *   soal     : [{ id, pertanyaan, pilihan, jawaban }]
 * }
 */
export async function getQuestBySlug(slug) {
  await delay(400);
  return mockQuestData[slug] ?? null;
}

/**
 * Submit hasil quest
 *
 * ENDPOINT yang harus dibuat backend:
 * POST /quest/submit
 *
 * REQUEST BODY:
 * { slug, skorBenar, totalSoal }
 *
 * RESPONSE:
 * { xpDidapat, totalXPBaru, badge }
 */
export async function submitQuest({ slug, skorBenar, totalSoal }) {
  await delay(600);
  const quest = mockQuestData[slug];
  const xpDidapat = Math.round((skorBenar / totalSoal) * quest.xpReward);
  const totalXPBaru = 80 + xpDidapat;

  const getBadge = (xp) => {
    if (xp >= 2000) return { nama: "Emas",  emoji: "🥇", min: 2000 };
    if (xp >= 1000) return { nama: "Silver", emoji: "🥈", min: 1000 };
    if (xp >= 500)  return { nama: "Bronze", emoji: "🥉", min: 500  };
    return null;
  };

  return {
    xpDidapat,
    totalXPBaru,
    badge: getBadge(totalXPBaru),
  };
}