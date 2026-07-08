const CACHE = 'energeticos-termas-v4-anticache';
const ASSETS = [
  './',
  'index.html',
  'styles-v4.css?v=4',
  'app-v4.js?v=4',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'logo-energeticos.jpg',
  'yacusol-hero.jpg',
  'xolmax-hero.png',
  'luxxol-hero.png',
  'intipower-hero.png',
  'lista-precios-final.png',
  'accesorio-valvula-termostatica.jpg',
  'accesorio-tubo-vacio.png',
  'accesorio-tanque-asistente.jpg',
  'accesorio-resistencia.jpg',
  'accesorio-controlador.jpg',
  'accesorio-varilla-magnesio.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request, { cache: 'no-store' })
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
