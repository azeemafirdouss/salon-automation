const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, adminOrStaff } = require('../middleware/auth');

// Create new appointment (Customer)
router.post('/', protect, async (req, res) => {
  try {
    const { serviceId, date, timeSlot, notes } = req.body;
    const appointment = await Appointment.create({
      customer: req.user.id,
      service: serviceId,
      date,
      timeSlot,
      notes
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user appointments (Customer)
router.get('/my-appointments', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user.id }).populate('service').populate('staff', 'name');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all appointments (Admin/Staff)
router.get('/', protect, adminOrStaff, async (req, res) => {
  try {
    // Both admin and staff see all appointments
    const appointments = await Appointment.find({})
      .populate('service')
      .populate('customer', 'name email phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment status (Admin/Staff)
router.put('/:id/status', protect, adminOrStaff, async (req, res) => {
  try {
    const { status, staffId } = req.body;
    const updateData = { status };
    if (staffId) updateData.staff = staffId;

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // Mock Notification
    console.log(`[MOCK NOTIFICATION] Email/SMS sent to customer for appointment ${appointment._id}: Status updated to ${status}`);

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment (Customer only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    
    // Ensure the customer owns this appointment
    if (appointment.customer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Only allow cancelling if pending
    if (appointment.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending appointments' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
