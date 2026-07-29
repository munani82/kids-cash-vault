// Permanent Vercel Serverless Sync Engine

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

// Permanent Vercel API Endpoint (No 24h Expiration, No Purge)
const API_VAULT_URL = '/api/vault';
const LOCAL_FALLBACK_KEY = 'kids_vault_permanent_fallback_v1';

let isSaving = false;

// 1. Subscribe to Permanent Vercel Serverless DB
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // 1-1. Immediate initial render from local fallback to prevent flash of zero balance
  try {
    const cached = localStorage.getItem(LOCAL_FALLBACK_KEY);
    if (cached) {
      callback(JSON.parse(cached));
    }
  } catch (e) {}

  // 1-2. Sync with Permanent Vercel Serverless API
  const syncWithCloud = async () => {
    if (isSaving) return;
    try {
      const res = await fetch(API_VAULT_URL + '?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });

      if (res.ok) {
        const cloudData = await res.json();
        if (cloudData && Array.isArray(cloudData.kids)) {
          localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(cloudData));
          callback(cloudData);
        }
      }
    } catch (e) {
      console.warn('Permanent Vault Sync Warning:', e);
    }
  };

  syncWithCloud();
  const intervalId = setInterval(syncWithCloud, 1000);

  return () => clearInterval(intervalId);
}

// 2. Save directly to Permanent Vercel Serverless DB
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  isSaving = true;
  try {
    localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(newData));
  } catch (e) {}

  try {
    await fetch(API_VAULT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  } catch (e) {
    console.error('Permanent Vault Save Error:', e);
  } finally {
    setTimeout(() => {
      isSaving = false;
    }, 200);
  }
}
