const Donation = require("../models/Donation");

const createDonation = async (req, res) => {
    try {
        const { donor, item, quantity, description, organization } = req.body;

        const donation = new Donation({
            donor,
            item,
            quantity,
            description,
            organization,
        });

        await donation.save();
        res.status(201).json({ message: "Donation created successfully", donation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate("donor", "name").populate("organization", "name");
        res.status(200).json(donations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createDonation, getDonations };
