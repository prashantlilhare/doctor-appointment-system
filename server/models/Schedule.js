const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  day: String,
  isAvailable: Boolean,
  startTime: String,
  endTime: String,
});

scheduleSchema.index({ day: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);