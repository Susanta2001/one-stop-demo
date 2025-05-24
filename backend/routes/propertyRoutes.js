const express = require('express');
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  approveProperty,
  rejectProperty,
  searchProperties,
  adminDeleteProperty,
  adminGetAllProperties,
  getOwnerProperties, 
  getOwnerStats,
} = require('../controllers/propertyController');

const { protect, isOwner, isAdmin } = require('../middlewares/authMiddleware');

// Admin-only
router.get('/admin', protect, isAdmin, adminGetAllProperties);
router.put('/:id/approve', protect, isAdmin, approveProperty);
router.put('/:id/reject', protect, isAdmin, rejectProperty);
router.delete('/:id/delete', protect, isAdmin, adminDeleteProperty);

// Owner-only (must come before "/:id")
router.get('/owner/stats', protect, isOwner, getOwnerStats);
router.get('/owner', protect, isOwner, getOwnerProperties);
router.post('/', protect, isOwner, createProperty);
router.put('/:id', protect, isOwner, updateProperty);
router.delete('/:id', protect, isOwner, deleteProperty);

// Public
router.get('/search', searchProperties);
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);



module.exports = router;
