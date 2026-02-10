const express = require('express');
const router = express.Router();
const { getAnalytics, getUsers, verifyUser } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/analytics', protect, isAdmin, getAnalytics);
router.get('/users', protect, isAdmin, getUsers);
router.put('/users/:id/verify', protect, isAdmin, verifyUser);

module.exports = router;
