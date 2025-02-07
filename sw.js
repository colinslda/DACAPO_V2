// sw.js

const CACHE_NAME = 'dacapo-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/forgot_password.html',
  '/main.html',
  '/styles.css',
  '/auth.js',
  '/images/icon-192x192.png', // Ajoutez vos icônes ici
  '/images/icon-512x512.png'  // Ajoutez vos icônes ici
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Supprimer les anciens caches
          }
        })
      );
    })
  );
});

// Interception des requêtes fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la ressource est dans le cache, on la retourne
        if (response) {
          return response;
        }
        // Sinon, on fait une requête réseau
        return fetch(event.request);
      })
  );
});
