// Direct Single Source Vault Sync Engine

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

const API_VAULT_URL = '/api/vault';
let isSaving = false;

// 1. Subscribe to Pure Cloud Database API (Direct sync on all devices)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  const syncWithCloud = async () => {
    if (isSaving) return;
    try {
      const res = await fetch(API_VAULT_URL + '?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });

      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && Array.isArray(cloudData.kids)) {
          // Always deliver live Cloud DB data to UI directly
          callback(cloudData);
        }
      }
    } catch (e) {
      console.warn('Vault Direct Sync Warning:', e);
    }
  };

  syncWithCloud();
  // 1-second pulse for instant cross-device updates
  const intervalId = setInterval(syncWithCloud, 1000);

  return () => clearInterval(intervalId);
}

// 2. Save directly to Cloud DB API
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  isSaving = true;

  try {
    await fetch(API_VAULT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  } catch (e) {
    console.error('Vault Direct Save Error:', e);
  } finally {
    setTimeout(() => {
      isSaving = false;
    }, 300);
  }
}
