const CACHE_NAME = "bashword-v0.13.0";
const ASSETS = [
  "/bashword/",
  "/bashword/index.html",
  "/bashword/result.html",
  "/bashword/assets/styles/main.css",
  "/bashword/assets/styles/help.css",
  "/bashword/assets/styles/game/game.css",
  "/bashword/assets/styles/game/board.css",
  "/bashword/assets/styles/game/keyboard.css",
  "/bashword/assets/styles/result.css",
  "/bashword/assets/styles/levels.css",
  "/bashword/js/app.js",
  "/bashword/js/game.js",
  "/bashword/js/keyboard.js",
  "/bashword/js/storage.js",
  "/bashword/js/results.js",
  "/bashword/js/levels.js",
  "/bashword/js/header.js",
  "/bashword/data/dictionary.js",
  "/bashword/data/keyboard-layout.js",
  "/bashword/data/dictionary.txt",
  "/bashword/data/dictionary-1.txt",
  "/bashword/data/dictionary-2.txt",
  "/bashword/data/dictionary-3.txt",
  "/bashword/data/dictionary-4.txt",
  "/bashword/data/dictionary-5.txt"
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
