const Donation = require('../models/Donation');
const VolunteerRequest = require('../models/VolunteerRequest');
const User = require('../models/donor');

// Controller to fetch home page data
const getHomePageData = async (req, res) => {
    try {
        // Fetch recent donations
        const recentDonations = await Donation.find().sort({ createdAt: -1 }).limit(5);

        // Fetch sentiment-driven fundraising highlights
        // const fundraisingHighlights = await Donation.aggregate([
        //     { $match: { sentimentScore: { $gte: 0.8 } } }, // Example filter for sentiment
        //     { $sort: { createdAt: -1 } },
        //     { $limit: 3 },
        // ]);

        // Fetch upcoming events from organizations
        const upcomingEvents = await User.find({ role: 'organization' })
            .select('events name') // Select only the necessary fields
            .limit(5);

        // Fetch stats
        const donationCount = await Donation.countDocuments();
        const volunteerCount = await VolunteerRequest.countDocuments();
        const orgCount = await User.countDocuments({ role: 'organization' });

        res.status(200).json({
            recentDonations,
            //fundraisingHighlights,
            upcomingEvents,
            stats: {
                donationCount,
                volunteerCount,
                orgCount,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHomePageData };
