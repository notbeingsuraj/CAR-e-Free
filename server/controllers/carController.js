const Car = require('../models/Car');

// @desc    Get all cars with filters
// @route   GET /api/cars
const getCars = async (req, res) => {
    try {
        const {
            search, seats, fuelType, transmission, minPrice, maxPrice,
            sort, page = 1, limit = 8, category,
        } = req.query;

        const query = { available: true };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
            ];
        }
        if (seats) query.seats = Number(seats);
        if (fuelType) query.fuelType = fuelType;
        if (transmission) query.transmission = transmission;
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.pricePerDay = {};
            if (minPrice) query.pricePerDay.$gte = Number(minPrice);
            if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { pricePerDay: 1 };
        if (sort === 'price_desc') sortOption = { pricePerDay: -1 };
        if (sort === 'popular') sortOption = { totalBookings: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const total = await Car.countDocuments(query);
        const cars = await Car.find(query)
            .sort(sortOption)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        res.json({
            cars,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single car
// @route   GET /api/cars/:id
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create car (admin)
// @route   POST /api/cars
const createCar = async (req, res) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update car (admin)
// @route   PUT /api/cars/:id
const updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete car (admin)
// @route   DELETE /api/cars/:id
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json({ message: 'Car removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get featured cars (top rated)
// @route   GET /api/cars/featured
const getFeaturedCars = async (req, res) => {
    try {
        const cars = await Car.find({ available: true })
            .sort({ rating: -1 })
            .limit(4);
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getFeaturedCars };
