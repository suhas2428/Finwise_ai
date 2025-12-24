const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;

    const result = await Tesseract.recognize(imagePath, "eng");
    const text = result.data.text;

    // Simple AI parsing
    const amountMatch = text.match(/₹?\s?(\d+[.,]?\d*)/);
    const dateMatch = text.match(
      /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/
    );

    res.json({
      rawText: text,
      amount: amountMatch ? amountMatch[1] : "",
      date: dateMatch ? dateMatch[1] : "",
    });
  } catch (err) {
    res.status(500).json({ message: "OCR failed" });
  }
});

module.exports = router;
