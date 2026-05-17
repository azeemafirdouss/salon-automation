const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  durationMinutes: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
