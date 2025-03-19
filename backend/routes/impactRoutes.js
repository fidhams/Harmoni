const express = require('express');
const router = express.Router();
const ImpactStory = require("../models/ImpactStory")


router.get("/", async (req,res) => {
    try{
        const story = await ImpactStory.find();
        if (!Array.isArray(story)) {
            return res.status(500).json({ error: "Invalid response format" });
          }
          res.json(story);
        } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
        }
})

// Sample impact stories data
// const impactStories = [
//     {
//         _id: '1',
//         title: 'Providing Education to 500+ Kids',
//         description: 'Our efforts in rural areas helped over 500 kids gain access to education.',
//         image: 'https://example.com/education.jpg'
//     },
//     {
//         _id: '2',
//         title: 'Supporting Flood Victims',
//         description: 'Donations helped rebuild homes and provide food supplies to 1,000 families.',
//         image: 'https://example.com/flood-relief.jpg'
//     },
//     {
//         _id: '3',
//         title: 'Empowering Women Entrepreneurs',
//         description: 'Micro-loans enabled women to start their small businesses and become financially independent.',
//         image: 'https://example.com/women-entrepreneurs.jpg'
//     }
// ];

// // API Endpoint to Get Impact Stories
// router.get('/', (req, res) => {
//     res.json(impactStories);
// });

module.exports = router;
