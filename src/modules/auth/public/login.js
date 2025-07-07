async function checkValidTokenBeforeLoginPage() {
  const token = localStorage.getItem('token');

  if (!token) return;

  try {
    const res = await fetch(`/api/auth/verify-email?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      // ✅ Token hợp lệ → redirect sang home
      window.location.href = '/auth-public/home.html';
    } else {
      // ❌ Token không hợp lệ → xóa localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (err) {
    console.error('Lỗi xác minh token:', err);
    // Trong trường hợp lỗi mạng hoặc API không phản hồi, không redirect
  }
}

// Gọi ngay khi load login page
checkValidTokenBeforeLoginPage();

// Tiếp tục xử lý form login như cũ
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = '/auth-public/login-success.html';
    } else {
      alert(data.message || 'Đăng nhập thất bại!');
    }
  } catch (err) {
    alert('Lỗi kết nối tới máy chủ.');
    console.error(err);
  }
});
