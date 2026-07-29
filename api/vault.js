// Vercel Serverless API - Permanent Vault Store
let vaultStore = {
  familyVaultId: 'my-family-vault',
  parentPin: '1234',
  activeKidId: 'kid1',
  kids: [
    { id: 'kid1', name: '소율', avatar: '👧', balance: 0 },
    { id: 'kid2', name: '소원', avatar: '👧', balance: 0 }
  ],
  transactions: []
};

export default function handler(req, res) {
  // CORS & Cache control
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (data && Array.isArray(data.kids)) {
        vaultStore = data;
      }
      return res.status(200).json(vaultStore);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid Payload' });
    }
  }

  return res.status(200).json(vaultStore);
}
