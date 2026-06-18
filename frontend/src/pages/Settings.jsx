import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("localSagoUser"));

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("localSahaTheme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("localSahaTheme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("localSahaTheme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("localSagoUser");
    navigate("/login");
  };

  return (
    <div className="settings-page">
      <Navbar />

      <section className="settings-hero">
        <span>Local Sago Settings</span>
        <h1>Manage Your Account</h1>
        <p>Control your profile, app theme and account preferences.</p>
      </section>

      <section className="settings-content">
        <div className="settings-grid">
          <div className="settings-profile-card">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>

            <h2>{user?.name || "Local Sago User"}</h2>
            <p>{user?.email || "No email available"}</p>
            <span className="account-badge">Active Account</span>
          </div>

          <div className="settings-card">
            <h3>🎨 App Theme</h3>

            <div className="theme-toggle-row">
              <div>
                <strong>{darkMode ? "Dark Mode" : "Light Mode"}</strong>
                <p>Change the overall Local Sago app appearance.</p>
              </div>

              <button
                className={darkMode ? "theme-switch active" : "theme-switch"}
                onClick={() => setDarkMode(!darkMode)}
              >
                <span></span>
              </button>
            </div>
          </div>

          <div className="settings-card">
            <h3>👤 Profile Information</h3>

            <div className="setting-row">
              <span>Name</span>
              <strong>{user?.name || "Not available"}</strong>
            </div>

            <div className="setting-row">
              <span>Email</span>
              <strong>{user?.email || "Not available"}</strong>
            </div>

            <div className="setting-row">
              <span>Account Type</span>
              <strong>Customer / Seller / Worker</strong>
            </div>
          </div>

          <div className="settings-card">
            <h3>🔐 Security</h3>

            <div className="setting-row">
              <span>Login Status</span>
              <strong>
                {localStorage.getItem("accessToken") ? "Logged In" : "Logged Out"}
              </strong>
            </div>

            <div className="setting-row">
              <span>Authentication</span>
              <strong>JWT Enabled</strong>
            </div>
          </div>

          <div className="settings-card danger-card">
            <h3>🚪 Account Actions</h3>
            <p>Logout will remove your current session from this browser.</p>

            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;