const Joi = require('joi');

const bookValidationSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().required(),
  genre: Joi.string().required(),
  coverImage: Joi.string().required(),
});

const reviewValidationSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().required(),
  book: Joi.string().required(),
});

const userValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  bio: Joi.string().allow(''),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  bio: Joi.string().allow(''),
  password: Joi.string().min(6),
});

module.exports = {
  bookValidationSchema,
  reviewValidationSchema,
  userValidationSchema,
  userLoginSchema,
  userUpdateSchema,
};