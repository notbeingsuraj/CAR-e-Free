const connectDB = require("./util/db");
const User = require("../server/models/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        return res.status(405).json({ msg: "Method not allowed" });
    }

    try {
        await connectDB();

        const { phone, name } = req.body;

        if (!phone) {
            return res.status(400).json({ msg: "Phone number required" });
        }

        let user = await User.findOne({ phone });

        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        user = await User.create({ phone, name });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ token, user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
