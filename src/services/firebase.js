import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// Default initial state for Soyul & Sowon
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
      balance: 50000
    },
    {
      id: 'kid2',
      name: '소원',
      avatar: '👧',
      color: '#ec4899',
      balance: 30000
    }
  ],
  transactions: [
    {
      id: 't1',
      kidId: 'kid1',
      type: 'deposit',
      amount: 50000,
      memo: '입금 (용돈)',
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 't2',
      kidId: 'kid2',
      type: 'deposit',
      amount: 30000,
      memo: '입금 (용돈)',
      date: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ]
};

// Storage key v3 to completely replace transactions cache
const STORAGE_KEY = 'kids_cash_vault_data_v3';
const FIREBASE_CONFIG_KEY = 'kids_cash_vault_firebase_cfg';

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('kids_cash_vault_sync_v3')
  : null;

let dbInstance = null;

export function getSavedFirebaseConfig() {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveFirebaseConfig(cfg) {
  if (!cfg) {
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  } else {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(cfg));
  }
  window.location.reload();
}

export function initFirebase() {
  const cfg = getSavedFirebaseConfig();
  if (!cfg || !cfg.apiKey || !cfg.projectId) return null;

  try {
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(cfg) : apps[0];
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (e) {
    console.error('Firebase init error:', e);
    return null;
  }
}

export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  const db = initFirebase();

  if (db) {
    const docRef = doc(db, 'vaults', familyVaultId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        callback(data);
      } else {
        setDoc(docRef, DEFAULT_VAULT_DATA);
        callback(DEFAULT_VAULT_DATA);
      }
    }, (err) => {
      console.warn('Firestore snapshot error fallback to local:', err);
      loadLocal(callback);
    });

    return () => unsubscribe();
  }

  loadLocal(callback);

  const handleMessage = (event) => {
    if (event.data && event.data.type === 'VAULT_UPDATED') {
      loadLocal(callback);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }

  const handleStorage = (e) => {
    if (e.key === STORAGE_KEY) {
      loadLocal(callback);
    }
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

function loadLocal(callback) {
  try {
    // Clear legacy v1 & v2 keys completely
    localStorage.removeItem('kids_cash_vault_data_v1');
    localStorage.removeItem('kids_cash_vault_data_v2');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      callback(parsed);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VAULT_DATA));
      callback(DEFAULT_VAULT_DATA);
    }
  } catch (e) {
    callback(DEFAULT_VAULT_DATA);
  }
}

export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'VAULT_UPDATED', timestamp: Date.now() });
  }

  const db = initFirebase();
  if (db) {
    try {
      const docRef = doc(db, 'vaults', familyVaultId);
      await setDoc(docRef, newData, { merge: true });
    } catch (e) {
      console.error('Firebase save error:', e);
    }
  }
}
