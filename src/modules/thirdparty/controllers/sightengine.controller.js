const { moderateImage } = require('../adapters/sightengine.adapter');
const Logger = require('../../../shared/helpers/logger.helper');


/**
 * Phân tích kết quả kiểm duyệt nudity để cảnh báo mức độ
 */
function analyzeNudityResult(result) {
  const { nudity } = result;

  if (!nudity) return null;

  let level = 'safe';
  let reason = 'Không có yếu tố nhạy cảm';

  if (nudity.raw >= 0.9) {
    level = 'danger';
    reason = 'Ảnh có chứa nội dung nhạy cảm rõ ràng (raw nudity)';
  } else if (nudity.partial >= 0.6) {
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

/**
 * Controller xử lý kiểm duyệt URL
 */

exports.moderateByUrl = async (req, res) => {
  try {
    Logger.i(`[SIGHTENGINE_CONTROLLER] 📥 Nhận yêu cầu kiểm duyệt URL: ${req.body.url}`);
    const result = await moderateImage(req.body.url);


    const moderation = analyzeNudityResult(result);


    Logger.i(`✅ Kiểm duyệt thành công`, 'SIGHTENGINE_CONTROLLER');
    // res.json({ success: true, data: result });

    return res.json({
      success: true,
      data: result,
      moderation, // thêm thông tin cảnh báo nếu có
    });
  } catch (error) {
    Logger.e('❌ Lỗi tại moderateByUrl', 'SIGHTENGINE_CONTROLLER', error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};
