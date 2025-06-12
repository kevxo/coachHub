import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'

export const authenticateToken = (req, resp, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
        resp.status(401).json({error: "Missing Token"});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return resp.status(403).json({error: "Invalid or expired token"});

        req.user = user;

        next();
    })
}