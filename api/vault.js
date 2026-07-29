// Single Source of Truth Cloud DB Proxy Serverless API
const CLOUD_DB_URL = 'https://jsonblob.com/api/jsonBlob/019fabd8-7dd2-751e-94a2-dd5338f08441';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Write to Single Source Cloud DB
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (data && Array.isArray(data.kids)) {
        await fetch(CLOUD_DB_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return res.status(200).json(data);
      }
    } catch (e) {
      console.error('Cloud DB Proxy Write Error:', e);
    }
  }

  // 2. Read from Single Source Cloud DB
  try {
    const cloudRes = await fetch(CLOUD_DB_URL + '?t=' + Date.now(), {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData && Array.isArray(cloudData.kids)) {
        return res.status(200).json(cloudData);
      }
    }
  } catch (e) {
    console.error('Cloud DB Proxy Read Error:', e);
  }

  // Fallback Data
  return res.status(200).json({
    familyVaultId: 'my-family-vault',
    parentPin: '1234',
    activeKidId: 'kid1',
    kids: [
      { id: 'kid1', name: '소율', avatar: '👧', balance: 0 },
      { id: 'kid2', name: '소원', avatar: '👧', balance: 0 }
    ],
    transactions: []
  });
}
