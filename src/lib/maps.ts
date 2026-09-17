export function parseGoogleMapsLink(url: string): { lat?: number; lng?: number; maps_url: string } {
  const raw = url.trim();
  if (!raw) return { maps_url: "" };
  // normalize
  let maps_url = raw;
  // ensure https
  if (!/^https?:\/\//i.test(maps_url)) maps_url = "https://" + maps_url;

  // try extract lat,lng
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/, // /@-7.123,112.123
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/, // ?q=-7,112
    /[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/, // ?query=
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, // !3d lat !4d lng (place link)
    /(-?\d+\.\d+),(-?\d+\.\d+)/, // fallback any two floats
  ];
  for (const re of patterns) {
    const m = raw.match(re);
    if (m) {
      let a = parseFloat(m[1]);
      let b = parseFloat(m[2]);
      // for !3d/!4d pattern, lat is 3d, lng is 4d
      // for @ pattern, first is lat
      // validate Surabaya-ish range approx lat -6 to -8, lng 110-115, but allow global
      if (!isNaN(a) && !isNaN(b) && Math.abs(a) <= 90 && Math.abs(b) <= 180) {
        // heuristic: if pattern is fallback and numbers look like lat/lng, keep
        return { lat: a, lng: b, maps_url };
      }
    }
  }
  // no coords found, return only url
  return { maps_url };
}

export function mapsUrlForWorkshop(w: { lat?: number; lng?: number; maps_url?: string }): string {
  if (w.maps_url) return w.maps_url;
  if (w.lat != null && w.lng != null) return `https://maps.google.com/?q=${w.lat},${w.lng}`;
  return "#";
}
