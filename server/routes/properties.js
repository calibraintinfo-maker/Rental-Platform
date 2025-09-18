// Get booked date ranges for a property
// (Booking require and endpoint will be placed after router is declared)
const express = require('express');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get booked date ranges for a property
router.get('/:id/booked-dates', async (req, res) => {
  try {
    const bookings = await Booking.find({
      propertyId: req.params.id,
      status: { $in: ['active', 'approved'] }
    }, 'fromDate toDate');
    const ranges = bookings.map(b => ({ from: b.fromDate, to: b.toDate }));
    res.json({ success: true, data: ranges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all properties with filters (exclude user's own properties if authenticated)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      city,
      state,
      fromDate,
      toDate,
      page = 1,
      limit = 12
    } = req.query;

    // Build filter query
    const filter = { isDisabled: false };

    // Exclude user's own properties if authenticated
    if (req.userId) {
      filter.ownerId = { $ne: req.userId };
    }

    if (category) filter.category = category;
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (state) filter['address.state'] = new RegExp(state, 'i');
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Only show verified properties to non-owners/non-admins
    let user = null;
    if (req.userId) {
      const User = require('../models/User');
      user = await User.findById(req.userId);
    }
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      filter.verificationStatus = 'verified';
    }

    // Get properties
    let properties = await Property.find(filter)
      .populate('ownerId', 'name email contact')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Filter by availability if date range is provided
    if (fromDate && toDate) {
      const availableProperties = [];
      for (const property of properties) {
        const hasConflict = await Booking.checkConflict(
          property._id,
          new Date(fromDate),
          new Date(toDate)
        );
        if (!hasConflict) {
          availableProperties.push(property);
        }
      }
      properties = availableProperties;
    }

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error while fetching properties' });
  }
});

// Get featured properties (first 6, exclude user's own if authenticated)
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const filter = { isDisabled: false };
    
    // Exclude user's own properties if authenticated
    if (req.userId) {
      filter.ownerId = { $ne: req.userId };
    }

    const properties = await Property.find(filter)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(properties);
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({ message: 'Server error while fetching featured properties' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'name email contact');

    if (!property || property.isDisabled) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error while fetching property' });
  }
});

// Create new property (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      category,
      subtype,
      title,
      description,
      price,
      size,
      rentType,
      address,
      contact,
      images,
      image // Keep for backward compatibility
    } = req.body;

    // Handle both new images array and old image field
    const propertyImages = images && images.length > 0 ? images : (image ? [image] : []);

    // Validate required fields
    if (!category || !title || !description || !price || !size || !rentType || !address || !contact || propertyImages.length === 0) {
      return res.status(400).json({ message: 'All fields including at least one image are required' });
    }

    // Validate images array
    if (propertyImages.length > 5) {
      return res.status(400).json({ message: 'Maximum 5 images allowed' });
    }

    // Create new property
    const property = new Property({
      ownerId: req.userId,
      category,
      subtype,
      title,
      description,
      price: Number(price),
      size,
      rentType: Array.isArray(rentType) ? rentType : [rentType],
      address,
      contact,
      images: propertyImages,
      image: propertyImages[0], // Set first image as main image for backward compatibility
      ownerProof: req.body.ownerProof,
      propertyProof: req.body.propertyProof
    });

    await property.save();
    await property.populate('ownerId', 'name email');


    // Notify all admins about the new property
    const User = require('../models/User');
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      userId: admin._id,
      type: 'property_creation',
      message: `New property "${property.title}" added by ${property.ownerId.name} pending verification.`
    }));
    if (notifications.length) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      message: 'Property added successfully',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    if (error.message.includes('rent type')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating property' });
  }
});

// Get user's properties (protected)
router.get('/user/my-properties', authenticateToken, async (req, res) => {
  try {
    let filter = { ownerId: req.userId };
    if (!req.query.all) {
      filter.verificationStatus = 'verified';
    }
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({ message: 'Server error while fetching user properties' });
  }
});

// Update property (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      ownerId: req.userId 
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    // Update property fields
    Object.assign(property, req.body);
    
    if (req.body.rentType) {
      property.rentType = Array.isArray(req.body.rentType) ? req.body.rentType : [req.body.rentType];
    }

    await property.save();
    await property.populate('ownerId', 'name email');

    res.json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    console.error('Update property error:', error);
    if (error.message.includes('rent type')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating property' });
  }
});

// Disable property (protected)
router.patch('/:id/disable', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      ownerId: req.userId 
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    property.isDisabled = true;
    await property.save();

    res.json({ message: 'Property disabled successfully' });
  } catch (error) {
    console.error('Disable property error:', error);
    res.status(500).json({ message: 'Server error while disabling property' });
  }
});

// Enable property (protected)
router.patch('/:id/enable', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      ownerId: req.userId 
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    property.isDisabled = false;
    await property.save();

    res.json({ message: 'Property enabled successfully' });
  } catch (error) {
    console.error('Enable property error:', error);
    res.status(500).json({ message: 'Server error while enabling property' });
  }
});

// Get property bookings (protected)
router.get('/:id/bookings', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      ownerId: req.userId 
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    const bookings = await Booking.find({ propertyId: req.params.id })
      .populate('userId', 'name email contact')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get property bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching property bookings' });
  }
});

module.exports = router;
