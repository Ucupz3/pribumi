const getUserId = () => localStorage.getItem("user_id") ?? "guest";

export const cacheHelper = {
  _key(key) {
    return `${getUserId()}_${key}`;
  },

  set(key, data) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify({ data, ts: Date.now() }));
    } catch { // silent fail — localStorage mungkin penuh atau disabled di browser
      console.warn("Gagal menyimpan cache", key);
    }
  },

  get(key, ttlMinutes = 5) {
    try {
      const raw = localStorage.getItem(this._key(key));
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      const isExpired = Date.now() - ts > ttlMinutes * 60_000;
      return { data, isExpired };
    } catch {
      return null;
    }
  },

  getFallback(key) {
    try {
      const raw = localStorage.getItem(this._key(key));
      if (!raw) return null;
      return JSON.parse(raw).data ?? null;
    } catch {
      return null;
    }
  },

  clearAll() {
    const prefix = `${getUserId()}_`;
    Object.keys(localStorage)
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => localStorage.removeItem(k));
  },
};