import bcrypt from "bcryptjs";
import { connectDB } from "../util/db";
import User from "../models/User";

export default async function handler(req, res) {
    // ... CORS headers ...
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        if (!req.body) {
            return res.status(400).json({ error: "Missing request body" });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await User.create({ email, passwordHash });

        return res.status(201).json({
            success: true,
            message: "Signup successful"
        });
    } catch (err) {
        console.error("SIGNUP CRASH:", err);
        return res.status(500).json({
            error: "Internal server error",
            detail: err.message,
            name: err.name
        });
    }
}
