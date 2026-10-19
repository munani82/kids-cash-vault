import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

export const DEFAULT_VAULT_DATA = {
  familyVaultId: 'my_family_vault',
  parentPin: '1234',
  activeKidId: 'kid1',
  kids: [
    { id: 'kid1', name: '소율', avatar: '👧', balance: 400000 },
    { id: 'kid2', name: '소원', avatar: '👧', balance: 100 }
  ],
  transactions: [
    {
      id: 'tx_soyul_init',
      kidId: 'kid1',
      type: 'deposit',
      amount: 400000,
      memo: '맡긴 돈 (입금)',
      date: '2026/07/29'
    },
    {
      id: 'tx_sowon_init',
      kidId: 'kid2',
      type: 'deposit',
      amount: 100,
      memo: '맡긴 돈 (입금)',
      date: '2026/07/29'
    }
  ]
};

const LOCAL_STORAGE_KEY = 'kids_vault_realtime_store_v1';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let dbInstance = null;

function getDbInstance() {
  if (dbInstance) return dbInstance;

  const hasConfig = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId
  );

  if (!hasConfig) {
    return null;
  }

  try {
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
    dbInstance = getDatabase(app);
    return dbInstance;
  } catch (error) {
    console.error('Firebase Realtime Database 초기화 실패:', error);
    return null;
  }
}

export function subscribeVaultData(familyVaultId = 'my_family_vault', callback) {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.kids)) {
        callback(parsed);
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_VAULT_DATA));
      callback(DEFAULT_VAULT_DATA);
    }
  } catch (e) {
    callback(DEFAULT_VAULT_DATA);
  }

  const db = getDbInstance();

  if (!db) {
    console.warn('Firebase 환경 변수 미설정: 백업된 로컬 데이터로 동작합니다.');
    return () => {};
  }

  const cleanVaultId = familyVaultId.replace(/[^a-zA-Z0-9_]/g, '_');
  const vaultRef = ref(db, 'vaults/' + cleanVaultId);

  const unsubscribe = onValue(
    vaultRef,
    (snapshot) => {
      const cloudData = snapshot.val();
      if (cloudData && Array.isArray(cloudData.kids)) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudData));
        } catch (e) {}
        callback(cloudData);
      } else {
        set(vaultRef, DEFAULT_VAULT_DATA);
        callback(DEFAULT_VAULT_DATA);
      }
    },
    (error) => {
      console.error('Firebase 실시간 동기화 수신 오류:', error);
    }
  );

  return () => {
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }
  };
}

export async function saveVaultData(newData, familyVaultId = 'my_family_vault') {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  } catch (e) {}

  const db = getDbInstance();
  if (!db) {
    console.warn('Firebase 미연결: 변경사항이 로컬 브라우저에 저장되었습니다.');
    return;
  }

  try {
    const cleanVaultId = familyVaultId.replace(/[^a-zA-Z0-9_]/g, '_');
    const vaultRef = ref(db, 'vaults/' + cleanVaultId);
    await set(vaultRef, newData);
  } catch (error) {
    console.error('Firebase 영구 저장 오류:', error);
  }
}
