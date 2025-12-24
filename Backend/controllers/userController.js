const db = require("../config/db");

exports.getProfile = async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, name, email, profile_image FROM users WHERE id = ?",
    [req.user.id]
  );
  res.json(rows[0]);
};

exports.updateProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  await db.query(
    "UPDATE users SET profile_image = ? WHERE id = ?",
    [imagePath, req.user.id]
  );

  res.json({ image: imagePath });
};
