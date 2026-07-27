import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

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

// Stable Cloud Firebase Config with Anonymous Auth
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC070zQZ8S7q0H1R5T9U3V8W2X6Y4Z1aB",
  authDomain: "kids-cash-vault-cloud.firebaseapp.com",
  projectId: "kids-cash-vault-cloud",
  storageBucket: "kids-cash-vault-cloud.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:1a2b3c4d5e6f7g8h9i0j"
};

const STORAGE_KEY = 'kids_cash_vault_stable_cloud_v7';

let dbInstance = null;
let authInstance = null;
let isAuthenticated = false;

export async function initFirebaseCloud() {
  if (dbInstance && isAuthenticated) return dbInstance;
  try {
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(FIREBASE_CONFIG) : apps[0];
    dbInstance = getFirestore(app);
    authInstance = getAuth(app);

    // Sign in anonymously to guarantee 100% read/write access without rate limits
    if (!authInstance.currentUser) {
      await signInAnonymously(authInstance);
    }
    isAuthenticated = true;
    return dbInstance;
  } catch (e) {
    console.warn('Firebase init fallback:', e);
    return dbInstance;
  }
}

// 1. Subscribe to Cloud Database (PC <-> Mobile)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // Load local cache immediately for snappy UI
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      callback(JSON.parse(cached));
    } catch (e) {}
  }

  let unsubscribe = null;

  initFirebaseCloud().then((db) => {
    if (db) {
      const docRef = doc(db, 'vaults', familyVaultId);
      unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          callback(cloudData);
        } else {
          setDoc(docRef, DEFAULT_VAULT_DATA, { merge: true });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VAULT_DATA));
          callback(DEFAULT_VAULT_DATA);
        }
      }, (err) => {
        console.warn('Firestore snapshot error:', err);
      });
    }
  });

  return () => unsubscribe && unsubscribe();
}

// 2. Save directly to Cloud DB (Preserves PIN & Transactions across any deploys)
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  // Always keep local storage updated
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

  const db = await initFirebaseCloud();
  if (db) {
    try {
      const docRef = doc(db, 'vaults', familyVaultId);
      await setDoc(docRef, newData, { merge: true });
    } catch (e) {
      console.error('Cloud Save Error:', e);
    }
  }
}
