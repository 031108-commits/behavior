const CACHE_NAME = 'construction-game-recorder-v1';
const urlsToCache = [
  './',
  './index.html',
  './history.html',
  './class.html',
  './student-detail.html',
  './ai.html',
  './css/style.css',
  './js/app.js',
  './js/index.js',
  './js/history.js',
  './js/class.js',
  './js/student-detail.js',
  './js/ai.js',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});