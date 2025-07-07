exports.validateModerationInput = (req, res, next) => {
  if (!req.body.url) {
    return res.status(400).json({ success: false, message: 'Image URL is required' });
  }
  next();
};
