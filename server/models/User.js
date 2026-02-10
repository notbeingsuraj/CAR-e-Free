const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    phone: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    universityEmail: {
        type: String,
        default: '',
    },
    idCardUrl: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hash
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
