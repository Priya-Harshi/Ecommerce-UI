import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(email, password);

      console.log("LOGIN RESULT:", result);
      console.log("USER ROLE:", result.role);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result));

      setMessage("Login successful!");

      if (result.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🛍️ E-Commerce</h1>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">Login to continue shopping.</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
