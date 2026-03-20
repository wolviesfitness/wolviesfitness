const CACHE = 'wolvies-v3';
const ASSETS = [
  '/wolviesfitness/',
  '/wolviesfitness/index.html',
  '/wolviesfitness/about.html',
  '/wolviesfitness/coaching.html',
  '/wolviesfitness/nutrition.html',
  '/wolviesfitness/shop.html',
  '/wolviesfitness/library.html',
  '/wolviesfitness/certifications.html',
  '/wolviesfitness/contact.html',
  '/wolviesfitness/blog.html',
  '/wolviesfitness/free-resources.html',
  '/wolviesfitness/dashboard.html',
  '/wolviesfitness/manifest.json',
  '/wolviesfitness/icon-192.png',
  '/wolviesfitness/icon-512.png'
];

// Install - cache core pages
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

// Activate - delete ALL old caches immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - network first, cache fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
