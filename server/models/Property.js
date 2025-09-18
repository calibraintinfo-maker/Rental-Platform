const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Property Rentals', 'Commercial', 'Land', 'Parking', 'Event']
  },
  subtype: {
    type: String,
    required: function() {
      return this.category !== 'Event';
    }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  rentType: [{
    type: String,
    enum: ['monthly', 'yearly', 'hourly'],
    required: true
  }],
  address: {
    street: String,
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    }
  },
  contact: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String, // Base64 or URL
    required: true
  }],
  // Backward compatibility - keep image field but make it optional
  image: {
    type: String, // Base64 or URL
    required: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  availability: {
    type: Boolean,
    default: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationLog: [{
    status: String,
    date: Date,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
  }],
  ownerProof: {
    type: String // base64 or URL (PDF/image)
  },
  propertyProof: {
    type: String // base64 or URL (PDF/image)
  }
}, {
  timestamps: true
});

// Index for search functionality
propertySchema.index({ 
  category: 1, 
  'address.city': 1, 
  'address.state': 1, 
  price: 1,
  isDisabled: 1
});

// Category-specific validation
propertySchema.pre('save', function(next) {
  switch(this.category) {
    case 'Property Rentals':
      if (!['monthly', 'yearly'].some(type => this.rentType.includes(type))) {
        return next(new Error('Property Rentals must have monthly or yearly rent type'));
      }
      break;
    case 'Commercial':
      if (!['monthly', 'yearly'].some(type => this.rentType.includes(type))) {
        return next(new Error('Commercial properties must have monthly or yearly rent type'));
      }
      break;
    case 'Land':
      if (!this.rentType.includes('yearly')) {
        return next(new Error('Land must have yearly rent type'));
      }
      break;
    case 'Parking':
      if (!this.rentType.includes('monthly')) {
        return next(new Error('Parking must have monthly rent type'));
      }
      break;
    case 'Event':
      if (!this.rentType.includes('hourly')) {
        return next(new Error('Event venues must have hourly rent type'));
      }
      break;
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
