export function getOpenStatus(jam: string): { isOpen: boolean; label: string; is24h: boolean } {
  const raw = (jam || "").trim().toLowerCase();
  if (!raw) return { isOpen: false, label: "Jam tidak tersedia", is24h: false };
  if (raw.includes("24 jam") || raw === "24 jam" || raw === "24h") {
    return { isOpen: true, label: "Buka 24 jam", is24h: true };
  }
  // format 08:00-17:00 atau 08:00 - 17:00, juga 07:00-21:00
  const m = raw.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  if (!m) return { isOpen: false, label: jam, is24h: false };
  const openMin = parseInt(m[1]) * 60 + parseInt(m[2]);
  const closeMin = parseInt(m[3]) * 60 + parseInt(m[4]);
  // waktu Jakarta
  const now = new Date();
  // convert to Asia/Jakarta: UTC+7, no DST
  const jakarta = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const curMin = jakarta.getHours() * 60 + jakarta.getMinutes();
  // handle overnight e.g. 22:00-02:00
  let isOpen = false;
  if (openMin <= closeMin) {
    isOpen = curMin >= openMin && curMin < closeMin;
  } else {
    isOpen = curMin >= openMin || curMin < closeMin;
  }
  const fmt = (h: number, mm: number) => `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  const label = isOpen
    ? `Buka • Tutup ${fmt(parseInt(m[3]), parseInt(m[4]))}`
    : `Tutup • Buka ${fmt(parseInt(m[1]), parseInt(m[2]))}`;
  return { isOpen, label, is24h: false };
}
