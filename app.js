const VAPID_PUBLIC_KEY = "BLcNsSNJUqzdRXERZuHnRRyI1MFq1MQjHotfgDSMJmV5bXdNm0ZCqWIN0zXjZm7pCt819vbxrZk1SIcZq";

async function init() {
  const status = document.getElementById('statusText');
  
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    status.innerText = "Eroare: Trebuie instalată pe ecranul principal (Home Screen) pe iOS 16.4+.";
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register('sw.js');
    const sub = await reg.pushManager.getSubscription();
    
    if (Notification.permission === 'denied') {
      status.innerText = "Notificările sunt blocate din setările iPhone-ului.";
    } else if (sub) {
      status.innerText = "Notificările sunt ACTIVE ✅";
      document.getElementById('subSection').style.display = 'block';
      document.getElementById('subData').value = JSON.stringify(sub);
    } else {
      status.innerText = "Notificările nu sunt activate încă.";
      document.getElementById('setupSection').style.display = 'block';
    }
  } catch (e) {
    status.innerText = "Eroare: " + e.message;
  }
}

document.getElementById('btnEnable').addEventListener('click', async () => {
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') throw new Error("Permisiune refuzată");
    
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: window.atob((VAPID_PUBLIC_KEY + '='.repeat((4 - VAPID_PUBLIC_KEY.length % 4) % 4)).replace(/\-/g, '+').replace(/_/g, '/'))
    });
    
    document.getElementById('statusText').innerText = "Notificările sunt ACTIVE ✅";
    document.getElementById('setupSection').style.display = 'none';
    document.getElementById('subSection').style.display = 'block';
    document.getElementById('subData').value = JSON.stringify(sub);
  } catch (e) {
    alert(e.message);
  }
});

init();
