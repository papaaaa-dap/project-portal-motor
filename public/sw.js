/* Motorkita service worker — cache darurat offline (tanpa dependensi build).
 * Strategi: navigasi = network-first + fallback cache/offline;
 * aset same-origin = cache-first. Jangan cache /admin dan API auth. */
const CACHE = "motorkita-v1";
const CORE = [
  "/offline",
  "/panduan-darurat",
  "/cek-masalah",
  "/motor1.jpeg",
  "/motor2.jpeg",
  "/motor3.jpeg",
  "/motor4.jpeg",
  "/logo-motorkita.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function skip(url) {
  return (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/api/")
  );
}

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || skip(url)) return;

  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => (await caches.match(request)) || caches.match("/offline"))
    );
    return;
  }

  e.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(request, copy));
            }
            return res;
          })
          .catch(() => caches.match(request))
    )
  );
});
