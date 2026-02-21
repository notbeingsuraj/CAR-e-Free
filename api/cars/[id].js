import { connectDB } from "../util/db.js";
import Car from "../models/Car.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDB();

        const { id } = req.query;
        const car = await Car.findById(id);

        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }

        return res.json(car);
    } catch (err) {
        console.error("CAR BY ID ERROR:", err);
        return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
}
