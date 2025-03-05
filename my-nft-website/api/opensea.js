// api/opensea.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get collection slug from query params
  const { collection } = req.query;
  
  if (!collection) {
    return res.status(400).json({ error: 'Collection slug is required' });
  }

  try {
    // Call OpenSea API
    const apiUrl = `https://api.opensea.io/api/v1/assets?collection=${collection}&limit=20`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
        // Add your OpenSea API key here if you have one
        // 'X-API-KEY': 'your-opensea-api-key'
      }
    });
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from OpenSea:', error);
    return res.status(500).json({ error: 'Failed to fetch from OpenSea API' });
  }
};