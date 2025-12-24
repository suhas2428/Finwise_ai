const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  getProfile,
  updateProfileImage,
} = require("../controllers/userController");

router.get("/profile", auth, getProfile);

router.post(
  "/profile-image",
  auth,
  upload.single("image"),
  updateProfileImage
);

module.exports = router;
