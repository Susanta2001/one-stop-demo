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
} = require('../controllers/propertyController');

const { protect, isOwner, isAdmin } = require('../middlewares/authMiddleware');

const { adminGetAllProperties } = require('../controllers/propertyController');

// Public


router.get('/search', searchProperties);

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Owner-only
router.post('/', protect, isOwner, createProperty);
router.put('/:id', protect, isOwner, updateProperty);
router.delete('/:id', protect, isOwner, deleteProperty);

// Admin-only
router.get('/admin', protect, isAdmin, adminGetAllProperties);


router.put('/:id/approve', protect, isAdmin, approveProperty);
router.put('/:id/reject', protect, isAdmin, rejectProperty);

module.exports = router;
