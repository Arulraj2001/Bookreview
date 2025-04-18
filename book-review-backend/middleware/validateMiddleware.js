const { bookValidationSchema, reviewValidationSchema } = require('../utils/validationSchemas');

const validateBook = (req, res, next) => {
  const { error } = bookValidationSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  next();
};

module.exports = { validateBook, validateReview };