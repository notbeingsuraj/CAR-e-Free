const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });

        // Revenue
        const revenueResult = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalCost' } } },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Total cars
        const totalCars = await Car.countDocuments();
        const availableCars = await Car.countDocuments({ available: true });

        // Total users
        const totalUsers = await User.countDocuments({ role: 'student' });
        const verifiedUsers = await User.countDocuments({ role: 'student', isVerified: true });

        // Bookings per day (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const bookingsPerDay = await Booking.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalCost' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Revenue by car (top 5)
        const revenueByCar = await Booking.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: '$car', revenue: { $sum: '$totalCost' }, count: { $sum: 1 } } },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'cars',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'carInfo',
                },
            },
            { $unwind: '$carInfo' },
            {
                $project: {
                    carName: '$carInfo.name',
                    brand: '$carInfo.brand',
                    revenue: 1,
                    count: 1,
                },
            },
        ]);

        // Utilization rate
        const utilization = totalCars > 0
            ? Math.round(((totalCars - availableCars) / totalCars) * 100)
            : 0;

        res.json({
            totalBookings,
            confirmedBookings,
            cancelledBookings,
            completedBookings,
            totalRevenue,
            totalCars,
            availableCars,
            totalUsers,
            verifiedUsers,
            utilization,
            bookingsPerDay,
            revenueByCar,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, verified } = req.query;
        const query = { role: 'student' };
        if (verified !== undefined) query.isVerified = verified === 'true';

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.json({ users, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify/unverify a user (admin)
// @route   PUT /api/admin/users/:id/verify
const verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : !user.isVerified;
        await user.save();
        res.json({ message: `User ${user.isVerified ? 'verified' : 'unverified'}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics, getUsers, verifyUser };
