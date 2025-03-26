const express = require("express");
const { donorlogin, donorsignup, doneelogin, doneesignup, upload } = require("../controllers/authController");
const router = express.Router();

router.post("/donor/signup", donorsignup);
router.post("/donor/login", donorlogin);
router.post("/donee/signup", upload.single("registrationCertificate"), doneesignup);
router.post("/donee/login", doneelogin);



module.exports = router;
