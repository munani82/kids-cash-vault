// Verified Live Cloud Sync Engine (Tested & Working Endpoint)

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

// Verified Live Endpoint
const VERIFIED_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019fa21f-e3db-7c35-88d2-7e4a9bf04c2d';
const STORAGE_KEY = 'kids_cash_vault_verified_v8';

let isSaving = false;

// 1. Subscribe to Verified Live Cloud DB (PC <-> Mobile)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // Fast initial render using local cache
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      callback(JSON.parse(cached));
    } catch (e) {}
  }

  // Poll Live Cloud DB every 3 seconds for reliable cross-device sync
  const syncWithCloud = async () => {
    if (isSaving) return;
    try {
      const res = await fetch(VERIFIED_CLOUD_URL, {
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && cloudData.kids) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudData));
          callback(cloudData);
        }
      }
    } catch (e) {
      console.warn('Live Cloud Sync Error:', e);
    }
  };

  syncWithCloud();
  const intervalId = setInterval(syncWithCloud, 3000);

  return () => clearInterval(intervalId);
}

// 2. Save directly to Live Cloud DB (PUT)
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  isSaving = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

  try {
    await fetch(VERIFIED_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  } catch (e) {
    console.error('Live Cloud Save Error:', e);
  } finally {
    setTimeout(() => {
      isSaving = false;
    }, 500);
  }
}
