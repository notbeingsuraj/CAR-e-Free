const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a car name'],
        trim: true,
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand'],
        trim: true,
    },
    year: {
        type: Number,
        default: 2024,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    images: [{
        type: String,
    }],
    seats: {
        type: Number,
        required: true,
        default: 5,
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'CNG'],
        default: 'Petrol',
    },
    transmission: {
        type: String,
        enum: ['Manual', 'Automatic'],
        default: 'Manual',
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Please add hourly price'],
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Please add daily price'],
    },
    available: {
        type: Boolean,
        default: true,
    },
    features: [{
        type: String,
    }],
    rules: {
        type: String,
        default: 'No smoking. Return with same fuel level. Report any damage immediately.',
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5,
    },
    totalBookings: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        enum: ['Economy', 'Hatchback', 'Sedan', 'SUV', 'Premium'],
        default: 'Economy',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Car', carSchema);
