const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

router.get('/', async (req, res) => {
    try {
        const countries = await Country.find({}, 'country code');
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching countries' });
    }
});

module.exports = router;
