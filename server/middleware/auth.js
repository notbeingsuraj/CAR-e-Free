const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ msg: "No token, auth denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch {
        res.status(401).json({ msg: "Token invalid" });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ msg: "Admin access required" });
        }
        next();
    } catch {
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = protect;
module.exports.protect = protect;
module.exports.isAdmin = isAdmin;
