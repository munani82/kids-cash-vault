import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

export const DEFAULT_VAULT_DATA = {
  familyVaultId: 'my-family-vault',
  parentPin: '1234',
  activeKidId: 'kid1',
  kids: [
    { id: 'kid1', name: '소율', avatar: '👧', balance: 0 },
    { id: 'kid2', name: '소원', avatar: '👧', balance: 0 }
  ],
  transactions: []
};

// Standard Firebase Configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC070zQZ8S7q0H1R5T9U3V8W2X6Y4Z1aB",
  authDomain: "kids-cash-vault-cloud.firebaseapp.com",
  projectId: "kids-cash-vault-cloud",
  storageBucket: "kids-cash-vault-cloud.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:1a2b3c4d5e6f7g8h9i0j"
};

let db = null;

function getDb() {
  if (db) return db;
  try {
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(FIREBASE_CONFIG) : apps[0];
    db = getFirestore(app);
    return db;
  } catch (e) {
    console.error('Firebase init error:', e);
    return null;
  }
}

// 1. Subscribe to Firestore Document (Direct WebSocket Realtime Listener)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  const database = getDb();
  if (!database) return () => {};

  const docRef = doc(database, 'vaults', familyVaultId);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        // Initialize once if document does not exist
        setDoc(docRef, DEFAULT_VAULT_DATA, { merge: true });
        callback(DEFAULT_VAULT_DATA);
      }
    },
    (error) => {
      console.error('Firestore listener error:', error);
    }
  );

  return unsubscribe;
}

// 2. Save directly to Firestore Document
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  const database = getDb();
  if (!database) return;

  try {
    const docRef = doc(database, 'vaults', familyVaultId);
    await setDoc(docRef, newData, { merge: true });
  } catch (error) {
    console.error('Firestore save error:', error);
  }
}
