// config/badgeInit.js - Badge system initialization
const BadgeService = require('../services/BadgeService');

async function initializeBadgeSystem() {
    try {
        await BadgeService.initializeBadges();
        console.log("Badge system initialized successfully");
    } catch (error) {
        console.error("Failed to initialize badge system:", error);
    }
}

module.exports = initializeBadgeSystem;