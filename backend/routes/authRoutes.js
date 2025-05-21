const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile  } = require('../controllers/authController');
const { getNotifications, markAsRead } = require('../controllers/userController');
const { getDashboardStats } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markAsRead);
router.get('/stats', protect, isAdmin, getDashboardStats);
module.exports = router;
