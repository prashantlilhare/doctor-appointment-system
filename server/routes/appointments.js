const express = require('express');
const router = express.Router();
const { createAppointment, trackAppointments, getAllAppointments, updateAppointment } = require('../controllers/appointmentController');
const auth = require('../config/authMiddleware');

router.post('/create', createAppointment);
router.get('/track/:phone', trackAppointments);
router.get('/all', auth, getAllAppointments);
router.patch('/update/:id', auth, updateAppointment);
router.get("/", async (req, res) => {
  res.send("Appointments API working ✅");
});

module.exports = router;
