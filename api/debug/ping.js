export default function handler(req, res) {
    return res.status(200).json({
        ok: true,
        env: {
            hasMongoUri: Boolean(process.env.MONGODB_URI || process.env.MONGO_URI)
        }
    });
}
