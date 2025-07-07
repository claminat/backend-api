
const path = require('path');


exports.getSigninPage = (req, res) => {
  const viewPath = path.join(__dirname, '../views/sign-in.ejs');

  res.renderPage(viewPath, {
    title: 'Đăng nhập'
  });
};

exports.getSignupPage = (req, res) => {
  const viewPath = path.join(__dirname, '../views/sign-up.ejs');
  res.renderPage(viewPath, {
    title: 'Đăng ký'
  });
};




