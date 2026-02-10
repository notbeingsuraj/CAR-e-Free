const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date'],
    },
    pickupLocation: {
        type: String,
        default: 'CU Campus - Main Gate',
    },
    dropoffLocation: {
        type: String,
        default: 'CU Campus - Main Gate',
    },
    totalCost: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed', 'pending'],
        default: 'confirmed',
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'refunded'],
        default: 'paid',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema);
