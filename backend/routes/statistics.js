const express = require('express');
const router = express.Router();
const InternetStatistics = require('../models/Statistics');

router.get('/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        const stats = await InternetStatistics.findOne({ countryCode });

        if (!stats) {
            return res.status(404).json({ message: 'Statistics not found' });
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

router.put('/:countryCode', async (req, res) => {
    try {
        const { countryCode } = req.params;
        const { rate_wb } = req.body;

        if (rate_wb < 0 || rate_wb > 100) {
            return res.status(400).json({ message: 'Rate must be between 0 and 100' });
        }

        const updatedStats = await InternetStatistics.findOneAndUpdate(
            { countryCode },
            { rate_wb, year_wb: new Date().getFullYear() },
            { new: true, runValidators: true }
        );

        if (!updatedStats) {
            return res.status(404).json({ message: 'Statistics not found' });
        }

        res.json(updatedStats);
    } catch (error) {
        res.status(500).json({ message: 'Error updating statistics' });
    }
});

module.exports = router;
