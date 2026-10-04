const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const RAW_SUBSCRIPTION = process.env.WEB_PUSH_SUBSCRIPTION;
const IS_TEST = process.env.IS_TEST === 'true';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !RAW_SUBSCRIPTION) {
  console.error("Lipsește VAPID Keys sau Subscription-ul din GitHub Secrets.");
  process.exit(1);
}

webpush.setVapidDetails('mailto:test@example.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
const subscription = JSON.parse(RAW_SUBSCRIPTION);

const now = new Date();
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Bucharest',
  hour: 'numeric', hour12: false,
  year: 'numeric', month: '2-digit', day: '2-digit'
});

const parts = formatter.formatToParts(now);
let bucHour = parseInt(parts.find(p => p.type === 'hour').value, 10);
if (bucHour === 24) bucHour = 0;

const year = parts.find(p => p.type === 'year').value;
const month = parts.find(p => p.type === 'month').value;
const day = parts.find(p => p.type === 'day').value;
const currentDateStr = `${year}-${month}-${day}`;

console.log(`Ora curentă în România: ${bucHour}:00`);

const schedule = [8, 11, 14, 17, 20];
let targetSlot = null;

if (!IS_TEST) {
  if (!schedule.includes(bucHour)) {
    console.log("Suntem în afara programului. Nu se trimite notificare.");
    process.exit(0);
  }
  targetSlot = bucHour;
} else {
  targetSlot = 'TEST';
}

const slotKey = `${currentDateStr}-${targetSlot}`;
const historyPath = path.join(__dirname, '..', 'history.json');
const quotesPath = path.join(__dirname, '..', 'quotes.json');

let history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
const quotes = JSON.parse(fs.readFileSync(quotesPath, 'utf8'));

if (!IS_TEST && history.lastSentSlot === slotKey) {
  console.log(`Notificarea pentru ora ${bucHour}:00 a fost deja trimisă azi. Ieșire.`);
  process.exit(0);
}

let availableQuotes = quotes.filter(q => !history.sentQuotes.includes(q.id));
if (availableQuotes.length === 0) {
  console.log("Toate citatele au fost trimise. O luăm de la capăt.");
  history.sentQuotes = [];
  availableQuotes = quotes;
}

const selectedQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
const payload = JSON.stringify({
  title: "Citatul momentului",
  body: `„${selectedQuote.quote}”\n— ${selectedQuote.author}`
});

webpush.sendNotification(subscription, payload).then(() => {
  console.log("Notificare trimisă cu succes către iPhone!");
  if (!IS_TEST) {
    history.lastSentSlot = slotKey;
    history.sentQuotes.push(selectedQuote.id);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  }
}).catch(err => {
  console.error("Eroare la trimitere:", err);
  process.exit(1);
});
