const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * SIGNUP
 * Creates user if not exists
 */
router.post("/signup", async (req, res) => {
    try {
        const { phone } = req.body;

        // TEMP: no DB, just return success
        return res.json({
            success: true,
            user: { phone },
            token: "temp_debug_token" // Adding a temp token to prevent frontend crash on localStorage set
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

/**
 * LOGIN
 * Finds user by phone
 */
router.post("/login", async (req, res) => {
    try {
        const { phone } = req.body;

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, user });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

/**
 * GET USER
 * Returns current user data
 */
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
