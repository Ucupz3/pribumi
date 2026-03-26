import { supabase } from "../lib/supabase";

// ambil semua marker berdasarkan pulau
export async function getMarkersByIsland(island) {
  const { data, error } = await supabase
    .from("markers")
    .select("*")
    .eq("island", island);

  if (error) {
    console.error("Error getMarkers:", error);
    return [];
  }

  return data;
}

// ambil XP user (sementara dummy / nanti sambung auth)
export async function getUserXP() {
  // sementara hardcode dulu biar jalan
  return { xp: 120 };

  // nanti kalau udah ada auth:
  /*
  const { data } = await supabase
    .from("users")
    .select("xp")
    .single();

  return { xp: data.xp };
  */
}