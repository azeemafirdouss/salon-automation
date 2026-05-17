const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// Get all reviews (Public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('customer', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create review (Customer only)
router.post('/', protect, async (req, res) => {
  try {
    const { rating, text } = req.body;
    if (req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Only customers can leave reviews' });
    }

    const review = await Review.create({
      customer: req.user.id,
      rating,
      text
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
