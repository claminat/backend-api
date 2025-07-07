const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.renderPage('dashboard/views/index', {
    title: 'Dashboard',
    description: 'Tổng quan hệ thống quản trị'
  });
});

module.exports = router;