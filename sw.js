self.addEventListener('push', function(event) {
  const text = event.data ? event.data.text() : 'Deschide pentru a vedea citatul!';
  const options = {
    body: text,
    icon: 'https://via.placeholder.com/192/000000/FFFFFF?text=C',
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification('Citatul Momentului', options));
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
