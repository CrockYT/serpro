import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getFirebaseConfig } from './firebase-config.js';

export async function initFirebase() {
  const config = await getFirebaseConfig();
  const app = initializeApp(config);
  return getFirestore(app);
}
