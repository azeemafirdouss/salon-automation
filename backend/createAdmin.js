const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/salon_db';
    await mongoose.connect(URI);

    const email = 'admin@lumieresalon.com';
    const password = 'password123';

    // Check if exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin'
    });

    console.log('Admin user successfully created!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
