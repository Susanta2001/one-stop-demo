const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: String,
  role: { 
    type: String, 
    enum: ['buyer', 'owner', 'admin'], 
    default: 'buyer' },
  contact: String,
  notifications: [
    {
      type: {
        type: String, // e.g. "property-approved"
      },
      message: String,
      read: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
