import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.password) {
      setMessage("Please fill all fields ❌");
      return;
    }

    if (formData.phone.length !== 10) {
      setMessage("Phone number must be 10 digits ❌");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be minimum 6 characters ❌");
      return;
    }

    localStorage.setItem("localSagoUser", JSON.stringify(formData));
    localStorage.setItem("userPhone", formData.phone);

    setMessage("Account created successfully ✅");

    setTimeout(() => {
      navigate("/login");
    }, 900);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Local Sago</h1>
        <p>Trusted Local Services</p>
        <span>Fast • Secure • Nearby</span>
      </div>

      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Local Sago today</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {message && <p className="auth-message">{message}</p>}

          <button type="submit" className="auth-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;