const Property = require('../models/Property');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });

    const totalUsers = await User.countDocuments();

    res.json({
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      totalUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
