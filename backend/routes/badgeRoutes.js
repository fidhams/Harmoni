// routes/badgeRoutes.js - API endpoints for the badge system
const express = require('express');
const router = express.Router();
const BadgeService = require('../services/BadgeService');
const Badge = require('../models/Badge');

// Get all badges for a donor with progress information
router.get('/donors/:donorId/badges', async (req, res) => {
    try {
        const badges = await BadgeService.getDonorBadgeProgress(req.params.donorId);
        res.json({
            success: true,
            badges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get only earned badges for a donor
router.get('/donors/:donorId/badges/earned', async (req, res) => {
    try {
        const badges = await BadgeService.getDonorBadges(req.params.donorId);
        res.json({
            success: true,
            badges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get all available badge definitions
router.get('/badges', async (req, res) => {
    try {
        const badges = await Badge.find({});
        res.json({
            success: true,
            badges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Admin route to create a new badge
router.post('/badges', async (req, res) => {
    try {
        const newBadge = new Badge(req.body);
        await newBadge.save();
        res.status(201).json({
            success: true,
            badge: newBadge
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Admin route to update a badge
router.put('/badges/:badgeId', async (req, res) => {
    try {
        const updatedBadge = await Badge.findOneAndUpdate(
            { badgeId: req.params.badgeId },
            req.body,
            { new: true }
        );
        
        if (!updatedBadge) {
            return res.status(404).json({
                success: false,
                message: "Badge not found"
            });
        }
        
        res.json({
            success: true,
            badge: updatedBadge
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;