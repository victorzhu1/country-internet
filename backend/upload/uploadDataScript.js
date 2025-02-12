const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

require("dotenv").config({ path: "../.env" });

const dbConnection = require('./dbConnection');
const Country = require('../models/Country');
const Statistics = require('../models/Statistics');

const datasetsDir = path.join(__dirname, '../datasets');

const loadCSV = (filePath, model, transformRow) => {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const transformedRow = transformRow(row);
                if (transformedRow) records.push(transformedRow);
            })
            .on('end', async () => {
                try {
                    await model.insertMany(records);
                    console.log(`Loaded ${records.length} records from ${filePath}`);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            })
            .on('error', (err) => reject(err));
    });
};

const transformCountry = (row) => ({
    country: row['Country'].trim(),
    code: row['Code'].trim()
});

const transformInternetStats = (row) => ({
    countryCode: row['Location'].trim(),
    rate_wb: row['Rate (WB)'] ? parseFloat(row['Rate (WB)']) : null,
    year_wb: row['Year'] ? parseInt(row['Year'], 10) : null,
    rate_itu: row['Rate (ITU)'] ? parseFloat(row['Rate (ITU)']) : null,
    year_itu: row['Year.1'] ? parseInt(row['Year.1'], 10) : null,
    users_cia: row['Users (CIA)'] ? parseInt(row['Users (CIA)'], 10) : null,
    year_cia: row['Year.2'] ? parseInt(row['Year.2'], 10) : null
});

const loadAllCSVs = async () => {
    await dbConnection();

    await loadCSV(path.join(datasetsDir, 'countries.csv'), Country, transformCountry);
    await loadCSV(path.join(datasetsDir, 'country_internet_statistics.csv'), Statistics, transformInternetStats);

    console.log('All data loaded!');
    mongoose.connection.close();
};

loadAllCSVs().catch(err => console.error(err));
