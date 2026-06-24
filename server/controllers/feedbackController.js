const Feedback = require('../models/Feedback');

const createFeedback = async (req, res, next) => {
  try {
    const { name, message, rating } = req.body;

    if (!name || !message || !rating) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const feedback = await Feedback.create({ name, message, rating });
    res.status(201).json({ message: 'Feedback submitted!', feedback });
  } catch (err) {
    next(err);
  }
};

const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    next(err);
  }
};

const getAllFeedbackAdmin = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    next(err);
  }
};

const approveFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback approved', feedback });
  } catch (err) {
    next(err);
  }
};

module.exports = { createFeedback, getAllFeedback, getAllFeedbackAdmin, approveFeedback };
