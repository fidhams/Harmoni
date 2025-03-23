const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doneeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: false },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: undefined }, // [longitude, latitude]
  },
  verified: { type: Boolean, default: false },
  profileImage: { type: String }, // URL of profile image
  description: { type: String },  // Short bio or description
  Event: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Reference to Events
  Needs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Needs" }], // Reference to Donation Needs
  ImpactStory: [{ type: mongoose.Schema.Types.ObjectId, ref: "ImpactStory" }] // Reference to Impact Stories
});

// Hash password before saving
doneeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add 2dsphere index for geospatial queries
doneeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("donee", doneeSchema);
