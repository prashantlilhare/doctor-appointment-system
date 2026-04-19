import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      unique: true, // Monday, Tuesday etc ek hi baar ho
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    startTime: {
      type: String,
      default: "09:00",
    },
    endTime: {
      type: String,
      default: "18:00",
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
