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
} = require('../controllers/propertyController');

const { protect, isOwner, isAdmin } = require('../middlewares/authMiddleware');

const { adminGetAllProperties } = require('../controllers/propertyController');

// Admin-only
router.get('/admin', protect, isAdmin, adminGetAllProperties);
router.put('/:id/approve', protect, isAdmin, approveProperty);
router.put('/:id/reject', protect, isAdmin, rejectProperty);
router.delete('/:id/delete', protect, isAdmin, adminDeleteProperty);

// Public

router.get('/search', searchProperties);
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Owner-only
router.post('/', protect, isOwner, createProperty);
router.put('/:id', protect, isOwner, updateProperty);
router.delete('/:id', protect, isOwner, deleteProperty);

module.exports = router;
