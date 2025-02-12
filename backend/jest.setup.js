const mongoose = require("mongoose");
require("dotenv").config(); 

beforeAll(async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in .env");
    }

    console.log("Connecting to MongoDB for testing...");
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    console.log("Closing MongoDB connection after tests...");
    await mongoose.connection.close();
});
