const Appointment = require('../models/Appointment');

// POST /api/appointments/create
const createAppointment = async (req, res, next) => {
  try {
    const { name, phone, symptoms, date, condition, address, location } = req.body;

    if (!name || !phone || !symptoms || !date || !address) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number. Must be exactly 10 digits.' });
    }

    const selectedDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (selectedDate < now) {
      return res.status(400).json({ message: 'Cannot book appointments for past dates.' });
    }

    // Check duplicate time slot (same date, same phone)
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await Appointment.findOne({
      phone,
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $nin: ['Rejected'] }
    });
    if (existing) {
      return res.status(400).json({ message: 'You already have an appointment on this date.' });
    }

    const appointment = await Appointment.create({ name, phone, symptoms, date, condition, address, location });
    res.status(201).json({ message: 'Appointment booked successfully!', appointment });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/track/:phone
const trackAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ phone: req.params.phone }).sort({ createdAt: 1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/all
const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: 1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/appointments/update/:id
const updateAppointment = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Status updated', appointment });
  } catch (err) {
    next(err);
  }
};

module.exports = { createAppointment, trackAppointments, getAllAppointments, updateAppointment };
