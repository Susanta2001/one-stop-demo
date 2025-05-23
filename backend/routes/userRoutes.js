const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getNotifications,
  markAsRead
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Admin-only route
router.get('/', protect, isAdmin, getAllUsers);

// Authenticated user routes
router.get('/notifications', protect, getNotifications);
router.put('/notifications/mark-as-read', protect, markAsRead);

module.exports = router;
