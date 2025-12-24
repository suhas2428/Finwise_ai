import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import "../styles/charts.css";
import { predictSavings } from "../utils/aiSavings"; // 🤖 frontend AI

export default function Charts() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const salary = Number(localStorage.getItem("salary") || 0);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch {
      alert("Failed to load chart data");
    }
  };

  /* ================= CATEGORY DATA ================= */
  const categoryData = Object.values(
    expenses.reduce((acc, e) => {
      const cat = e.category || "Other";
      acc[cat] = acc[cat] || { category: cat, amount: 0 };
      acc[cat].amount += Number(e.amount || 0);
      return acc;
    }, {})
  );

  /* ================= MONTHLY DATA ================= */
  const monthlyData = Object.values(
    expenses.reduce((acc, e) => {
      const month = new Date(e.expense_date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      acc[month] = acc[month] || { month, amount: 0 };
      acc[month].amount += Number(e.amount || 0);
      return acc;
    }, {})
  );

  /* ================= AI PREDICTION DATA ================= */
  const aiPrediction =
    salary && expenses.length > 0
      ? predictSavings(salary, expenses)
      : null;

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const aiBarData =
    aiPrediction && salary
      ? [
          {
            name: "Actual Expense",
            amount: totalExpenses,
          },
          {
            name: "Predicted Expense",
            amount: aiPrediction.predictedMonthlyExpense,
          },
        ]
      : [];

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div>
      <Navbar />

      <div className="charts">
        <h1>Expense Analytics</h1>

        <div className="charts-grid">
          {/* ================= PIE CHART ================= */}
          <div className="chart-card">
            <h3>Category-wise Expenses</h3>

            {categoryData.length > 0 ? (
              <PieChart width={350} height={300}>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <p>No data available</p>
            )}
          </div>

          {/* ================= MONTHLY BAR ================= */}
          <div className="chart-card">
            <h3>Monthly Expenses</h3>

            {monthlyData.length > 0 ? (
              <BarChart width={450} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#2563eb" />
              </BarChart>
            ) : (
              <p>No data available</p>
            )}
          </div>

          {/* ================= AI PREDICTION BAR ================= */}
          <div className="chart-card">
            <h3>AI: Actual vs Predicted Expense 🤖</h3>

            {aiBarData.length > 0 ? (
              <BarChart width={450} height={300} data={aiBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            ) : (
              <p>Add salary & expenses to see AI prediction</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
