//The Need model tracks specific needs posted by organizations.
const mongoose = require("mongoose");

const NeedSchema = new mongoose.Schema({
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fulfilled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Need", NeedSchema);
