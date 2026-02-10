const express = require('express');
const router = express.Router();
const { getCars, getCarById, createCar, updateCar, deleteCar, getFeaturedCars } = require('../controllers/carController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/featured', getFeaturedCars);
router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', protect, isAdmin, createCar);
router.put('/:id', protect, isAdmin, updateCar);
router.delete('/:id', protect, isAdmin, deleteCar);

module.exports = router;
