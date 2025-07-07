// Kiểm tra nếu chưa đăng nhập thì redirect về login
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/auth-public/login.html';
}

// Đếm ngược chuyển hướng về home
let count = 3;
const timer = document.getElementById('timer');

const interval = setInterval(() => {
  count--;
  timer.textContent = count;
  if (count === 0) {
    clearInterval(interval);
    window.location.href = '/auth-public/home.html';
  }
}, 1000);
