const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  symptoms: { type: String, required: true },
  date: { type: Date, required: true },
  visitType: { type: String, enum: ['Clinic Visit', 'Home Visit'], default: 'Clinic Visit' },
  address: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' }
}, { timestamps: true });

// Optimize frequent queries
appointmentSchema.index({ phone: 1 });
appointmentSchema.index({ date: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
