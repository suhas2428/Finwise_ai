const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { setIncome, getIncome } = require("../controllers/incomeController");

router.post("/", authMiddleware, setIncome);
router.get("/", authMiddleware, getIncome);

module.exports = router;
