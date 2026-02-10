const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, cancelBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, isAdmin, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, isAdmin, updateBookingStatus);

module.exports = router;
