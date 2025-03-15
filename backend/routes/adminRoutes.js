const express = require("express");
const router = express.Router();
const { addAdmin, adminController, doneeController, donorController } = require("../controllers/adminController");
const Donor = require("../models/donor");
const Donee = require("../models/donee");

router.post("/add", addAdmin);
router.post("/adminLogin", adminController.adminLogin);
router.get("/getAllAdmins", adminController.getAllAdmins);


router.get("/getAllDonors", donorController.getAllDonors);
router.get("/getDonorById/:id", donorController.getDonorById);
router.delete("/deleteDonor/:id", async (req, res) => {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: "Donor deleted successfully" });
  });
  



router.get("/getAllDonees", doneeController.getAllDonees);
router.get("/getDoneeById/:id", doneeController.getDoneeById);
router.delete("/deleteDonee/:id", async (req, res) => {
    await Donee.findByIdAndDelete(req.params.id);
    res.json({ message: "Donee deleted successfully" });
  });
router.patch("/verifyDonee/:id", async (req, res) => {
  try {
    const { verified } = req.body; // Accept true or false
    const donee = await Donee.findByIdAndUpdate(req.params.id, { verified }, { new: true });
    res.json(donee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});







module.exports = router;