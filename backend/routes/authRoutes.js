const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { protect, adminOnly } = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role: role || 'customer', phone
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Current User
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Forgot Password (Mock)
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Configure Nodemailer if credentials exist, otherwise mock
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"Lumière Salon" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Lumière Salon - Password Reset Code',
        html: `
          <h3>Hello ${user.name},</h3>
          <p>You requested a password reset. Here is your 6-digit authorization code:</p>
          <h2 style="background: #f3f4f6; padding: 10px; display: inline-block; letter-spacing: 2px;">${otp}</h2>
          <p>Please enter this code on the website to reset your password. It expires in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`[REAL EMAIL] Password reset OTP sent to ${user.email}`);
      return res.json({ message: 'Password reset code sent to your email!' });
    } else {
      // Fallback if no email configured
      console.log(`[MOCK EMAIL] Password reset OTP for ${user.email} is: ${otp}`);
      return res.json({ message: 'OTP generated in server console! (Configure EMAIL_USER to send real emails)' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset Password using OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    // Hash the provided OTP to compare with DB
    const resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
    
    const user = await User.findOne({
      email,
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Staff List (Admin Only)
router.get('/staff', protect, adminOnly, async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('-password');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Staff (Admin Only)
router.post('/add-staff', protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role: 'staff', phone
    });

    res.status(201).json({ message: 'Staff member added successfully', user: { _id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove Staff (Admin Only)
router.delete('/staff/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'staff') return res.status(400).json({ message: 'User is not a staff member' });

    await user.deleteOne();
    res.json({ message: 'Staff member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Public Staff (For Home Page)
router.get('/public/staff', async (req, res) => {
  try {
    // Only return name, role, and maybe picture (using a generic one for now)
    const staff = await User.find({ role: 'staff' }).select('name role');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
