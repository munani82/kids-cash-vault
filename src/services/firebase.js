// Direct Cloud Sync Engine with 0.8s High-Speed Pulse

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

const PURE_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019fa21f-e3db-7c35-88d2-7e4a9bf04c2d';

let isSaving = false;

// 1. Subscribe to Cloud DB with 0.8s High-Speed Pulse
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  const syncWithCloud = async () => {
    if (isSaving) return;
    try {
      const res = await fetch(PURE_CLOUD_URL + '?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });

      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && cloudData.kids) {
          callback(cloudData);
        }
      }
    } catch (e) {
      console.warn('Cloud DB Sync Error:', e);
    }
  };

  // Immediate sync on load
  syncWithCloud();

  // High-speed pulse every 0.8 seconds (800ms) to eliminate 3~5s delay
  const intervalId = setInterval(syncWithCloud, 800);

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
    console.error('Cloud Save Error:', e);
  } finally {
    setTimeout(() => {
      isSaving = false;
    }, 250);
  }
}
