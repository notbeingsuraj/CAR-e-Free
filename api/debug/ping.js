export default function handler(req, res) {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "";

    // Mask password but show everything else
    const masked = uri.replace(
        /\/\/([^:]+):([^@]+)@/,
        (_, user, pass) => `//${user}:${"*".repeat(pass.length)}@`
    );

    return res.status(200).json({
        maskedUri: masked,
        envKeyUsed: process.env.MONGODB_URI ? "MONGODB_URI" : process.env.MONGO_URI ? "MONGO_URI" : "NONE",
        uriLength: uri.length,
        passwordLength: (uri.match(/:([^@]+)@/) || [])[1]?.length || 0
    });
}
