import jwt from "jsonwebtoken";
import { connectDB } from "../util/db.js";
import User from "../models/User.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-auth-token');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const token = req.headers["x-auth-token"];
        if (!token) {
            return res.status(401).json({ error: "No token, auth denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await connectDB();

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        });
    } catch (err) {
        console.error("GET ME ERROR:", err);
        return res.status(401).json({ error: "Token invalid" });
    }
}
