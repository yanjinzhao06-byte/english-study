/* ===========================================================
 *  英语 · 离线缓存 Service Worker
 *  —— 装到主屏幕后，没网也能打开
 *
 *  ⚠️ 改完网页文件后，把下面的版本号往上加一（再上传），
 *     手机上的旧缓存才会更新。
 * =========================================================== */
const VERSION = 'v11';
const CACHE = 'english-match-' + VERSION;

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './words.js',
  './manifest.webmanifest',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  /* 学习中心 */
  './study.html',
  './study.css',
  './study.js',
  './data/data-tcm.js',
  './data/data-grammar.js',
  './data/data-errors.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  // 页面导航：优先用缓存里的首页（离线可用）
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // 其它资源：缓存优先
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req)))
  );
});
