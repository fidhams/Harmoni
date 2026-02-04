// services/BadgeService.js - Badge business logic
const Badge = require('../models/Badge');
const DonorBadge = require('../models/DonorBadge');
const BadgeProgress = require('../models/BadgeProgress');
const Donor = require('../models/donor');

class BadgeService {
    // Initialize the badge system with default badges
    static async initializeBadges() {
        const defaultBadges = [
            {
                badgeId: "first_donation",
                name: "First Step",
                description: "Made your first donation",
                icon: "heart_badge.png",
                category: "donation",
                level: 1,
                requirements: {
                    donationCount: 1
                }
            },
            {
                badgeId: "generous_donor",
                name: "Generous Donor",
                description: "Donated a total of $100 or more",
                icon: "money_badge.png",
                category: "donation",
                level: 2,
                requirements: {
                    donationAmount: 100
                }
            },
            {
                badgeId: "philanthropist",
                name: "Philanthropist",
                description: "Donated a total of $1000 or more",
                icon: "trophy_badge.png",
                category: "donation",
                level: 3,
                requirements: {
                    donationAmount: 1000
                }
            },
            {
                badgeId: "consistent_donor",
                name: "Consistent Donor",
                description: "Made 5 or more donations",
                icon: "calendar_badge.png",
                category: "frequency",
                level: 1,
                requirements: {
                    donationCount: 5
                }
            },
            {
                badgeId: "loyal_supporter",
                name: "Loyal Supporter",
                description: "Made 10 or more donations",
                icon: "star_badge.png",
                category: "frequency",
                level: 2,
                requirements: {
                    donationCount: 10
                }
            },
            {
                badgeId: "first_volunteer",
                name: "Volunteer Initiate",
                description: "Volunteered for your first event",
                icon: "hands_badge.png",
                category: "volunteer",
                level: 1,
                requirements: {
                    volunteerEvents: 1
                }
            },
            {
                badgeId: "dedicated_volunteer",
                name: "Dedicated Volunteer",
                description: "Volunteered for 10+ hours",
                icon: "clock_badge.png",
                category: "volunteer",
                level: 2,
                requirements: {
                    volunteerHours: 10
                }
            },
            {
                badgeId: "profile_complete",
                name: "Profile Pro",
                description: "Completed your donor profile",
                icon: "profile_badge.png",
                category: "profile",
                level: 1,
                requirements: {
                    profileCompletion: true
                }
            }
        ];

        // Use insertMany with ordered: false for idempotent initialization
        try {
            await Badge.insertMany(defaultBadges, { ordered: false });
            console.log("Default badges initialized");
        } catch (error) {
            // Ignore duplicate key errors
            if (error.code !== 11000) {
                console.error("Error initializing badges:", error);
            }
        }
    }

    // Check and award badges based on donor's current stats
    static async checkAndAwardBadges(donorId) {
        try {
            const donor = await Donor.findById(donorId);
            if (!donor) {
                throw new Error("Donor not found");
            }

            // Get all available badges
            const badges = await Badge.find({});
            // Get donor's current badges
            const donorBadges = await DonorBadge.find({ donorId });
            const earnedBadgeIds = donorBadges.map(db => db.badgeId);
            
            const newlyEarnedBadges = [];

            for (const badge of badges) {
                // Skip if already earned
                if (earnedBadgeIds.includes(badge.badgeId)) {
                    continue;
                }

                // Check if badge conditions are met
                if (this.checkBadgeRequirements(donor, badge)) {
                    // Award the badge
                    const donorBadge = new DonorBadge({
                        donorId: donor._id,
                        badgeId: badge.badgeId,
                        earnedAt: new Date()
                    });
                    
                    await donorBadge.save();
                    newlyEarnedBadges.push({
                        ...badge.toObject(),
                        earnedAt: donorBadge.earnedAt
                    });
                }
                else {
                    // Update progress for unearned badges
                    await this.updateBadgeProgress(donor, badge);
                }
            }

            return newlyEarnedBadges;
        } catch (error) {
            console.error("Error checking and awarding badges:", error);
            throw error;
        }
    }

    // Check if a donor meets badge requirements
    static checkBadgeRequirements(donor, badge) {
        const { requirements } = badge;
        
        // Check each requirement type
        if (requirements.donationAmount && donor.totalDonated < requirements.donationAmount) {
            return false;
        }
        
        if (requirements.donationCount && donor.donationCount < requirements.donationCount) {
            return false;
        }
        
        if (requirements.volunteerHours && donor.volunteerHours < requirements.volunteerHours) {
            return false;
        }
        
        if (requirements.volunteerEvents && donor.volunteerEvents < requirements.volunteerEvents) {
            return false;
        }
        
        if (requirements.profileCompletion && donor.profileCompletionPercentage < 100) {
            return false;
        }
        
        if (requirements.daysActive) {
            const daysSinceCreation = Math.floor(
                (Date.now() - donor.createdAt) / (1000 * 60 * 60 * 24)
            );
            if (daysSinceCreation < requirements.daysActive) {
                return false;
            }
        }
        
        return true;
    }

    // Update progress tracking for badges
    static async updateBadgeProgress(donor, badge) {
        try {
            const { requirements } = badge;
            let currentProgress = 0;
            let targetValue = 0;
            
            // Determine which requirement to track
            if (requirements.donationAmount) {
                currentProgress = donor.totalDonated;
                targetValue = requirements.donationAmount;
            } 
            else if (requirements.donationCount) {
                currentProgress = donor.donationCount;
                targetValue = requirements.donationCount;
            }
            else if (requirements.volunteerHours) {
                currentProgress = donor.volunteerHours;
                targetValue = requirements.volunteerHours;
            }
            else if (requirements.volunteerEvents) {
                currentProgress = donor.volunteerEvents;
                targetValue = requirements.volunteerEvents;
            }
            else if (requirements.profileCompletion) {
                currentProgress = donor.profileCompletionPercentage;
                targetValue = 100;
            }
            else if (requirements.daysActive) {
                const daysSinceCreation = Math.floor(
                    (Date.now() - donor.createdAt) / (1000 * 60 * 60 * 24)
                );
                currentProgress = daysSinceCreation;
                targetValue = requirements.daysActive;
            }
            
            // Calculate percentage
            const percentComplete = Math.min(100, Math.floor((currentProgress / targetValue) * 100));
            
            // Update or create progress record
            await BadgeProgress.findOneAndUpdate(
                { donorId: donor._id, badgeId: badge.badgeId },
                {
                    currentProgress,
                    targetValue,
                    percentComplete,
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error("Error updating badge progress:", error);
            throw error;
        }
    }

    // Get badges earned by a donor
    static async getDonorBadges(donorId) {
        try {
            const donorBadges = await DonorBadge.find({ donorId }).sort({ earnedAt: -1 });
            
            if (donorBadges.length === 0) {
                return [];
            }
            
            // Get badge details for each earned badge
            const badgeIds = donorBadges.map(db => db.badgeId);
            const badges = await Badge.find({ badgeId: { $in: badgeIds } });
            
            // Combine badge details with earned date
            return donorBadges.map(db => {
                const badgeDetails = badges.find(b => b.badgeId === db.badgeId);
                return {
                    ...badgeDetails.toObject(),
                    earnedAt: db.earnedAt
                };
            });
        } catch (error) {
            console.error("Error getting donor badges:", error);
            throw error;
        }
    }

    // Get progress for all badges for a donor
    static async getDonorBadgeProgress(donorId) {
        try {
            // Get all badges
            const badges = await Badge.find({});
            
            // Get earned badges
            const donorBadges = await DonorBadge.find({ donorId });
            const earnedBadgeIds = donorBadges.map(db => db.badgeId);
            
            // Get progress data
            const progressRecords = await BadgeProgress.find({ donorId });
            
            // Combine all data
            return badges.map(badge => {
                const isEarned = earnedBadgeIds.includes(badge.badgeId);
                let earnedAt = null;
                let progress = null;
                
                if (isEarned) {
                    const donorBadge = donorBadges.find(db => db.badgeId === badge.badgeId);
                    earnedAt = donorBadge.earnedAt;
                } else {
                    const progressRecord = progressRecords.find(pr => pr.badgeId === badge.badgeId);
                    if (progressRecord) {
                        progress = {
                            current: progressRecord.currentProgress,
                            target: progressRecord.targetValue,
                            percentage: progressRecord.percentComplete
                        };
                    }
                }
                
                return {
                    ...badge.toObject(),
                    earned: isEarned,
                    earnedAt,
                    progress
                };
            });
        } catch (error) {
            console.error("Error getting badge progress:", error);
            throw error;
        }
    }
}

module.exports = BadgeService;