const axios = require('axios');

const HOSTS = {
  tiktok_api: {
    host: process.env.RAPIDAPI_TIKTOK_API_HOST,
    endpoint: '/api/post/trending',
    key: process.env.RAPIDAPI_KEY
  },
  tiktok_scraper: {
    host: process.env.RAPIDAPI_TIKTOK_SCRAPER_HOST,
    endpoint: '/feed/search',
    key: process.env.RAPIDAPI_KEY
  }
};

exports.callRapidApi = async (service, params = {}, overrideEndpoint = null) => {
  const config = HOSTS[service];
  if (!config) throw new Error(`Service ${service} không được định nghĩa`);

  const url = `https://${config.host}${overrideEndpoint || config.endpoint}`;

  const response = await axios.get(url, {
    params,
    headers: {
      'x-rapidapi-host': config.host,
      'x-rapidapi-key': config.key
    }
  });

  return response.data;
};