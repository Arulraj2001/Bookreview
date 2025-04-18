const mongoose = require('mongoose');

// Define the schema for the Book model
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Define text index for title and author for search functionality
bookSchema.index({ title: 'text', author: 'text' });

// Define single field index for genre to optimize queries and sorting
bookSchema.index({ genre: 1 });

// Export the model
module.exports = mongoose.model('Book', bookSchema);
