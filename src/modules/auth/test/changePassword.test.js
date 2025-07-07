const request = require('supertest');
const app = require('../../../app.js'); // Đường dẫn tới app.js hoặc file khởi tạo server
const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');

describe('Test change-password flow', () => {
  let token;
  let userId;
  const userEmail = 'testuser@example.com';
  const userPassword = 'OldPassword123!';
  const newPassword = 'NewPassword123!';

  beforeAll(async () => {
    // Tạo user test hoặc lấy user test có sẵn
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const user = await UserRepository.createUser({
      email: userEmail,
      password: hashedPassword,
      name: 'Test User',
    });
    userId = user._id;

    // Đăng nhập để lấy token
    const res = await request(app)
      .post('/auth/login')
      .send({ email: userEmail, password: userPassword });
    token = res.body.token;
  });

  afterAll(async () => {
    // Xóa user test sau khi test xong
    await UserRepository.deleteUser(userId);
  });

  test('Change password with correct old password', async () => {
    const res = await request(app)
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: userPassword,
        newPassword: newPassword,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Mật khẩu đã được thay đổi thành công');
  });

  test('Change password with incorrect old password', async () => {
    const res = await request(app)
      .put('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'WrongOldPassword',
        newPassword: newPassword,
      });
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Mật khẩu cũ không chính xác');
  });

  test('Change password without authentication', async () => {
    const res = await request(app)
      .put('/auth/change-password')
      .send({
        oldPassword: userPassword,
        newPassword: newPassword,
      });
    expect(res.statusCode).toBe(401);
  });
});
