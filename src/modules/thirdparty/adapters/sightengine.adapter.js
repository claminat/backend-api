const axios = require('axios');
const config = require('../../../shared/config');
const Logger = require('../../../shared/helpers/logger.helper');

exports.moderateImage = async (url) => {
  try {
    Logger.d(`🔍 Gửi yêu cầu tới Sightengine: ${url}`, 'SIGHTENGINE_ADAPTER');

    const { apiUser, apiSecret } = config.thirdParty.sightengine;

    const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
      params: {
        models: 'nudity',
        api_user: apiUser,
        api_secret: apiSecret,
        url,
      },
    });

    Logger.d(`📦 Phản hồi từ Sightengine: ${JSON.stringify(response.data)}`, 'SIGHTENGINE_ADAPTER');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      Logger.e(
        '❌ Gọi Sightengine thất bại',
        'SIGHTENGINE_ADAPTER',
        JSON.stringify(error.response.data),
        error.stack
      );
    } else {
      Logger.e('❌ Gọi Sightengine thất bại', 'SIGHTENGINE_ADAPTER', error.message, error.stack);
    }
    throw error;
  }
};
