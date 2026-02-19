import connectDB from "../../api/util/db";
import User from "../../server/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    // CORS (Optional for same-domain like this, but good practice)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { phone, name } = req.body;

        if (!phone) {
            return res.status(400).json({ error: "Phone number required" });
        }

        // DB Logic - Commented out for initial connectivity test as requested
        /*
        await connectDB();
        let user = await User.findOne({ phone });
        if (user) return res.status(400).json({ error: "User already exists" });
        user = await User.create({ phone, name });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        */

        // Mock Success Response
        return res.status(200).json({
            success: true,
            phone,
            name,
            token: "mock-vercel-token"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}
