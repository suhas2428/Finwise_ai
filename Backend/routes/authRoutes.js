const express = require("express");
const router = express.Router();

const {
  signup,
  verifyOtp,
  login,
} = require("../controllers/authController");

router.post("/signup", signup);        // send OTP
router.post("/verify-otp", verifyOtp); // verify OTP
router.post("/login", login);          // login

module.exports = router;
