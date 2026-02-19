import { connectDB } from "../util/db";

export default async function handler(req, res) {
    try {
        await connectDB();
        return res.status(200).json({ db: "connected" });
    } catch (err) {
        return res.status(500).json({
            error: "DB connection failed",
            detail: err.message,
            name: err.name
        });
    }
}
