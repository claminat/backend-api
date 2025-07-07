const express = require('express');
const path = require('path');

const router = express.Router();


router.get('/', (req, res) => {
const viewPath = path.join(__dirname, '../views/index.ejs');

  res.renderPage(viewPath, {
    title: 'Dashboard',
    description: 'Tổng quan hệ thống quản trị'
  });
});

module.exports = router;


