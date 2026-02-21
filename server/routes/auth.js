const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * SIGNUP
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                msg: "Please provide name, email, and password"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User with this email already exists"
            });
        }

        // Create user (password is hashed by the pre-save hook)
        const user = await User.create({ name, email, password });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
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
        console.error("Signup error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error during signup",
            error: err.message
        });
    }
});

/**
 * LOGIN
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Please provide email and password"
            });
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                msg: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
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
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            msg: "Server error during login",
            error: err.message
        });
    }
});

/**
 * GET ME
 * GET /api/auth/me
 * Requires auth middleware
 */
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
