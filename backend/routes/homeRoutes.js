const express = require('express');
const { getHomePageData, events } = require('../controllers/homeController');
const router = express.Router();

router.get('/', getHomePageData);
router.get('/events', events);

module.exports = router;
