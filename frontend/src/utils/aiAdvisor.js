    export function getFinancialAdvice(salary, expenses, aiPrediction) {
    if (!salary || expenses.length === 0 || !aiPrediction) {
        return "Start adding expenses to get personalized financial advice.";
    }

    const totalExpenses = expenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
    );

    const foodSpend = expenses
        .filter((e) => e.category === "Food")
        .reduce((sum, e) => sum + Number(e.amount), 0);

    const foodPercent = ((foodSpend / totalExpenses) * 100).toFixed(1);

    // GPT-style advice (rule + NLP simulation)
    if (aiPrediction.predictedSavings < 0) {
        return `⚠️ You are likely to overspend this month.
    Your expenses are growing faster than your income.
    Try reducing discretionary spending like food or entertainment by at least 20%.`;
    }

    if (foodPercent > 35) {
        return `🍔 You are spending ${foodPercent}% of your expenses on food.
    Consider cooking at home more often.
    This alone can help you save a significant amount monthly.`;
    }

    if (aiPrediction.predictedSavings > salary * 0.3) {
        return `🎉 Excellent financial discipline!
    You are saving a good portion of your income.
    You can consider investing part of your savings for long-term growth.`;
    }

    return `👍 Your finances look stable.
    Track your expenses regularly and avoid unnecessary purchases to improve savings further.`;
    }
