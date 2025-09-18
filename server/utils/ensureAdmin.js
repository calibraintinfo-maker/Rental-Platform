const User = require('../models/User');

async function ensureAdmin() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin123';
  const adminName = 'Admin';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({
      email: adminEmail,
      password: adminPassword,
      name: adminName,
      role: 'admin',
      contact: '',
      address: '',
      city: '',
      state: '',
      pincode: '000000',
      profileComplete: true
    });
    await admin.save();
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

module.exports = ensureAdmin;
