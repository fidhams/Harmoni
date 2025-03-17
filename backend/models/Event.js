const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  donee: { type: mongoose.Schema.Types.ObjectId, ref: "donee", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  volunteerRequest: { type: Boolean, default: false }, // If volunteers are needed
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "donor" }] // Donors who applied
});

module.exports = mongoose.model("Event", eventSchema);
