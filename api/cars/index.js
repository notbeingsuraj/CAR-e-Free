import { connectDB } from "../util/db.js";
import Car from "../models/Car.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await connectDB();

        if (req.method === 'GET') {
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

            return res.json({
                cars,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                total,
            });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (err) {
        console.error("CARS API ERROR:", err);
        return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
}
