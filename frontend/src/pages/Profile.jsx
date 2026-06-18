import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const savedUser =
        JSON.parse(localStorage.getItem("localSagoUser")) || {};

    const savedPhone =
        localStorage.getItem("userPhone") || "";

    const data = {
        name: savedUser.name || "",
        phone: savedPhone || "",
        email: savedUser.email || "",
    };

    setTimeout(() => {
        setProfileData(data);
    }, 0);

    }, []);

    const handleChange = (e) => {
        setProfileData({
        ...profileData,
        [e.target.name]: e.target.value,
        });

        setMessage("");
    };

    const saveProfile = (e) => {
        e.preventDefault();

        if (!profileData.name.trim()) {
        setMessage("Name is required ❌");
        return;
    }

    if (!profileData.phone.trim() || profileData.phone.length !== 10) {
      setMessage("Valid 10 digit phone number is required ❌");
      return;
    }

    if (!profileData.email.trim()) {
      setMessage("Email is required ❌");
      return;
    }

    const oldUser = JSON.parse(localStorage.getItem("localSagoUser")) || {};

    const updatedUser = {
      ...oldUser,
      name: profileData.name,
      phone: profileData.phone,
      email: profileData.email,
    };

    localStorage.setItem("localSagoUser", JSON.stringify(updatedUser));
    localStorage.setItem("userPhone", profileData.phone);

    setMessage("Profile updated successfully ✅");
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <Navbar />

      <section className="profile-hero">
        <h1>My Profile</h1>
        <p>Manage your Local Sago account details.</p>
      </section>

      <section className="profile-content">
        <div className="profile-card-main">
          <div className="profile-avatar">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
          </div>

          <h2>{profileData.name || "Local Sago User"}</h2>
          <p>{profileData.email || "Email not added"}</p>

          <button
            type="button"
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>

          {message && <div className="profile-message">{message}</div>}

          {isEditing ? (
            <form className="profile-edit-form" onSubmit={saveProfile}>
              <div className="profile-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="profile-form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  maxLength="10"
                />
              </div>

              <div className="profile-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>

              <button type="submit" className="save-profile-btn">
                Save Profile
              </button>
            </form>
          ) : (
            <div className="profile-info-grid">
              <div>
                <span>Name</span>
                <strong>{profileData.name || "Not added"}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{profileData.phone || "Not added"}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{profileData.email || "Not added"}</strong>
              </div>

              <div>
                <span>Account Status</span>
                <strong>Active ✅</strong>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Profile;