const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doneeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: false },
  location: {
    latitude: { type: Number, required: false },  // Optional latitude
    longitude: { type: Number, required: false }, // Optional longitude
  },
  verified: { type: Boolean, default: false },
});

// Hash password before saving
doneeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Donee", doneeSchema);
