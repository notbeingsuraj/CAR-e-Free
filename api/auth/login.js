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
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        await connectDB();

        // Find user and include password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const valid = await user.matchPassword(password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
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
        console.error("LOGIN CRASH:", err);
        return res.status(500).json({ error: "Server error", detail: err.message });
    }
}
