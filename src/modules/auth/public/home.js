const authSection = document.getElementById('authSection');
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (token && user) {
  authSection.innerHTML = `
    👋 Xin chào, <strong>${user.name || user.email}</strong>
    <button onclick="logout()">Logout</button>
  `;
} else {
  authSection.innerHTML = `
    <button onclick="window.location.href='/auth-public/login.html'">Login</button>
  `;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  location.reload();
}
