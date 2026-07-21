const CACHE_NAME = 'ai-reader-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './tom_tat_van_co_chi_ton.txt'
];

// Cài đặt và tải các file vào bộ nhớ đệm
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Chặn các request mạng và trả về file từ bộ nhớ đệm nếu có
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Nếu tìm thấy trong cache, trả về luôn (cực nhanh, không cần mạng)
        if (response) return response;
        // Nếu không, thực hiện fetch từ internet
        return fetch(event.request);
      })
  );
});