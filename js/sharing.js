import { addDoc, collection, getDocs, query as firestoreQuery, where } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

export async function shareProperties(firestore, state) {
  const shortKey = generateShortKey();
  await addDoc(collection(firestore, 'links'), {
    key: shortKey,
    properties: state.properties
  });
  const shortUrl = `${location.origin}${location.pathname}?share=${shortKey}`;
  navigator.clipboard.writeText(shortUrl).then(() => alert('短縮された共有リンクをコピーしました！'));
}

function generateShortKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortKey = '';
  for (let i = 0; i < 6; i++) {
    shortKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortKey;
}
