/* 满分英语 Service Worker：离线可用（需通过 http/https 访问） */
const CACHE = 'fullscore-en-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/data-vocab.js',
  './js/data-course.js',
  './js/data-bank.js',
  './js/data-bank2.js',
  './js/engine.js',
  './js/core.js',
  './js/ui-home.js',
  './js/ui-vocab.js',
  './js/ui-grammar.js',
  './js/ui-practice.js',
  './js/ui-mock.js',
  './js/ui-plan.js',
  './js/ui-me.js',
  './js/ui-review.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res && res.ok && e.request.url.indexOf(location.origin) === 0) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
