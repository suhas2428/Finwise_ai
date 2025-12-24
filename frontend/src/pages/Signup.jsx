import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/auth.css";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // STEP 1: SEND OTP
  const sendOtp = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      await API.post("/auth/signup", {
        name,
        email,
        password,
      });
      alert("OTP sent to email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // STEP 2: VERIFY OTP
  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      await API.post("/auth/verify-otp", {
        email,
        otp,
      });
      alert("Signup successful. Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{step === 1 ? "Create Account" : "Verify OTP"}</h2>

        {step === 1 && (
          <>
            <input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={sendOtp}>Send OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp}>Verify OTP</button>
          </>
        )}

        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
