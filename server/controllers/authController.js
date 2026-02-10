const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, phone, universityEmail } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            universityEmail,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.universityEmail = req.body.universityEmail || user.universityEmail;

        if (req.file) {
            user.idCardUrl = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified,
            universityEmail: updatedUser.universityEmail,
            idCardUrl: updatedUser.idCardUrl,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getMe, updateProfile };
