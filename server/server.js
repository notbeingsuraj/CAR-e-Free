const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const cors = require("cors");
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB CONNECTED"))
    .catch(err => console.error("❌ MongoDB ERROR:", err.message));

// Rate Limiting
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({
            msg: "Too many requests, please try again later"
        });
    }
});

// Routes
app.use("/api/auth", authLimiter);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cars", require("./routes/cars"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
