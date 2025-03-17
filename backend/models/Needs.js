const mongoose = require("mongoose");

const needsSchema = new mongoose.Schema({
  donee: { type: mongoose.Schema.Types.ObjectId, ref: "donee", required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  fulfilled: { type: Boolean, default: false } // Whether the need is fulfilled
});

module.exports = mongoose.model("Needs", needsSchema);
