import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// Default initial state
export const DEFAULT_VAULT_DATA = {
  familyVaultId: 'my-family-vault',
  parentPin: '1234',
  activeKidId: 'kid1',
  kids: [
    {
      id: 'kid1',
      name: '소율',
      avatar: '👧',
      color: '#3182f6',
      balance: 0
    },
    {
      id: 'kid2',
      name: '소원',
      avatar: '👧',
      color: '#ec4899',
      balance: 0
    }
  ],
  transactions: []
};

// Demo/Fallback Firebase config (Can be overridden by user)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD-PlaceholderKeyForKidsVaultApp2026",
  authDomain: "kids-cash-vault-app.firebaseapp.com",
  projectId: "kids-cash-vault-app",
  storageBucket: "kids-cash-vault-app.appspot.com",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:abcd1234efgh5678"
};

const FIREBASE_CONFIG_KEY = 'kids_cash_vault_firebase_cfg';
const STORAGE_KEY = 'kids_cash_vault_data_cloud_cache';

let dbInstance = null;

export function getSavedFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_FIREBASE_CONFIG;
  } catch (e) {
    return DEFAULT_FIREBASE_CONFIG;
  }
}

export function initFirebase() {
  const cfg = getSavedFirebaseConfig();
  if (!cfg || !cfg.apiKey) return null;

  try {
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(cfg) : apps[0];
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (e) {
    console.warn('Firebase init fallback:', e);
    return null;
  }
}

// 100% Cloud Database (Firestore) First Subscription
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  const db = initFirebase();

  if (db) {
    const docRef = doc(db, 'vaults', familyVaultId);
    
    // Subscribe to Firestore Real-time DB
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // Sync cache for offline fallback
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        callback(data);
      } else {
        // Initialize Cloud DB with default
        setDoc(docRef, DEFAULT_VAULT_DATA);
        callback(DEFAULT_VAULT_DATA);
      }
    }, (err) => {
      console.warn('Firestore offline fallback:', err);
      loadLocalCache(callback);
    });

    return () => unsubscribe();
  }

  // Local fallback if DB offline
  loadLocalCache(callback);
}

function loadLocalCache(callback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      callback(JSON.parse(raw));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VAULT_DATA));
      callback(DEFAULT_VAULT_DATA);
    }
  } catch (e) {
    callback(DEFAULT_VAULT_DATA);
  }
}

// Save directly to Cloud DB (Firestore)
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  // Update local cache immediately
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

  const db = initFirebase();
  if (db) {
    try {
      const docRef = doc(db, 'vaults', familyVaultId);
      await setDoc(docRef, newData, { merge: true });
    } catch (e) {
      console.error('Cloud DB Save Error:', e);
    }
  }
}
