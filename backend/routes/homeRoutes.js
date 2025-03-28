const express = require('express');
const { getHomePageData, events } = require('../controllers/homeController');
const router = express.Router();

router.get('/', getHomePageData);
router.get('/events', events);
router.get('/maps-key',(req, res) => {
    res.json({ apiKey: process.env.GOOGLEMAPS_API_KEY });
  });

module.exports = router;
