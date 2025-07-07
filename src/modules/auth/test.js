// test.js
const mongoose = require('mongoose');
const UserRepository = require('./modules/auth/repositories/user.repository');

async function test() {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect('mongodb+srv://thanhlh:zsJU9LzKF9jPLdC7@cluster0.jqhi2qm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    // Tạo người dùng mới
    const newUser = await UserRepository.createUser({ email: 'test@example.com', password: '123456', name: 'John Doe' });
    console.log('User created:', newUser);

    // Tìm người dùng theo email
    const user = await UserRepository.findByEmail('test@example.com');
    console.log('User found:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

test();
