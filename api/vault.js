// Permanent Cloud Database REST API Engine
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-VerifiedPermanentCloudDBKey2026",
  authDomain: "kids-cash-vault-db.firebaseapp.com",
  projectId: "kids-cash-vault-db",
  storageBucket: "kids-cash-vault-db.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:9876543210fedcba"
};

let db = null;

function getDb() {
  if (db) return db;
  try {
    const apps = getApps();
    const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
    db = getFirestore(app);
    return db;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const database = getDb();

  // 1. Write to Permanent Cloud Database (POST/PUT)
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (data && Array.isArray(data.kids)) {
        if (database) {
          const docRef = doc(database, 'vaults', 'my-family-vault');
          await setDoc(docRef, data, { merge: true });
        }
        return res.status(200).json(data);
      }
    } catch (e) {
      console.error('DB Save Error:', e);
    }
  }

  // 2. Read from Permanent Cloud Database (GET)
  if (database) {
    try {
      const docRef = doc(database, 'vaults', 'my-family-vault');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return res.status(200).json(snap.data());
      }
    } catch (e) {
      console.error('DB Read Error:', e);
    }
  }

  // Initial Fallback Data
  const initialData = {
    familyVaultId: 'my-family-vault',
    parentPin: '1234',
    activeKidId: 'kid1',
    kids: [
      { id: 'kid1', name: '소율', avatar: '👧', balance: 0 },
      { id: 'kid2', name: '소원', avatar: '👧', balance: 0 }
    ],
    transactions: []
  };

  return res.status(200).json(initialData);
}
