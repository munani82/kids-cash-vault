import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

// Default initial state
export const DEFAULT_VAULT_DATA = {
  familyVaultId: 'my-family-vault',
  parentPin: '1234', // Default parent PIN
  activeKidId: 'kid1',
  kids: [
    {
      id: 'kid1',
      name: '지우',
      avatar: '🐶',
      color: '#7c3aed',
      balance: 45000,
      goals: [
        { id: 'g1', title: '닌텐도 스위치 칩', targetAmount: 65000, icon: '🎮' },
        { id: 'g2', title: '레고 블록 세트', targetAmount: 30000, icon: '🧱' }
      ]
    },
    {
      id: 'kid2',
      name: '민준',
      avatar: '🐱',
      color: '#ec4899',
      balance: 28000,
      goals: [
        { id: 'g3', title: '자전거 장갑', targetAmount: 15000, icon: '🚲' }
      ]
    }
  ],
  transactions: [
    {
      id: 't1',
      kidId: 'kid1',
      type: 'deposit', // deposit or withdraw
      amount: 50000,
      category: '세뱃돈',
      memo: '할머니께 받은 설 세뱃돈',
      date: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 't2',
      kidId: 'kid1',
      type: 'withdraw',
      amount: 5000,
      category: '간식',
      memo: '아이스크림 사먹기',
      date: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 't3',
      kidId: 'kid2',
      type: 'deposit',
      amount: 30000,
      category: '용돈',
      memo: '이번 달 정기 용돈',
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 't4',
      kidId: 'kid2',
      type: 'withdraw',
      amount: 2000,
      category: '학용품',
      memo: '공책 구매',
      date: new Date(Date.now() - 86400000 * 0.5).toISOString()
    }
  ]
};

const STORAGE_KEY = 'kids_cash_vault_data_v1';
const FIREBASE_CONFIG_KEY = 'kids_cash_vault_firebase_cfg';

// BroadcastChannel for cross-tab local sync if Firebase not set
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('kids_cash_vault_sync')
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

// Subscribe to real-time changes
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  const db = initFirebase();

  // If Firebase is active, listen via Firestore onSnapshot
  if (db) {
    const docRef = doc(db, 'vaults', familyVaultId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        callback(data);
      } else {
        // Initialize doc with default
        setDoc(docRef, DEFAULT_VAULT_DATA);
        callback(DEFAULT_VAULT_DATA);
      }
    }, (err) => {
      console.warn('Firestore snapshot error fallback to local:', err);
      loadLocal(callback);
    });

    return () => unsubscribe();
  }

  // Fallback: LocalStorage + BroadcastChannel for same-device realtime multi-tabs
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

// Save vault data (Parent updates balance, transactions, goals)
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  // Update local storage first
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
