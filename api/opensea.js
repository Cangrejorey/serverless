// api/opensea.js
const fetch = require('node-fetch@2');

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
  // Log request details
  console.log(`[OpenSea API] Requesting collection: ${collection}`);
  
  // Call OpenSea API
  const apiUrl = `https://api.opensea.io/api/v1/assets?collection=${collection}&limit=20`;
  console.log(`[OpenSea API] Full URL: ${apiUrl}`);
  
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  // Log response status
  console.log(`[OpenSea API] Response status: ${response.status}`);
  
  const data = await response.json();
  
  // Log a preview of the response data
  const dataPreview = JSON.stringify(data).substring(0, 300) + '...';
  console.log(`[OpenSea API] Response preview: ${dataPreview}`);
  
  // Log asset count
  const assetCount = data.assets ? data.assets.length : 0;
  console.log(`[OpenSea API] Assets found: ${assetCount}`);
  
  return res.status(200).json(data);
} catch (error) {
  // Log detailed error information
  console.error(`[OpenSea API] Error: ${error.message}`);
  console.error(`[OpenSea API] Stack: ${error.stack}`);
  return res.status(500).json({ error: 'Failed to fetch from OpenSea API', message: error.message });
}
};
