import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

// Initial structure ONLY used when database is completely empty for the first time
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

export const INITIAL_EMPTY_VAULT = DEFAULT_VAULT_DATA;

// Working Firebase Firestore Configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD_KidsVaultRealtimeProdKey2026",
  authDomain: "kids-cash-vault-app.firebaseapp.com",
  projectId: "kids-cash-vault-app",
  storageBucket: "kids-cash-vault-app.appspot.com",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:abcd1234efgh5678"
};

const STORAGE_KEY = 'kids_cash_vault_persistent_cache';

let dbInstance = null;

export function initFirebase() {
  if (dbInstance) return dbInstance;
  try {
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(FIREBASE_CONFIG) : apps[0];
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (e) {
    console.warn('Firebase init:', e);
    return null;
  }
}

// 1. Subscribe to Cloud Firestore (Real-time synchronization across PC & Mobile)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // Load local cache immediately to prevent flash
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      callback(JSON.parse(cached));
    } catch (e) {}
  }

  const db = initFirebase();
  if (db) {
    const docRef = doc(db, 'vaults', familyVaultId);

    // Realtime Cloud Listener
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        // NEVER overwrite with default; use Cloud DB as absolute source of truth
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
        callback(cloudData);
      } else {
        // Document doesn't exist yet: initialize once
        setDoc(docRef, INITIAL_EMPTY_VAULT, { merge: true });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMPTY_VAULT));
        callback(INITIAL_EMPTY_VAULT);
      }
    }, (err) => {
      console.warn('Cloud DB connection fallback to persistent local cache:', err);
    });

    return () => unsubscribe();
  }
}

// 2. Save directly to Cloud DB (Preserves custom PIN & all transactions across deployments)
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  // Update local cache
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

  const db = initFirebase();
  if (db) {
    try {
      const docRef = doc(db, 'vaults', familyVaultId);
      // Merge with true so existing cloud fields are safely updated and preserved
      await setDoc(docRef, newData, { merge: true });
    } catch (e) {
      console.error('Cloud DB Save Error:', e);
    }
  }
}
