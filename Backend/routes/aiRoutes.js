const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { analyzeSavings } = require("../controllers/aicontroller");

router.post("/analyze", authMiddleware, analyzeSavings);

module.exports = router;
