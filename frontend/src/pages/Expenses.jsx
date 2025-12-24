import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/expenses.css";
import { autoCategorize } from "../utils/aiCategory";

const formatOCRDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length !== 3) return "";
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const fileRef = useRef(null);
  const [loadingOCR, setLoadingOCR] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
      localStorage.setItem("expenses", JSON.stringify(res.data));
    } catch {
      alert("Failed to load expenses");
    }
  };

  const uploadReceipt = async () => {
    const file = fileRef.current.files[0];
    if (!file) {
      alert("Please select a receipt image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoadingOCR(true);
      const res = await API.post("/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.amount) setAmount(res.data.amount);
      if (res.data.date) setDate(formatOCRDate(res.data.date));

      alert("Receipt scanned. Review and add expense.");
    } catch {
      alert("OCR failed");
    } finally {
      setLoadingOCR(false);
    }
  };

  const addExpense = async () => {
    if (!title || !amount || !date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await API.post("/expenses", {
        title,
        category,
        amount,
        expense_date: date,
      });

      setTitle("");
      setCategory("");
      setAmount("");
      setDate("");

      fetchExpenses();
    } catch {
      alert("Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="expenses">
        <h1>Expenses</h1>

        {/* OCR */}
        <div className="expense-form">
          <input type="file" ref={fileRef} accept="image/*" />
          <button onClick={uploadReceipt}>
            {loadingOCR ? "Scanning..." : "Scan Receipt"}
          </button>
        </div>

        {/* Add Expense */}
        <div className="expense-form">
          <input
            placeholder="Title (Pizza, Uber, Amazon)"
            value={title}
            onChange={(e) => {
              const v = e.target.value;
              setTitle(v);
              setCategory(autoCategorize(v));
            }}
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button onClick={addExpense}>Add Expense</button>
        </div>

        {/* Table */}
        <div className="expense-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{e.category || "Other"}</td>
                  <td>₹{e.amount}</td>
                  <td>{e.expense_date}</td>
                  <td>
                    <button
                      className="delete"
                      onClick={() => deleteExpense(e.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty">
                    No expenses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
