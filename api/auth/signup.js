import jwt from "jsonwebtoken";
import { connectDB } from "../util/db.js";
import User from "../models/User.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { name, email, password } = req.body || {};

        if (!email || !password || !name) {
            return res.status(400).json({
                error: "Name, email, and password are required"
            });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        // Password is hashed by pre-save hook
        const user = await User.create({ name, email, password });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            }
        });
    } catch (err) {
        console.error("SIGNUP CRASH:", err);

        if (err.code === 11000) {
            return res.status(409).json({ error: "User already exists" });
        }

        return res.status(500).json({
            error: "Internal server error",
            detail: err.message,
            name: err.name
        });
    }
}
