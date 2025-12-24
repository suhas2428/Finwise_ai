const { predictSavingsAI } = require("../services/savingsAI");

exports.analyzeSavings = async (req, res) => {
  try {
    const { salary, totalExpenses } = req.body;

    const aiResult = await predictSavingsAI(salary, totalExpenses);

    // Alert logic
    let alertType = null;
    if (aiResult.predictedSavings < 0) alertType = "danger";
    else if (aiResult.predictedSavings < salary * 0.2) alertType = "caution";

    res.json({
      ...aiResult,
      alertType,
    });
  } catch (error) {
    console.error("❌ AI CONTROLLER ERROR:", error.message);
    res.status(500).json({ message: "AI failed" });
  }
};
