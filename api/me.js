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
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-auth-token'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== "GET") {
        return res.status(405).json({ msg: "Method not allowed" });
    }

    // Middleware logic inline (since Vercel functions are isolated)
    const token = req.headers["x-auth-token"];
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        await connectDB();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json(user);

    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: "Token is not valid" });
    }
};
