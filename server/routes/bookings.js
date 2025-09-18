
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

// End (close) booking early (property owner only)
router.patch('/:id/end', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Only property owner can end booking
    if (booking.propertyId.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only property owner can end bookings' });
    }
    if (booking.status !== 'active' && booking.status !== 'approved') {
      return res.status(400).json({ message: 'Only active or approved bookings can be ended' });
    }
    booking.status = 'ended';
    await booking.save();
    // Notify user that booking was ended by owner
    await Notification.create({
      userId: booking.userId,
      type: 'booking',
      message: `Your booking for ${booking.propertyId.title} was ended by the owner.`,
    });
    res.json({ message: 'Booking ended successfully', booking });
  } catch (error) {
    console.error('End booking error:', error);
    res.status(500).json({ message: 'Server error while ending booking' });
  }
});


// Approve booking (property owner only)
router.patch('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Only property owner can approve
    if (booking.propertyId.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only property owner can approve bookings' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be approved' });
    }
    booking.status = 'approved';
    await booking.save();
    // Notify user that booking was approved
    await Notification.create({
      userId: booking.userId,
      type: 'booking',
      message: `Your booking for ${booking.propertyId.title} was approved by the owner.`,
    });
    res.json({ message: 'Booking approved', booking });
  } catch (error) {
    console.error('Approve booking error:', error);
    res.status(500).json({ message: 'Server error while approving booking' });
  }
});

// Reject booking (property owner only)
router.patch('/:id/reject', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('propertyId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    // Only property owner can reject
    if (booking.propertyId.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only property owner can reject bookings' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be rejected' });
    }
    booking.status = 'rejected';
    await booking.save();
    // Notify user that booking was rejected
    await Notification.create({
      userId: booking.userId,
      type: 'booking',
      message: `Your booking for ${booking.propertyId.title} was rejected by the owner.`,
    });
    res.json({ message: 'Booking rejected', booking });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ message: 'Server error while rejecting booking' });
  }
});

// Create new booking (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      propertyId,
      fromDate,
      toDate,
      bookingType,
      notes
    } = req.body;

    // Validate required fields
    if (!propertyId || !fromDate || !toDate || !bookingType) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Check if user profile is complete
    const user = await User.findById(req.userId);
    if (!user.checkProfileComplete()) {
      return res.status(400).json({ 
        message: 'Please complete your profile before making a booking',
        redirectTo: '/profile'
      });
    }

    // Check if property exists and is available
    const property = await Property.findById(propertyId);
    if (!property || property.isDisabled) {
      return res.status(404).json({ message: 'Property not found or not available' });
    }

    // Validate booking type matches property rent types
    if (!property.rentType.includes(bookingType)) {
      return res.status(400).json({ 
        message: `This property does not support ${bookingType} bookings` 
      });
    }

    // Convert dates
    const from = new Date(fromDate);
    const to = new Date(toDate);

    // Check for booking conflicts
    const hasConflict = await Booking.checkConflict(propertyId, from, to);
    if (hasConflict) {
      return res.status(400).json({ 
        message: 'Property is not available for the selected dates' 
      });
    }

    // Calculate total price based on selected range
    let totalPrice = property.price;
    const timeDiff = to.getTime() - from.getTime();
    switch (bookingType) {
      case 'hourly': {
        const hours = Math.ceil(timeDiff / (1000 * 60 * 60));
        totalPrice = property.price * hours;
        break;
      }
      case 'monthly': {
        // Calculate number of months between from and to
        const fromMonth = from.getMonth() + from.getFullYear() * 12;
        const toMonth = to.getMonth() + to.getFullYear() * 12;
        const months = Math.max(1, toMonth - fromMonth);
        totalPrice = property.price * months;
        break;
      }
      case 'yearly': {
        const years = Math.max(1, to.getFullYear() - from.getFullYear());
        totalPrice = property.price * years;
        break;
      }
    }

    // Create booking
    const booking = new Booking({
      userId: req.userId,
      propertyId,
      fromDate: from,
      toDate: to,
      totalPrice,
      bookingType,
      notes
    });

    await booking.save();
    await booking.populate([
      { path: 'propertyId', select: 'title category address image ownerId' },
      { path: 'userId', select: 'name email contact' }
    ]);
    // Notify property owner of new booking
    if (booking.propertyId.ownerId) {
      await Notification.create({
        userId: booking.propertyId.ownerId,
        type: 'booking',
        message: `New booking request for ${booking.propertyId.title} by ${user.name}.`,
      });
    }
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
});

// Get user's bookings (protected)
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('propertyId', 'title category address image')
      .sort({ createdAt: -1 });

    // Update status for expired bookings
    for (const booking of bookings) {
      if (booking.updateStatus() === 'expired' && booking.isModified('status')) {
        await booking.save();
      }
    }

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
});

// Get single booking (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Find booking and populate property and user info, including all needed fields
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'propertyId',
        select: 'title category address image contact ownerId',
        populate: { path: 'ownerId', select: 'name email contact' }
      })
      .populate({
        path: 'userId',
        select: 'name email contact age'
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Allow access if requester is booking user or property owner
    const isBookingUser = booking.userId._id.toString() === req.userId;
    const isPropertyOwner = booking.propertyId.ownerId && booking.propertyId.ownerId._id
      ? booking.propertyId.ownerId._id.toString() === req.userId
      : booking.propertyId.ownerId.toString() === req.userId;
    if (!isBookingUser && !isPropertyOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update status if needed
    booking.updateStatus();
    if (booking.isModified('status')) {
      await booking.save();
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error while fetching booking' });
  }
});

// Cancel booking (protected)
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id,
      userId: req.userId 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({ message: 'Can only cancel active bookings' });
    }

    // Check if booking can be cancelled (e.g., at least 24 hours before start date)
    const now = new Date();
    const timeDiff = booking.fromDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24) {
      return res.status(400).json({ 
        message: 'Bookings can only be cancelled at least 24 hours before the start date' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
});

// Check property availability
router.post('/check-availability', async (req, res) => {
  try {
    const { propertyId, fromDate, toDate } = req.body;

    if (!propertyId || !fromDate || !toDate) {
      return res.status(400).json({ message: 'Property ID and date range are required' });
    }

    const hasConflict = await Booking.checkConflict(
      propertyId,
      new Date(fromDate),
      new Date(toDate)
    );

    res.json({ 
      available: !hasConflict,
      message: hasConflict ? 'Property is not available for selected dates' : 'Property is available'
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Server error while checking availability' });
  }
});

module.exports = router;
