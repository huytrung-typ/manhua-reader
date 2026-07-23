const CACHE_NAME = 'ai-reader-v10';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './tom_tat_van_co_chi_ton.txt',
  './icon.png'
];

// Cài đặt và tải các file vào bộ nhớ đệm
self.addEventListener('install', event => {
  self.skipWaiting(); // Ép service worker mới được cài đặt để kích hoạt ngay
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Xóa bộ nhớ cache cũ khi kích hoạt version mới
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Đang xóa cache cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Kiểm soát ngay lập tức các client đang mở
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