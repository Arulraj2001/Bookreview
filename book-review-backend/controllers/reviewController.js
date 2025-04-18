const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { reviewValidationSchema } = require('../utils/validationSchemas');

// @desc    Get reviews for a book
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const bookId = req.query.bookId;
  if (!bookId) {
    res.status(400);
    throw new Error('Book ID is required');
  }

  const reviews = await Review.find({ book: bookId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const book = await Book.findById(req.body.book);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Check if user already reviewed this book
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    book: req.body.book,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this book');
  }

  const review = new Review({
    user: req.user._id,
    book: req.body.book,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  const createdReview = await review.save();

  // Update book rating
  const reviews = await Review.find({ book: book._id });
  book.averageRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  book.numberOfReviews = reviews.length;
  await book.save();

  res.status(201).json(createdReview);
});

module.exports = {
  getReviews,
  createReview,
};