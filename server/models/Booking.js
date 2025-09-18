const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'rejected', 'expired', 'cancelled', 'ended'],
    default: 'pending'
  },
  paymentMode: {
    type: String,
    default: 'On Spot'
  },
  bookingType: {
    type: String,
    enum: ['monthly', 'yearly', 'hourly'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ 
  userId: 1, 
  propertyId: 1, 
  status: 1,
  fromDate: 1,
  toDate: 1
});

// Check for booking conflicts
bookingSchema.statics.checkConflict = async function(propertyId, fromDate, toDate, excludeBookingId = null) {
  const query = {
    propertyId,
    status: 'active',
    $or: [
      {
        fromDate: { $lte: fromDate },
        toDate: { $gte: fromDate }
      },
      {
        fromDate: { $lte: toDate },
        toDate: { $gte: toDate }
      },
      {
        fromDate: { $gte: fromDate },
        toDate: { $lte: toDate }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await this.findOne(query);
  return !!conflictingBooking;
};

// Auto-update status based on dates
bookingSchema.methods.updateStatus = function() {
  const now = new Date();
  if (this.toDate < now && this.status === 'active') {
    this.status = 'expired';
  }
  return this.status;
};

// Pre-save validation
bookingSchema.pre('save', function(next) {
  // Validate date range
  if (this.fromDate >= this.toDate) {
    return next(new Error('From date must be before to date'));
  }

  // Update status if needed
  this.updateStatus();
  
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
