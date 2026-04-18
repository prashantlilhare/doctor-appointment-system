const Feedback = require('../models/Feedback');

const createFeedback = async (req, res) => {
  try {
    const { name, message, rating } = req.body;
    const feedback = await Feedback.create({ name, message, rating });
    res.status(201).json({ message: 'Feedback submitted!', feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllFeedbackAdmin = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback approved', feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createFeedback, getAllFeedback, getAllFeedbackAdmin, approveFeedback };
