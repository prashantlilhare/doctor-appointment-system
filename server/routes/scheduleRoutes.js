const express = require("express");
const Schedule = require("../models/Schedule");

const router = express.Router();

/* GET ALL SCHEDULE */
router.get("/", async (req, res) => {
  try {
    const data = await Schedule.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch schedule",
      error: err.message,
    });
  }
});

/* PATCH (CREATE OR UPDATE DAY) */
router.patch("/:day", async (req, res) => {
  try {
    const { day } = req.params;
    const { isAvailable, startTime, endTime } = req.body;

    if (!day) {
      return res.status(400).json({ message: "Day is required" });
    }

    const updated = await Schedule.findOneAndUpdate(
      { day },
      {
        $set: {
          day,
          isAvailable,
          startTime,
          endTime,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Schedule update failed",
      error: err.message,
    });
  }
});

module.exports = router;