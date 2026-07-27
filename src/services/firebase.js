// Standard Reliable Persistent Vault Storage Engine

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

const PERSISTENT_STORAGE_KEY = 'kids_vault_persistent_db_v10';

// 1. Always load stored data first on refresh
export function getInitialVaultData() {
  try {
    const stored = localStorage.getItem(PERSISTENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.kids) return parsed;
    }
  } catch (e) {
    console.error('Error loading vault storage:', e);
  }
  return DEFAULT_VAULT_DATA;
}

// 2. Subscribe & Listen to data changes across tabs/windows
export function subscribeVaultData(familyVaultId = 'my-family-vault', callback) {
  // Deliver persistent data on mount immediately
  const initialData = getInitialVaultData();
  callback(initialData);

  // Cross-tab realtime sync listener
  const handleStorageChange = (e) => {
    if (e.key === PERSISTENT_STORAGE_KEY && e.newValue) {
      try {
        callback(JSON.parse(e.newValue));
      } catch (err) {}
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}

// 3. Save Vault Data permanently so refresh NEVER resets PIN or transactions
export async function saveVaultData(newData) {
  try {
    localStorage.setItem(PERSISTENT_STORAGE_KEY, JSON.stringify(newData));
  } catch (e) {
    console.error('Error saving vault storage:', e);
  }
}
