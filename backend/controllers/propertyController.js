const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
  try {
    const property = new Property({ ...req.body, owner: req.user._id });
    const saved = await property.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  const { keyword, type, city, minPrice, maxPrice } = req.query;

  const filter = {
    status: 'approved',
  };

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { 'location.city': { $regex: keyword, $options: 'i' } },
      { 'location.state': { $regex: keyword, $options: 'i' } },
    ];
  }

  if (type) {
    filter.type = type; // 'rent' or 'sale'
  }

  if (city) {
    filter['location.city'] = { $regex: city, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  try {
    const properties = await Property.find(filter);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.json(property);
  } catch (err) {
    res.status(404).json({ message: 'Property not found' });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const User = require('../models/User'); // import if not already

exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = 'approved';
    await property.save();

    // Notify owner
    await User.findByIdAndUpdate(property.owner, {
      $push: {
        notifications: {
          type: 'property-approved',
          message: `Your property "${property.title}" has been approved.`,
        }
      }
    });

    res.json({ message: 'Property approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    property.status = 'rejected';
    await property.save();

    // Notify owner
    await User.findByIdAndUpdate(property.owner, {
      $push: {
        notifications: {
          type: 'property-rejected',
          message: `Your property "${property.title}" was rejected.`,
        }
      }
    });

    res.json({ message: 'Property rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminDeleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    await Property.findByIdAndDelete(req.params.id);

    // Notify owner
    await User.findByIdAndUpdate(property.owner, {
      $push: {
        notifications: {
          type: 'property-deleted',
          message: `Your property "${property.title}" has been deleted.`,
        }
      }
    });

    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchProperties = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Using case-insensitive regex to search multiple fields
    const regex = new RegExp(query, 'i');

    const properties = await Property.find({
      status: 'approved',
      $or: [
        { title: regex },
        { description: regex },
        { 'location.city': regex },
        { 'location.state': regex },
        { 'location.country': regex },
      ],
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminGetAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch properties', error: err.message });
  }
};

exports.getOwnerStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const totalProperties = await Property.countDocuments({ owner: ownerId });
    const approvedProperties = await Property.countDocuments({ owner: ownerId, status: 'approved' });
    const pendingProperties = await Property.countDocuments({ owner: ownerId, status: 'pending' });
    const rejectedProperties = await Property.countDocuments({ owner: ownerId, status: 'rejected' });

    res.status(200).json({
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
