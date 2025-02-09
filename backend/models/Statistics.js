const mongoose = require('mongoose');

const InternetStatisticsSchema = new mongoose.Schema({
    countryCode: { type: String, required: true, ref: 'Country' },
    rate_wb: { type: Number },
    year_wb: { type: Number },
    rate_itu: { type: Number },
    year_itu: { type: Number },
    users_cia: { type: Number },
    year_cia: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('InternetStatistics', InternetStatisticsSchema);
