// modules/auth/controllers/auth.controller.js
const authService = require('../services/auth.service');
const {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    changePasswordValidator,
    resetPasswordValidator
} = require('../validators/auth.validator');



// Đăng ký người dùng
exports.register = async (req, res) => {
    // Validate dữ liệu đầu vào
    const { error } = registerValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Gọi service để xử lý đăng ký
        const result = await authService.register(req.body);
        res.status(201).json(result);  // Trả về kết quả đăng ký
    } catch (err) {
        res.status(500).json({ message: err.message });  // Xử lý lỗi server
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    // Validate dữ liệu đầu vào
    const { error } = loginValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Gọi service để xử lý đăng nhập
        const result = await authService.login(req.body.email, req.body.password);
        res.json(result);  // Trả về token và thông tin người dùng
    } catch (err) {
        res.status(500).json({ message: err.message });  // Xử lý lỗi server
    }
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    // Validate dữ liệu đầu vào
    const { error } = forgotPasswordValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Gọi service để xử lý gửi mã khôi phục mật khẩu
        const result = await authService.forgotPassword(req.body.email);
        res.json(result);  // Trả về kết quả gửi mã
    } catch (err) {
        res.status(500).json({ message: err.message });  // Xử lý lỗi server
    }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    // Validate dữ liệu đầu vào
    const { error } = resetPasswordValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Gọi service để xử lý đặt lại mật khẩu
        const result = await authService.resetPassword(req.body.resetToken, req.body.newPassword);
        res.json(result);  // Trả về kết quả đặt lại mật khẩu
    } catch (err) {
        res.status(500).json({ message: err.message });  // Xử lý lỗi server
    }
};


// Xác thực email
exports.verifyEmail = async (req, res) => {
    // Validate dữ liệu đầu vào
    const { error } = forgotPasswordValidator.validate(req.query);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Gọi service để xử lý xác thực email
        const result = await authService.verifyEmail(req.query.token);
        res.json(result);  // Trả về kết quả xác thực email
    } catch (err) {
        res.status(500).json({ message: err.message });  // Xử lý lỗi server
    }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;  // Lấy ID người dùng từ req.user
        if (!userId) {
            return res.status(400).json({ message: 'Không tìm thấy thông tin người dùng' });
        }

        // Gọi service để thay đổi mật khẩu
        const result = await authService.changePassword(userId, oldPassword, newPassword);
        res.json(result);  // Trả về kết quả thay đổi mật khẩu
    } catch (err) {
        res.status(500).json({ message: err.message });  // Xử lý lỗi server
    }
};
