// File: src/modules/thirdparty/controllers/nsfw.controller.js

const logger = require('../../../shared/helpers/logger.helper');
const { uploadToImgbb } = require('../adapters/imgbb.adapter');
const { moderateImage } = require('../adapters/sightengine.adapter');


function analyzeNudityResult(result) {
  if (!result || typeof result !== 'object' || !result.nudity) {
    logger.e('[NSFW_CONTROLLER] ❌ analyzeNudityResult: result không hợp lệ', result);
    return {
      flagged: false,
      level: 'unknown',
      reason: 'Không thể phân tích kết quả kiểm duyệt',
    };
  }

  const { nudity } = result;

  let level = 'safe';
  let reason = 'Không có yếu tố nhạy cảm';

  if (nudity.raw >= 0.9) {
    level = 'danger';
    reason = 'Ảnh có chứa nội dung nhạy cảm rõ ràng (raw nudity)';
  } else if (nudity.partial >= 0.5) {
    level = 'warning';
    reason = 'Ảnh có yếu tố nhạy cảm một phần (partial nudity)';
  } else if (nudity.raw >= 0.5 || nudity.partial >= 0.3) {
    level = 'moderate';
    reason = 'Ảnh có khả năng chứa nội dung nhạy cảm';
  }

  return {
    flagged: level !== 'safe',
    level,
    reason,
  };
}


exports.checkNsfwFromUpload = async (req, res) => {
    try {
        const fileBuffer = req.file?.buffer;
        const fileName = req.file?.originalname;

        logger.i(`[NSFW_CONTROLLER] 📤 Nhận yêu cầu kiểm duyệt file: ${fileName}`);

        if (!fileBuffer) {
            return res.status(400).json({ success: false, message: 'Thiếu tệp tin upload' });
        }

        const imgbbRes = await uploadToImgbb(fileBuffer, fileName);
        const imageUrl = imgbbRes?.data?.image?.url;


        if (!imageUrl) {
            logError('[NSFW_CONTROLLER]', '❌ Không thể lấy URL từ imgbb');
            throw new Error('Không thể lấy URL từ imgbb');
        }

        logger.i(`[NSFW_CONTROLLER] ✅ Upload imgbb thành công: ${imageUrl}`);

        const sightRes = await moderateImage(imageUrl);
        const moderation = analyzeNudityResult(sightRes);

        return res.json({
            success: true,
            data: sightRes.data,
            moderation,
        });
    } catch (err) {
        logger.e('[NSFW_CONTROLLER] ❌ Lỗi kiểm duyệt NSFW', err);
        return res.status(400).json({ success: false, message: err.message });
    }
};
