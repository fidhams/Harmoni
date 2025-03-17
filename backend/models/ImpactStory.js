const mongoose = require("mongoose");

const impactStorySchema = new mongoose.Schema({
  doneeId: { type: mongoose.Schema.Types.ObjectId, ref: "donee", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true } // URL of the image
}, { timestamps: true });

module.exports = mongoose.model("ImpactStory", impactStorySchema);
