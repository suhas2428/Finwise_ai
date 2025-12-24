export function predictSavings(salary, expenses) {
  if (!salary || expenses.length === 0) {
    return null;
  }

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const avgDailySpend = totalExpenses / day;
  const predictedMonthlyExpense = Math.round(
    avgDailySpend * totalDaysInMonth
  );

  const predictedSavings = Math.round(
    salary - predictedMonthlyExpense
  );

  let advice = "";

  if (predictedSavings > salary * 0.2) {
    advice = "Excellent! You are saving very well 🎉";
  } else if (predictedSavings > 0) {
    advice = "You are okay, but try reducing expenses 👍";
  } else {
    advice = "Warning! You may overspend this month ⚠️";
  }

  return {
    predictedMonthlyExpense,
    predictedSavings,
    advice,
  };
}
