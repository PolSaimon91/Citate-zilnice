self.addEventListener('push', function(event) {
  let title = 'Citatul Momentului';
  let bodyText = 'Deschide pentru a vedea citatul!';

  if (event.data) {
    try {
      const dataJSON = event.data.json();
      title = dataJSON.title || title;
      bodyText = dataJSON.body || bodyText;
    } catch (e) {
      // Fallback în cazul în care primește text simplu
      bodyText = event.data.text();
    }
  }

  const options = {
    body: bodyText,
    icon: 'https://via.placeholder.com/192/000000/FFFFFF?text=C',
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let i = 0; i < windowClients.length; i++) {
      let client = windowClients[i];
      if (client.url === '/' && 'focus' in client) { return client.focus(); }
    }
    if (clients.openWindow) { return clients.openWindow('/'); }
  }));
});
