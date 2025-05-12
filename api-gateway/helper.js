import { services } from "./constants/service.js";
import { createProxyMiddleware } from "http-proxy-middleware";

// Define rate limit constants
const rateLimit = 20; //Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1min)

//  Object to store requests counts for each IP address
const requestCounts = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
    Object.keys(requestCounts).forEach((ip) =>  {
        requestCounts[ip] = 0;
    });
}, [interval])

export const rateLimitAndTimeout = (req, res, next) => {
    const ip = req.ip; // Get Client IP address

    //  Update request count for current IP
    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    // check if requests count exceeds rate limit
    if (requestCounts[ip] > rateLimit) {
        return res.status(429).json({
            code: 429,
            status: "Error",
            message: "Rate limit exceeded",
            data: null
        });
    }

    // Set timeout for each request (example: 10 seconds)
    req.setTimeout(15000, () => {
        res.status(504).json({
            code: 504,
            status: "Error",
            message: "Gateway timeout.",
            data: null
        });
        req.abort(); // Abort the request
    });

    next(); // Continue to the next middleware
}

export const setupRateLimitAndProxying = (app) => {
    services.forEach(({route, target}) => {
        const proxyOptions = {
            target,
            changeOrigin: true,
            pathRewriteL: {
                [`^${route}`]: "",
            },
        };

        // Apply rate limiting and timeout middleware before proxying
        app.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions))
    });
}
