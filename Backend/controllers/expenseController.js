const db = require("../config/db");

/**
 * Add Expense
 */
exports.addExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, category, amount, expense_date } = req.body;

    if (!title || !amount || !expense_date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const query = `
      INSERT INTO expenses (user_id, title, category, amount, expense_date)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      userId,
      title,
      category,
      amount,
      expense_date,
    ]);

    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "DB error" });
  }
};

/**
 * Get All Expenses (User-wise)
 */
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT * FROM expenses
      WHERE user_id = ?
      ORDER BY expense_date DESC
    `;

    const [rows] = await db.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error("Fetch expenses error:", error);
    res.status(500).json({ message: "DB error" });
  }
};

/**
 * Delete Expense
 */
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;

    const query = `
      DELETE FROM expenses
      WHERE id = ? AND user_id = ?
    `;

    const [result] = await db.query(query, [
      expenseId,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "DB error" });
  }
};
