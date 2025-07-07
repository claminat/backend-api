const { uploadToTemp } = require('../adapters/temp.adapter');
const Logger = require('../../../shared/helpers/logger.helper');

exports.uploadToTempController = async (req, res) => {
  try {
    Logger.i(`📥 Nhận file upload: ${req.file?.originalname}`);
    const result = await uploadToTemp(req.file.buffer, req.file.originalname, req.file.mimetype);
    Logger.i(`✅ Upload thành công: ${result.url}`);
    res.json({ success: true, data: result });
  } catch (error) {
    Logger.e('❌ Lỗi tại uploadToTempController', 'TEMP_CONTROLLER', error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};
