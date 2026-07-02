const CACHE_NAME = 'yacusol-pwa-v3-sus316-root';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './logo-energeticos.jpg',
  './icon-192.png',
  './icon-512.png',
  './terma-hero.jpg',
  './poster-precios.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isAppShell = ASSETS.some(a => url.pathname.endsWith(a.replace('./','/')) || url.pathname === '/' || url.pathname.endsWith('/Yacusol-app/'));

  if (event.request.method !== 'GET') return;

  if (isAppShell) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
  }
});
