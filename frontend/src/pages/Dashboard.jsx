import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/dashboard.css";
import { getUserIdFromToken } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  // 🔐 Auth check
  useEffect(() => {
    if (!localStorage.getItem("token") || !userId) {
      navigate("/");
    }
  }, [userId, navigate]);

  // 💰 Salary (per user)
  const [salary, setSalary] = useState(() => {
    const saved = localStorage.getItem(`salary_${userId}`);
    return saved ? Number(saved) : "";
  });

  const [editingSalary, setEditingSalary] = useState(false);
  const [tempSalary, setTempSalary] = useState("");
  const [expenses, setExpenses] = useState([]);

  // 🤖 AI state
  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // 📦 Fetch expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data || []);
    } catch {
      console.error("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 💾 Save / Update salary
  const saveSalary = () => {
    const value = Number(tempSalary);
    if (!value || value <= 0) {
      alert("Enter a valid salary");
      return;
    }

    localStorage.setItem(`salary_${userId}`, value);
    setSalary(value);
    setEditingSalary(false);
    setTempSalary("");
    setAiResult(null); // reset AI on salary change
  };

  // 📊 Calculations
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  const remaining = salary ? salary - totalExpenses : 0;

  const savingsPercent =
    salary > 0
      ? Math.max(0, ((remaining / salary) * 100).toFixed(1))
      : 0;

  // 🤖 Run ML + Email Alert
  const runAI = async () => {
    if (!salary || totalExpenses === 0) return;

    try {
      setLoadingAI(true);

      const res = await API.post("/ai/analyze", {
        salary,
        totalExpenses,
      });

      setAiResult(res.data);
    } catch {
      alert("AI analysis failed");
    } finally {
      setLoadingAI(false);
    }
  };

  // Auto-run AI safely
  useEffect(() => {
    if (salary && expenses.length > 0) {
      runAI();
    }
  }, [salary, expenses]);

  return (
    <div>
      <Navbar />

      <div className="dashboard">
        <h1>Dashboard</h1>

        {/* 💰 ASK SALARY FIRST */}
        {!salary && (
          <div className="salary-card">
            <h3>Set Your Monthly Salary</h3>
            <p>This helps FinWise AI analyze your spending</p>

            <div className="salary-input">
              <input
                type="number"
                placeholder="Enter monthly salary"
                value={tempSalary}
                onChange={(e) => setTempSalary(e.target.value)}
              />
              <button onClick={saveSalary}>Save</button>
            </div>
          </div>
        )}

        {/* 📊 DASHBOARD */}
        {salary && (
          <>
            <div className="card-grid">
              <div className="card">
                <p>Monthly Salary</p>
                <h2>₹{salary}</h2>

                {!editingSalary ? (
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setTempSalary(salary);
                      setEditingSalary(true);
                    }}
                  >
                    Edit Salary
                  </button>
                ) : (
                  <div className="edit-salary">
                    <input
                      type="number"
                      value={tempSalary}
                      onChange={(e) => setTempSalary(e.target.value)}
                    />
                    <button onClick={saveSalary}>Save</button>
                  </div>
                )}
              </div>

              <div className="card">
                <p>Total Expenses</p>
                <h2>₹{totalExpenses}</h2>
              </div>

              <div className="card">
                <p>Remaining Balance</p>
                <h2 className={remaining >= 0 ? "green" : "red"}>
                  ₹{remaining}
                </h2>
              </div>

              <div className="card">
                <p>Savings</p>
                <h2>{savingsPercent}%</h2>
              </div>
            </div>

            {/* 🤖 AI STATUS */}
            {loadingAI && (
              <div className="ai-card">
                <p>Running AI analysis…</p>
              </div>
            )}

            {/* 🤖 AI RESULT */}
            {aiResult && (
              <div className={`ai-card ${aiResult.alertType}`}>
                <h3>AI Financial Alert 🤖</h3>

                <p>
                  <b>Predicted Monthly Expense:</b> ₹
                  {aiResult.predictedMonthlyExpense}
                </p>

                <p>
                  <b>Predicted Savings:</b>{" "}
                  <span
                    className={
                      aiResult.predictedSavings >= 0 ? "green" : "red"
                    }
                  >
                    ₹{aiResult.predictedSavings}
                  </span>
                </p>

                {aiResult.alertType === "danger" && (
                  <p className="alert danger">
                    🚨 Salary limit exceeded! Warning email sent.
                  </p>
                )}

                {aiResult.alertType === "caution" && (
                  <p className="alert caution">
                    ⚠️ You are close to exceeding salary. Caution email sent.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
