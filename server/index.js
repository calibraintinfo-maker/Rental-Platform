const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'SpaceLink API is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spacelink', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  const ensureAdmin = require('./utils/ensureAdmin');
  await ensureAdmin();
})
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
