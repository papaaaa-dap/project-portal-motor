export function waLink(kontak: string, workshopName?: string): string {
  const raw = (kontak || "").replace(/[^0-9]/g, "");
  // mobile Indonesia: 08xx → 628xx
  if (raw.startsWith("08")) {
    const wa = "62" + raw.slice(1);
    const text = workshopName ? `Halo ${workshopName}, saya lihat di Motoku. Mau tanya servis...` : "Halo, saya lihat di Motoku.";
    return `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  }
  // landline 031... → fallback tel
  if (raw.startsWith("031") || raw.startsWith("0")) {
    return `tel:${kontak}`;
  }
  return `tel:${kontak}`;
}
export function isWa(kontak: string): boolean {
  return kontak.replace(/[^0-9]/g, "").startsWith("08");
}
