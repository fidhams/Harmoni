const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  donee: { type: mongoose.Schema.Types.ObjectId, ref: "donee", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: false }, // [longitude, latitude]
  },
  volunteerRequest: { type: Boolean, default: false }, // If volunteers are needed
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "donor" }] // Donors who applied
});

// Add 2dsphere index for geospatial queries
eventSchema.index({ location: "2dsphere" });


module.exports = mongoose.model("Event", eventSchema);
