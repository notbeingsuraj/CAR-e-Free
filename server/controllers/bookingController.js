const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @desc    Create a booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const { carId, startDate, endDate, pickupLocation, dropoffLocation, totalCost } = req.body;

        // Check car exists and is available
        const car = await Car.findById(carId);
        if (!car || !car.available) {
            return res.status(400).json({ message: 'Car not available' });
        }

        // Check for overlapping bookings
        const overlap = await Booking.findOne({
            car: carId,
            status: { $in: ['confirmed', 'pending'] },
            $or: [
                { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } },
            ],
        });

        if (overlap) {
            return res.status(400).json({ message: 'Car already booked for these dates' });
        }

        const booking = await Booking.create({
            user: req.user._id,
            car: carId,
            startDate,
            endDate,
            pickupLocation: pickupLocation || 'CU Campus - Main Gate',
            dropoffLocation: dropoffLocation || 'CU Campus - Main Gate',
            totalCost,
        });

        // Increment booking count
        car.totalBookings += 1;
        await car.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('car', 'name brand images pricePerHour pricePerDay')
            .populate('user', 'name email');

        res.status(201).json(populatedBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('car', 'name brand images pricePerHour pricePerDay category')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
const getAllBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};
        if (status) query.status = status;

        const total = await Booking.countDocuments(query);
        const bookings = await Booking.find(query)
            .populate('car', 'name brand images')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.json({
            bookings,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Only owner or admin can cancel
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        booking.status = 'cancelled';
        booking.paymentStatus = 'refunded';
        await booking.save();

        res.json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = req.body.status || booking.status;
        booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;
        await booking.save();

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking, updateBookingStatus };
