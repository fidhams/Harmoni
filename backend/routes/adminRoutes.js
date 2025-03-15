const express = require("express");
const router = express.Router();
const { addAdmin, adminController, doneeController, donorController } = require("../controllers/adminController");

router.post("/add", addAdmin);
router.post("/adminLogin", adminController.adminLogin);
router.get("/getAllAdmins", adminController.getAllAdmins);
router.get("/getAllDonors", donorController.getAllDonors);
router.get("/getDonorById/:id", donorController.getDonorById);
router.get("/getAllDonees", doneeController.getAllDonees);
router.get("/getDoneeById/:id", doneeController.getDoneeById);

module.exports = router;