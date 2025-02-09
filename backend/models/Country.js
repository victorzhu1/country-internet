const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    country: { type: String, required: true },
    code: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Country', CountrySchema);
