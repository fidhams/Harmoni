// Add this to your routes folder (e.g., userRoutes.js)

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all user routes
router.use(protect);

// Route to get user details
router.get('/:userType/:userId', userController.getUserDetails);

module.exports = router;