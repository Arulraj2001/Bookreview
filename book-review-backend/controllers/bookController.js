const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const { bookValidationSchema } = require('../utils/validationSchemas');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { author: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const genreFilter = req.query.genre ? { genre: req.query.genre } : {};
  
  const count = await Book.countDocuments({ ...keyword, ...genreFilter });
  const books = await Book.find({ ...keyword, ...genreFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ books, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('user', 'name email');

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const { error } = bookValidationSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const book = new Book({
    user: req.user._id,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    genre: req.body.genre,
    coverImage: req.body.coverImage,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Get all genres
// @route   GET /api/books/genres
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
    const genres = await Book.distinct('genre');
    res.json(genres);
  });

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
    const { error } = bookValidationSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
  
    const book = await Book.findById(req.params.id);
  
    if (book) {
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.description = req.body.description || book.description;
      book.genre = req.body.genre || book.genre;
      book.coverImage = req.body.coverImage || book.coverImage;
  
      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
  });
  
  // @desc    Delete a book
  // @route   DELETE /api/books/:id
  // @access  Private/Admin
  const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
  
    if (book) {
      await book.remove();
      res.json({ message: 'Book removed' });
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
  });

  module.exports = {
    getBooks,
    getBookById,
    createBook,
    getGenres, // ✅ this line is needed
    updateBook, // optional if used elsewhere
    deleteBook  // optional if used elsewhere
  };
  