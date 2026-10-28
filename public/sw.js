// Uchitatvam Progressive Web App Service Worker (Production-Grade)
const CACHE_NAME = 'uchitatvam-pwa-v2';
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/site.webmanifest',
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA Precache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean old caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Stale while revalidate for assets, network first for pages
self.addEventListener('fetch', (event) => {
  // Only handle GET requests and http/https
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Skip API, Next internals, and auth routes
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('/_next/') ||
    event.request.url.includes('/auth/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Helper to build notification configuration for both core channels
function buildNotificationConfig(type, rawData = {}) {
  const isBiometric = type === 'biometrics';
  const isQuest = type === 'quests';

  let title = rawData.title || (isBiometric ? '⚡ Biometric Recovery Sync' : isQuest ? '🥕 Daily Quest & Mandi Fuel' : 'Uchitatvam Live Alert');
  let body = rawData.body;
  let tag = rawData.tag || (isBiometric ? 'uchitatvam-biometrics' : isQuest ? 'uchitatvam-quests' : 'uchitatvam-general');
  let url = rawData.data?.url || (isBiometric ? '/#health-sync-section' : isQuest ? '/rewards' : '/');

  if (!body) {
    if (isBiometric) {
      body = 'Recovery readiness at 92%. Parasympathetic Box Breathing window open for optimal training adaptation.';
    } else if (isQuest) {
      body = 'Morning Mandi harvest ready! Claim +150 Potato Tokens and log your seasonal farm produce.';
    } else {
      body = 'Your athletic telemetry and daily quests are synchronized.';
    }
  }

  const actions = isBiometric
    ? [
        { action: 'open_biometrics', title: 'View Telemetry' },
        { action: 'close', title: 'Dismiss' },
      ]
    : isQuest
    ? [
        { action: 'open_quests', title: 'Claim Tokens' },
        { action: 'close', title: 'Dismiss' },
      ]
    : [
        { action: 'open', title: 'Open App' },
        { action: 'close', title: 'Dismiss' },
      ];

  return {
    title,
    options: {
      body,
      icon: rawData.icon || '/android-chrome-192x192.png',
      badge: rawData.badge || '/android-chrome-192x192.png',
      tag,
      renotify: true,
      requireInteraction: false,
      vibrate: isBiometric ? [150, 60, 150] : [200, 80, 200, 80],
      timestamp: Date.now(),
      data: {
        url,
        type,
        ...(rawData.data || {}),
      },
      actions,
    },
  };
}

// Service Worker Push Event Handler
self.addEventListener('push', (event) => {
  let payload = {};
  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload = { body: event.data.text() };
    }
  }

  const type = payload.type || 'general';
  const config = buildNotificationConfig(type, payload);

  event.waitUntil(self.registration.showNotification(config.title, config.options));
});

// Notification Click Event Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  let targetUrl = event.notification.data?.url || '/';
  if (event.action === 'open_biometrics') {
    targetUrl = '/#health-sync-section';
  } else if (event.action === 'open_quests') {
    targetUrl = '/rewards';
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Client Message Listener: allows web application to trigger native service worker notifications
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options, notificationCategory } = event.data;
    const config = buildNotificationConfig(notificationCategory || 'general', {
      title,
      ...options,
    });
    self.registration.showNotification(config.title, config.options);
  }

  if (event.data.type === 'SHOW_BOTH_NOTIFICATIONS') {
    const bioConfig = buildNotificationConfig('biometrics', event.data.biometrics || {});
    const questConfig = buildNotificationConfig('quests', event.data.quests || {});

    self.registration.showNotification(bioConfig.title, bioConfig.options);

    // Stagger second notification slightly for clear mobile OS distinction
    setTimeout(() => {
      self.registration.showNotification(questConfig.title, questConfig.options);
    }, 900);
  }
});
