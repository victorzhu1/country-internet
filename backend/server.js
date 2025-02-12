const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./upload/dbConnection");

const countryRoutes = require("./routes/countries");
const statisticsRoutes = require("./routes/statistics");

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization,x-api-key"
}));
app.use(express.json());

// API Key Middlewares
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: "Forbidden: Invalid API Key" });
    }
    next();
};

app.use("/api/countries", apiKeyMiddleware, countryRoutes);
app.use("/api/statistics", apiKeyMiddleware, statisticsRoutes);

// Seperate testing configurations
if (process.env.NODE_ENV !== "test") {
    dbConnection();
}
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
