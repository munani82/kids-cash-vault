import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

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

// Public Working Cloud Database Endpoint (npoint / jsonbin / firebase fallback)
const CLOUD_SYNC_URL = 'https://api.npoint.io/46132488a01c40ad4a15';
const STORAGE_KEY = 'kids_cash_vault_data_cloud_v4';

let isCloudActive = false;

// 1. Subscribe to Cloud Sync across different devices (PC <-> Mobile)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // First load cached data for speed
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try { callback(JSON.parse(cached)); } catch (e) {}
  }

  // Fetch real-time data from Cloud DB every 3 seconds for cross-device sync (PC <-> Phone)
  const fetchCloudData = async () => {
    try {
      const res = await fetch(CLOUD_SYNC_URL, { cache: 'no-store' });
      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && cloudData.kids) {
          isCloudActive = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          callback(cloudData);
        }
      }
    } catch (e) {
      console.warn('Cloud poll fallback to local:', e);
    }
  };

  fetchCloudData();
  const timer = setInterval(fetchCloudData, 3000);

  return () => clearInterval(timer);
}

// 2. Save directly to Cloud DB so Mobile immediately sees PC inputs
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  // Update local immediately for snappy UI
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

  // Send update to global Cloud DB server
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  } catch (e) {
    console.error('Cloud Sync Save Error:', e);
  }
}
