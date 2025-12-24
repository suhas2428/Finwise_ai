const db = require("../config/db");

exports.setIncome = (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;

    const deleteQuery = "DELETE FROM income WHERE user_id = ?";
    const insertQuery = "INSERT INTO income (user_id, amount) VALUES (?, ?)";

    db.query(deleteQuery, [userId], () => {
        db.query(insertQuery, [userId, amount], (err) => {
            if (err) return res.status(500).json({ message: "DB error" });

            res.json({ message: "Income updated" });
        });
    });
};

exports.getIncome = (req, res) => {
    const userId = req.user.id;

    const query = "SELECT amount FROM income WHERE user_id = ?";

    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });

        res.json(result[0] || { amount: 0 });
    });
};
    