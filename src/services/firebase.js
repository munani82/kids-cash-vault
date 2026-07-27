// 100% Pure Cloud DB Engine (No Local Storage Blocking)

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

// Clean Live Cloud Endpoint
const PURE_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019fa21f-e3db-7c35-88d2-7e4a9bf04c2d';

let isSaving = false;

// 1. Subscribe to Cloud DB ONLY (PC <-> Mobile 100% Direct Realtime Cloud Sync)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // Fetch directly from Cloud DB on load
  const syncWithCloud = async () => {
    if (isSaving) return;
    try {
      const res = await fetch(PURE_CLOUD_URL + '?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });

      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && cloudData.kids) {
          // Always deliver Cloud DB data directly to UI
          callback(cloudData);
        }
      }
    } catch (e) {
      console.warn('Pure Cloud DB Sync Error:', e);
    }
  };

  syncWithCloud();
  // Poll Cloud DB every 2 seconds so phone immediately reflects PC edits
  const intervalId = setInterval(syncWithCloud, 2000);

  return () => clearInterval(intervalId);
}

// 2. Save directly to Cloud DB (PUT)
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  isSaving = true;

  try {
    await fetch(PURE_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  } catch (e) {
    console.error('Pure Cloud Save Error:', e);
  } finally {
    setTimeout(() => {
      isSaving = false;
    }, 400);
  }
}
