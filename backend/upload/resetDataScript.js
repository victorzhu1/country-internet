const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./dbConnection');
const Country = require('../models/Country');
const Statistics = require('../models/Statistics');

const resetData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await connectDB();
        await Country.deleteMany({});

        await Statistics.deleteMany({});

        console.log('All collections cleared.');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error clearing collections:', error);
        mongoose.connection.close();
        process.exit(1);
    }
};

resetData();
