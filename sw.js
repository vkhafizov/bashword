const CACHE_NAME = "bashword-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/assets/styles/main.css",
  "/js/app.js",
  "/js/game.js",
  "/js/keyboard.js",
  "/js/storage.js",
  "/data/dictionary.js",
  "/data/keyboard-layout.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
      caches.match(event.request)
          .then(response => response || fetch(event.request))
  );
});
