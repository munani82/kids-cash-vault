// Event-Driven Vault Data Store (No 0-won Flickering Polling)

export const DEFAULT_VAULT_DATA = {
  familyVaultId: 'my-family-vault',
  parentPin: '1234',
  activeKidId: 'kid1',
  kids: [
    { id: 'kid1', name: '소율', avatar: '👧', balance: 400000 },
    { id: 'kid2', name: '소원', avatar: '👧', balance: 100 }
  ],
  transactions: [
    { id: 'tx_soyul_init', kidId: 'kid1', type: 'deposit', amount: 400000, memo: '맡긴 돈 (입금)', date: new Date().toISOString() },
    { id: 'tx_sowon_init', kidId: 'kid2', type: 'deposit', amount: 100, memo: '맡긴 돈 (입금)', date: new Date().toISOString() }
  ]
};

const API_VAULT_URL = '/api/vault';
const LOCAL_STORAGE_KEY = 'kids_vault_clean_store_v12';

// 1. Subscribe to Vault Data (Loads latest clean state, NO flickering timers)
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // 1-1. Load current saved state immediately
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed.kids)) {
        callback(parsed);
      }
    }
  } catch (e) {}

  // 1-2. Single clean fetch on page load
  fetch(API_VAULT_URL + '?t=' + Date.now(), {
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  })
    .then(res => res.json())
    .then(cloudData => {
      if (cloudData && Array.isArray(cloudData.kids) && cloudData.kids.some(k => k.balance > 0)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudData));
        callback(cloudData);
      }
    })
    .catch(err => {
      console.warn('Initial fetch warning:', err);
    });

  return () => {};
}

// 2. Save Vault Data on User Action Only (Deposit, Withdraw, Change PIN)
export async function saveVaultData(newData, familyVaultId = 'my-family-vault') {
  // Save locally first so UI stays instantly stable without 0-won flickering
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  } catch (e) {}

  // Send to Cloud Serverless API
  try {
    await fetch(API_VAULT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    });
  } catch (e) {
    console.error('Vault Save Error:', e);
  }
}
