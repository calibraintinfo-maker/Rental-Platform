const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin
function requireAdmin(req, res, next) {
  if (!req.userId) return res.status(401).json({ message: 'Unauthorized' });
  User.findById(req.userId).then(user => {
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
}

// Dashboard metrics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Users
    const totalUsers = await User.countDocuments();
    const owners = await User.countDocuments({ role: 'owner' });
    const renters = await User.countDocuments({ role: 'user' });
    const suspended = await User.countDocuments({ suspended: true });
    // Properties
    const totalProperties = await Property.countDocuments();
    const verified = await Property.countDocuments({ verificationStatus: 'verified' });
    const pending = await Property.countDocuments({ verificationStatus: 'pending' });
    const rejected = await Property.countDocuments({ verificationStatus: 'rejected' });
    const byCategory = await Property.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    // Bookings
    const totalBookings = await Booking.countDocuments();
    const ongoingBookings = await Booking.countDocuments({ status: { $in: ['active', 'approved'] } });
    const completedBookings = await Booking.countDocuments({ status: 'ended' });
    const canceledBookings = await Booking.countDocuments({ status: { $in: ['rejected', 'cancelled', 'expired'] } });
    // Recent logs
    const recentProperties = await Property.find().sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      success: true,
      data: {
        users: { total: totalUsers, owners, renters, suspended },
        properties: { total: totalProperties, verified, pending, rejected, byCategory },
        bookings: { total: totalBookings, ongoing: ongoingBookings, completed: completedBookings, canceled: canceledBookings },
        recent: { properties: recentProperties, users: recentUsers, bookings: recentBookings }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List properties pending verification
router.get('/properties/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const properties = await Property.find({ verificationStatus: 'pending' }).populate('ownerId');
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify or reject property
router.patch('/properties/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, note } = req.body; // status: 'verified' or 'rejected'
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    property.verificationStatus = status;
    property.verificationLog.push({ status, date: new Date(), adminId: req.userId, note });
    await property.save();

    // Notify property owner
    await Notification.create({
      userId: property.ownerId,
      type: 'property_verification',
      message:
        status === 'verified'
          ? `Your property "${property.title}" has been verified.`
          : `Your property "${property.title}" has been rejected. Note: ${note}`
    });

    res.json({ success: true, message: `Property ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
