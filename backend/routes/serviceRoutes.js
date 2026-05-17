const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new service (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, durationMinutes, price, imageUrl } = req.body;
    const service = await Service.create({
      name, description, durationMinutes, price, imageUrl
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
