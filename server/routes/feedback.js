const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback, getAllFeedbackAdmin, approveFeedback, deleteFeedback } = require('../controllers/feedbackController');
const auth = require('../config/authMiddleware');

router.post('/create', createFeedback);
router.get('/all', getAllFeedback);
router.get('/admin/all', auth, getAllFeedbackAdmin);
router.patch('/approve/:id', auth, approveFeedback);
router.delete('/:id', auth, deleteFeedback);

module.exports = router;
