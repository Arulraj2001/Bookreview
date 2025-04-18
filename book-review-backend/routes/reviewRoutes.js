const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getReviews, createReview } = require('../controllers/reviewController');

const router = express.Router();

router.route('/').get(getReviews).post(protect, createReview);

module.exports = router;