const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role, contact } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role, contact });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
    try {
      // req.user is set by protect middleware
      const user = req.user;
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateUserProfile = async (req, res) => {
    try {
      const user = req.user;
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const { name, contact, password } = req.body;
  
      if (name) user.name = name;
      if (contact) user.contact = contact;
      if (password) {
        const bcrypt = require('bcryptjs');
        user.password = await bcrypt.hash(password, 10);
      }
  
      await user.save();
  
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contact: user.contact,
        token: generateToken(user._id), // optional: new token if password changed
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  