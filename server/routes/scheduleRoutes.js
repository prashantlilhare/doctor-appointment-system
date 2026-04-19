import express from "express";
import Schedule from "../models/Schedule.js";

const router = express.Router();


// 🔵 GET ALL SCHEDULES
router.get("/", async (req, res) => {
  try {
    const schedule = await Schedule.find().sort({ createdAt: 1 });
    res.status(200).json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// 🟢 UPDATE / CREATE SINGLE DAY SCHEDULE
router.patch("/:day", async (req, res) => {
  try {
    const { day } = req.params;

    const updated = await Schedule.findOneAndUpdate(
      { day },
      { $set: req.body },
      { new: true, upsert: true } // ⚠️ important: agar day nahi hai to create kar dega
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;