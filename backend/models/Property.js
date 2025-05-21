const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    }
  },
  type: {
    type: String,
    enum: ['rent', 'sale'],
    required: true,
  },
  amenities: [String],
  images: [String], // Cloudinary image URLs
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
