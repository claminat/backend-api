const { callRapidApi } = require('../adapters/rapidapi.adapter');

exports.getTrendingPosts = async (req, res) => {
  try {
    const data = await callRapidApi('tiktok_api', { count: req.query.count || 10 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.searchScraper = async (req, res) => {
  try {
    const query = {
      keywords: req.query.keywords || 'fyp',
      region: req.query.region || 'us',
      count: req.query.count || 10,
      cursor: req.query.cursor || 0,
      publish_time: req.query.publish_time || 0,
      sort_type: req.query.sort_type || 0
    };
    const data = await callRapidApi('tiktok_scraper', query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};