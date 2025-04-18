const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');

const router = express.Router();

router.post('/login', authUser);
router.post('/', registerUser);
router.route('/:id').get(getUserProfile).put(protect, updateUserProfile);

module.exports = router;