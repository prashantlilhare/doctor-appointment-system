const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://doctor-appointment-system-zeta-olive.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/feedback', require('./routes/feedback'));

module.exports = app;
