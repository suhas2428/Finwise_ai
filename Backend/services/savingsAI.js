const axios = require("axios");

async function predictSavingsAI(salary, totalExpenses) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8001/predict-savings",
      {
        salary,
        totalExpenses,
      },
      { timeout: 5000 }
    );

    return response.data;
  } catch (err) {
    console.error("❌ Flask AI error:", err.message);
    throw err;
  }
}

module.exports = { predictSavingsAI };
