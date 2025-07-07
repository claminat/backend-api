const { uploadToImgbb } = require('../adapters/imgbb.adapter');

exports.uploadToImgbbController = async (req, res) => {
  try {
    const result = await uploadToImgbb(req.file.buffer, req.file.originalname, req.file.mimetype);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
