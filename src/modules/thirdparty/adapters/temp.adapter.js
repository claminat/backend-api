const axios = require('axios');
const FormData = require('form-data');
const Logger = require('../../../shared/helpers/logger.helper');

exports.uploadToTemp = async (buffer, originalname, mimetype) => {
  try {
    Logger.d(`🔧 Chuẩn bị upload buffer: ${originalname}`, 'TEMP_ADAPTER');

    const form = new FormData();
    form.append('file', buffer, {
      filename: originalname,
      contentType: mimetype,
    });

    const response = await axios.post('https://temp.sh/upload', form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    Logger.d(`📦 Phản hồi từ temp.sh: ${JSON.stringify(response.data)}`, 'TEMP_ADAPTER');

    const matches = response.data.match(/https?:\/\/temp\.sh\/\S+/);
    const url = matches ? matches[0] : null;

    if (!url) throw new Error('Không tìm thấy link từ phản hồi temp.sh');

    Logger.i(`🌐 Đã upload lên temp.sh: ${url}`, 'TEMP_ADAPTER');

    return { url };
  } catch (error) {
    if (error.response && error.response.data) {
      Logger.e(
        '❌ Upload tới temp.sh thất bại',
        'TEMP_ADAPTER',
        JSON.stringify(error.response.data),
        error.stack
      );
    } else {
      Logger.e(
        '❌ Upload tới temp.sh thất bại',
        'TEMP_ADAPTER',
        error.message,
        error.stack
      );
    }
    throw error;
  }
};
