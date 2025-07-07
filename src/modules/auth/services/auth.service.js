// modules/auth/services/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user.repository');
const config = require('../../../shared/config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


class AuthService {
    /**
     * Đăng nhập người dùng
     * @param {string} email - Email người dùng
     * @param {string} password - Mật khẩu người dùng
     * @returns {Promise<Object>} - Token JWT và thông tin người dùng
     */
    async login(email, password) {
        try {
            // Tìm người dùng trong cơ sở dữ liệu
            const user = await UserRepository.findByEmail(email);
            if (!user) {
                throw new Error('Tài khoản không tồn tại');
            }

            // So sánh mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Mật khẩu không chính xác');
            }

            // Tạo token JWT
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                config.jwt.secret,
                { expiresIn: '1h' }
            );

            // Trả về token và thông tin người dùng
            return { token, user: { id: user._id, email: user.email } };
        } catch (error) {
            console.error('Error in login:', error);
            throw error;
        }
    }

    /**
     * Đăng ký người dùng mới
     * @param {Object} userData - Dữ liệu người dùng (email, password, name)
     * @returns {Promise<Object>} - Thông tin người dùng mới được tạo
     */
    async register(userData) {
        try {
            // Kiểm tra xem email đã tồn tại chưa
            const existingUser = await UserRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email đã tồn tại');
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Tạo người dùng mới
            const newUser = await UserRepository.createUser({
                email: userData.email,
                password: hashedPassword,
                name: userData.name,
            });

            // Trả về thông tin người dùng
            return { user: { id: newUser._id, email: newUser.email, name: newUser.name } };
        } catch (error) {
            console.error('Error in register:', error);
            throw error;
        }
    }

    /**
     * Đặt lại mật khẩu
     * @param {string} resetToken - Mã khôi phục mật khẩu
     * @param {string} newPassword - Mật khẩu mới
     * @returns {Promise<Object>} - Thông báo kết quả
     */
    // modules/auth/services/auth.service.js
    async resetPassword(resetToken, newPassword) {
        try {
            // Tìm người dùng qua reset token
            const user = await UserRepository.findByResetToken(resetToken);
            if (!user) {
                throw new Error('Mã khôi phục không hợp lệ');
            }

            // Kiểm tra xem token có hết hạn không
            if (Date.now() > user.resetTokenExpiration) {
                throw new Error('Mã khôi phục đã hết hạn');
            }

            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Cập nhật mật khẩu người dùng
            await UserRepository.updateUser(user._id, { password: hashedPassword, resetToken: null, resetTokenExpiration: null });

            return { message: 'Mật khẩu đã được thay đổi thành công' };
        } catch (error) {
            console.error('Lỗi trong việc reset mật khẩu:', error);
            throw error;
        }
    }



    /**
     * Xác thực email
     * @param {string} token - Mã xác thực email
     * @returns {Promise<Object>} - Thông báo kết quả
     */
    async verifyEmail(token) {
        try {
            // Xác thực token và lấy thông tin người dùng
            const decoded = jwt.verify(token, config.jwt.secret);

            // Tìm người dùng theo ID
            const user = await UserRepository.findById(decoded.userId);
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            // Cập nhật trạng thái người dùng
            await UserRepository.updateUser(user._id, { isVerified: true });

            // Trả về thông báo thành công
            return { message: 'Email đã được xác thực thành công' };
        } catch (error) {
            console.error('Error in verifyEmail:', error);
            throw error;
        }
    }

    /**
  * Quên mật khẩu
  * @param {string} email - Email người dùng
  * @returns {Promise<Object>} - Thông báo gửi mã khôi phục mật khẩu
  */
    async forgotPassword(email) {
        try {
            // Tìm người dùng qua email
            const user = await UserRepository.findByEmail(email);
            if (!user) {
                throw new Error('Email không tồn tại');
            }

            // Tạo reset token (có thể dùng JWT hoặc mã ngẫu nhiên)
            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenExpiration = Date.now() + 3600000; // Token hết hạn sau 1 giờ (3600000ms)

            // Lưu reset token và expiration vào cơ sở dữ liệu
            await UserRepository.updateUser(user._id, { resetToken, resetTokenExpiration });

            // Lấy thông tin email từ config
            const { service, user: emailUser, pass } = config.email;

            // Tạo transporter gửi email sử dụng thông tin từ config
            const transporter = nodemailer.createTransport({
                service: service,
                auth: {
                    user: emailUser,
                    pass: pass,
                },
            });

            const mailOptions = {
                from: emailUser,         // Gửi email từ địa chỉ này
                to: user.email,          // Địa chỉ email nhận
                subject: 'Password Reset Request',
                text: `Your password reset token is: ${resetToken}. This token will expire in 1 hour.`,
            };

            // Gửi email
            await transporter.sendMail(mailOptions);

            // Trả về thông báo thành công
            return { message: 'Mã khôi phục mật khẩu đã được gửi đến email của bạn.' };

        } catch (err) {
            console.error('Error in forgotPassword:', err);
            throw err;
        }
    }

    /**
   * Đổi mật khẩu
   * @param {string} userId - ID người dùng
   * @param {string} oldPassword - Mật khẩu cũ
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Promise<Object>} - Thông báo kết quả
   */
    async changePassword(userId, oldPassword, newPassword) {
        try {
            // Tìm người dùng bằng userId
            const user = await UserRepository.findById(userId);
            if (!user) {
                throw new Error('Người dùng không tồn tại');
            }

            // Kiểm tra mật khẩu cũ
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                throw new Error('Mật khẩu cũ không chính xác');
            }

            // Mã hóa mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Cập nhật mật khẩu mới
            await UserRepository.updateUser(user._id, { password: hashedPassword });

            // Trả về thông báo thành công
            return { message: 'Mật khẩu đã được thay đổi thành công' };
        } catch (error) {
            console.error('Error in changePassword:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();
