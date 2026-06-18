import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("localSagoUser"));

    if (!savedUser) {
      setMessage("No account found. Please signup first ❌");
      return;
    }

    if (
      savedUser.email === loginData.email &&
      savedUser.password === loginData.password
    ) {
      localStorage.setItem("accessToken", "local-demo-token");
      localStorage.setItem("userPhone", savedUser.phone || "");
      localStorage.setItem("localSagoUser", JSON.stringify(savedUser));

      setMessage("Login successful ✅");

      setTimeout(() => {
        navigate("/home");
      }, 700);
    } else {
      setMessage("Invalid email or password ❌");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Local Sago</h1>
        <p>Welcome Back</p>
        <span>Find trusted local workers near you</span>
      </div>

      <div className="auth-card">
        <h2>Login</h2>
        <p className="auth-subtitle">Access your Local Sago account</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={handleChange}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
            />

            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don’t have an account? <Link to="/">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;