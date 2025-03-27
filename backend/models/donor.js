//The User model handles both donors and organizations.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const donorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: false },
    phone: { type: String, required: true },
    badges: [{ type: String }], // Gamified badges
    skills: [{ type: String }], // For volunteer skill matching
    description: {type: String, required: false },
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Donation" }],
    volunteering: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
donorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

module.exports = mongoose.model("donor", donorSchema);
