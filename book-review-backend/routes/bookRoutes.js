const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getBooks,
  getBookById,
  createBook,
  getGenres, // ✅ Now imported
} = require('../controllers/bookController');

const router = express.Router();

router.route('/').get(getBooks).post(protect, admin, createBook);
router.route('/:id').get(getBookById);

router.get('/genres', getGenres); // ✅ This will now work

module.exports = router;
