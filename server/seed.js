const mongoose = require('mongoose');
const Car = require('./models/Car');
const User = require('./models/User');
require('dotenv').config();

const cars = [
    // ============ HATCHBACKS ============
    {
        name: 'Alto K10',
        brand: 'Maruti Suzuki',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159587/alto-k10-exterior-right-front-three-quarter.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159587/alto-k10-exterior-rear-view.jpeg',
        ],
        seats: 4,
        fuelType: 'Petrol',
        transmission: 'Manual',
        pricePerHour: 60,
        pricePerDay: 600,
        available: true,
        features: ['AC', 'Power Steering', 'Central Locking', 'Front Airbags'],
        rules: 'No smoking. Return with same fuel level. Speed limit 80 km/h.',
        rating: 4.1,
        totalBookings: 72,
        category: 'Hatchback',
    },
    {
        name: 'Baleno',
        brand: 'Maruti Suzuki',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159607/baleno-exterior-right-front-three-quarter.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159607/baleno-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        pricePerHour: 100,
        pricePerDay: 1000,
        available: true,
        features: ['AC', 'Touchscreen Infotainment', 'Bluetooth', 'Cruise Control', 'Rear Camera', 'LED DRLs'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.4,
        totalBookings: 58,
        category: 'Hatchback',
    },
    {
        name: 'i20',
        brand: 'Hyundai',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/150603/i20-exterior-right-front-three-quarter-3.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/150603/i20-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        pricePerHour: 110,
        pricePerDay: 1100,
        available: true,
        features: ['AC', 'Sunroof', 'Wireless Charging', 'Bose Speakers', 'LED Headlamps', 'Cruise Control'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.5,
        totalBookings: 65,
        category: 'Hatchback',
    },
    {
        name: 'Fronx',
        brand: 'Maruti Suzuki',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/fronx-exterior-right-front-three-quarter.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/fronx-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        pricePerHour: 120,
        pricePerDay: 1200,
        available: true,
        features: ['AC', 'HUD Display', 'Wireless Charging', '360 Camera', 'Cruise Control', 'Connected Car'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.5,
        totalBookings: 42,
        category: 'Hatchback',
    },
    {
        name: 'Polo',
        brand: 'Volkswagen',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/48542/polo-exterior-right-front-three-quarter-2.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        pricePerHour: 90,
        pricePerDay: 900,
        available: true,
        features: ['AC', 'ABS', 'Dual Airbags', 'Bluetooth', 'Power Windows'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.2,
        totalBookings: 55,
        category: 'Hatchback',
    },

    // ============ SEDANS ============
    {
        name: 'Swift Dzire',
        brand: 'Maruti Suzuki',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/dzire-exterior-right-front-three-quarter.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/dzire-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        pricePerHour: 100,
        pricePerDay: 1000,
        available: true,
        features: ['AC', 'Bluetooth', 'Power Steering', 'USB Charging', 'Rear Camera'],
        rules: 'No smoking. Return with same fuel level. Speed limit 100 km/h.',
        rating: 4.3,
        totalBookings: 80,
        category: 'Sedan',
    },
    {
        name: 'Verna',
        brand: 'Hyundai',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/verna-exterior-right-front-three-quarter-2.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/verna-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        pricePerHour: 160,
        pricePerDay: 1600,
        available: true,
        features: ['AC', 'Sunroof', 'Ventilated Seats', 'ADAS', 'Wireless Charging', 'Bose Audio', 'Connected Car'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.7,
        totalBookings: 48,
        category: 'Sedan',
    },
    {
        name: 'City',
        brand: 'Honda',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter-2.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        pricePerHour: 150,
        pricePerDay: 1500,
        available: true,
        features: ['AC', 'Sunroof', 'Lane Watch Camera', 'Honda Connect', 'LED Headlamps', 'Cruise Control'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.6,
        totalBookings: 36,
        category: 'Sedan',
    },
    {
        name: 'Ciaz',
        brand: 'Maruti Suzuki',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/46091/ciaz-exterior-right-front-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        pricePerHour: 110,
        pricePerDay: 1100,
        available: true,
        features: ['AC', 'SmartPlay Infotainment', 'Cruise Control', 'Auto Climate Control', 'Rear AC Vents'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.2,
        totalBookings: 30,
        category: 'Sedan',
    },

    // ============ SUVs ============
    {
        name: 'Creta',
        brand: 'Hyundai',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter-4.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        pricePerHour: 180,
        pricePerDay: 1800,
        available: true,
        features: ['AC', 'Panoramic Sunroof', 'Ventilated Seats', 'ADAS', 'Wireless Charging', '360 Camera', 'Bose Audio'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.7,
        totalBookings: 70,
        category: 'SUV',
    },
    {
        name: 'Seltos',
        brand: 'Kia',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/174323/seltos-exterior-right-front-three-quarter.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/174323/seltos-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        pricePerHour: 170,
        pricePerDay: 1700,
        available: true,
        features: ['AC', 'Ventilated Seats', 'Bose Audio', 'Sunroof', 'Connected Car', 'ADAS', '360 Camera'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.6,
        totalBookings: 52,
        category: 'SUV',
    },
    {
        name: 'Nexon',
        brand: 'Tata',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-front-three-quarter-71.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/141867/nexon-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        pricePerHour: 130,
        pricePerDay: 1300,
        available: true,
        features: ['AC', 'Sunroof', 'Harman Audio', 'Ventilated Seats', 'Air Purifier', 'Connected Car'],
        rules: 'No smoking. Return with same fuel level. 5-star NCAP safety rated.',
        rating: 4.5,
        totalBookings: 44,
        category: 'SUV',
    },
    {
        name: 'Brezza',
        brand: 'Maruti Suzuki',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/132921/brezza-exterior-right-front-three-quarter-2.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/132921/brezza-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        pricePerHour: 140,
        pricePerDay: 1400,
        available: true,
        features: ['AC', 'HUD Display', 'Wireless Charging', '360 Camera', 'Suzuki Connect', 'Electric Sunroof'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.4,
        totalBookings: 38,
        category: 'SUV',
    },
    {
        name: 'Scorpio N',
        brand: 'Mahindra',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/scorpio-n-exterior-right-front-three-quarter-75.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/scorpio-n-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 7,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        pricePerHour: 200,
        pricePerDay: 2000,
        available: true,
        features: ['AC', '4x4', 'AdrenoX', 'Sony Audio', 'Dual Zone Climate', 'Sunroof', 'Terrain Modes'],
        rules: 'No off-roading without prior approval. No smoking. Return with same fuel level.',
        rating: 4.6,
        totalBookings: 35,
        category: 'SUV',
    },
    {
        name: 'Thar',
        brand: 'Mahindra',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-76.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 4,
        fuelType: 'Diesel',
        transmission: 'Manual',
        pricePerHour: 220,
        pricePerDay: 2200,
        available: true,
        features: ['AC', '4x4', 'Convertible Roof', 'Touchscreen', 'Cruise Control', 'Adventure Ready'],
        rules: 'Off-road permitted on designated trails only. No smoking. Return clean.',
        rating: 4.8,
        totalBookings: 60,
        category: 'SUV',
    },
    {
        name: 'XUV700',
        brand: 'Mahindra',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-rear-three-quarter.jpeg',
        ],
        seats: 7,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        pricePerHour: 250,
        pricePerDay: 2500,
        available: true,
        features: ['AC', 'ADAS', 'Panoramic Sunroof', 'Sony 3D Audio', 'Flush Door Handles', 'AdrenoX', 'Alexa'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.7,
        totalBookings: 28,
        category: 'SUV',
    },

    // ============ PREMIUM ============
    {
        name: 'Fortuner',
        brand: 'Toyota',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-left-rear-three-quarter.jpeg',
        ],
        seats: 7,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        pricePerHour: 350,
        pricePerDay: 3500,
        available: true,
        features: ['AC', '4x4', 'Leather Seats', 'JBL Audio', 'Cooled Seats', 'Wireless Charging', 'Cruise Control'],
        rules: 'No smoking. Premium car — extra ₹5000 damage deposit required. Return with same fuel.',
        rating: 4.9,
        totalBookings: 22,
        category: 'Premium',
    },
    {
        name: 'Innova Crysta',
        brand: 'Toyota',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter.jpeg',
        ],
        seats: 7,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        pricePerHour: 280,
        pricePerDay: 2800,
        available: true,
        features: ['AC', 'Captain Seats', 'Touchscreen', 'Ambient Lighting', 'Rear AC', 'Multiple USB Ports'],
        rules: 'No smoking. Perfect for group trips. Return with same fuel level.',
        rating: 4.7,
        totalBookings: 40,
        category: 'Premium',
    },
    {
        name: 'Hector',
        brand: 'MG',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/hector-exterior-right-front-three-quarter.jpeg',
        ],
        seats: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        pricePerHour: 200,
        pricePerDay: 2000,
        available: true,
        features: ['AC', 'Panoramic Sunroof', '14" Touchscreen', 'i-SMART', 'Ventilated Seats', '360 Camera', 'Infinity Audio'],
        rules: 'No smoking. Return with same fuel level. Report any damage immediately.',
        rating: 4.4,
        totalBookings: 25,
        category: 'Premium',
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Car.deleteMany({});
        console.log('Cleared existing cars');

        // Insert all cars
        await Car.insertMany(cars);
        console.log(`✅ Seeded ${cars.length} cars successfully!`);

        // Create admin user if not exists
        const adminExists = await User.findOne({ email: 'admin@carefree.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@carefree.com',
                password: 'admin123',
                role: 'admin',
                isVerified: true,
            });
            console.log('✅ Admin user created (admin@carefree.com / admin123)');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create demo student
        const studentExists = await User.findOne({ email: 'student@cuchd.in' });
        if (!studentExists) {
            await User.create({
                name: 'Suraj Kumar',
                email: 'student@cuchd.in',
                password: 'student123',
                phone: '+91 98765 43210',
                role: 'student',
                universityEmail: 'suraj.kumar@cuchd.in',
                isVerified: true,
            });
            console.log('✅ Demo student created (student@cuchd.in / student123)');
        } else {
            console.log('ℹ️  Demo student already exists');
        }

        console.log('\n🎉 Seeding complete!');
        console.log(`   ${cars.length} cars ready`);
        console.log('   Admin: admin@carefree.com / admin123');
        console.log('   Student: student@cuchd.in / student123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
};

seedDB();
