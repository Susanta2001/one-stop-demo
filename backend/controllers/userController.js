exports.getNotifications = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('notifications');
      res.json(user.notifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.markAsRead = async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $set: { 'notifications.$[].read': true }
      });
      res.json({ message: 'All notifications marked as read' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
