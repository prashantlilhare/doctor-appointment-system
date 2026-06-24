const express = require("express");
const Schedule = require("../models/Schedule");
const auth = require('../config/authMiddleware');

const router = express.Router();

/* GET ALL SCHEDULE (Public) */
router.get("/", async (req, res, next) => {
  try {
    const data = await Schedule.find();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

/* PATCH (CREATE OR UPDATE DAY) (Protected) */
router.patch("/:day", auth, async (req, res, next) => {
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
    next(err);
  }
});

module.exports = router;