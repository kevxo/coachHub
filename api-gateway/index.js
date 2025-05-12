import express from "express";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import { setupRateLimitAndProxying, rateLimitAndTimeout } from "./helper.js";

// Instance of an Express App
const app = express();

//  Setup middleware
app.use(cors()); // Enable CORS
app.use(helmet()) // Add Security headers
app.use(morgan("combined")); // Log HTTP requests
app.disable("x-powered-by"); // Hide express server information

setupRateLimitAndProxying(app)

// Applty the rate limit and timeout middleware to the proxy
app.use(rateLimitAndTimeout);

app.get('/', (req, res) => {
    res.json({ message: 'Soccer Coach API Gateway is running 🚀' });
});

// Handler for route-not-found
app.use((_req, res) => {
    res.status(404).json({
      code: 404,
      status: "Error",
      message: "Route not found.",
      data: null,
    });
});

// start Express server
app.listen(8080, () => {
    console.log(`Gateway is running on port 8080`);
});
