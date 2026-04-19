const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: String,
  isAvailable: Boolean,
  startTime: String,
  endTime: String,
});

module.exports = mongoose.model("Schedule", scheduleSchema);