const axios = require('axios');
const FormData = require('form-data');
const Logger = require('../../../shared/helpers/logger.helper');
const config = require('../../../shared/config');

exports.uploadToImgbb = async (buffer, originalname, mimetype) => {
  try {
    Logger.d(`🔧 Chuẩn bị upload buffer lên imgbb`, 'IMGBB_ADAPTER');

    const form = new FormData();
    form.append('image', buffer, {
      filename: originalname,
      contentType: mimetype,
    });
    form.append('key', config.thirdParty.imgbb.apiKey);

    const response = await axios.post(config.thirdParty.imgbb.endpoint, form, {
      headers: form.getHeaders(),
    });

    Logger.d(`📦 Phản hồi từ imgbb: ${JSON.stringify(response.data)}`, 'IMGBB_ADAPTER');

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      Logger.e(
        '❌ Upload tới imgbb thất bại',
        'IMGBB_ADAPTER',
        JSON.stringify(error.response.data),
        error.stack
      );
    } else {
      Logger.e('❌ Upload tới imgbb thất bại', 'IMGBB_ADAPTER', error.message, error.stack);
    }
    throw error;
  }
};
