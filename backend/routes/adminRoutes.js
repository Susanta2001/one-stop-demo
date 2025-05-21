const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/stats', protect, isAdmin, getDashboardStats);

module.exports = router;
