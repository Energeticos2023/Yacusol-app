// Service worker de YACUSOL Control 360 (alcance: /control360/).
// Reglas:
// - Solo guarda archivos propios del panel (mismo origen y dentro del alcance).
// - Nunca intercepta Supabase ni otros dominios: los datos privados no se guardan en caché.
// - Red primero: con conexión siempre se usa la versión publicada; la copia local es solo respaldo sin conexión.
// - Al actualizar solo borra sus propias cachés (prefijo y360-control360-), nunca las de otras apps del mismo dominio.
const PREFIX = "y360-control360-";
const CACHE = PREFIX + "shell-v1";
const SCOPE = new URL("./", self.location).href;
const SHELL = ["./", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;
  if (url.pathname.endsWith("/sw.js")) return;
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;
        if (req.mode === "navigate") {
          const shell = await cache.match("./", { ignoreSearch: true });
          if (shell) return shell;
        }
        return new Response("Sin conexión. Vuelve a intentarlo cuando tengas internet.", {
          status: 503, headers: { "content-type": "text/plain; charset=utf-8" }
        });
      })
  );
});
