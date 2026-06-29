import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./WorkerRegister.css";

function WorkerRegister() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    name: "",
    phone: "",
    email: "",
    work_title: "",
    experience: "",
    service_charge: "",
    city: "",
    area: "",
    address: "",
    work_description: "",
    latitude: "",
    longitude: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/services/`);
        setCategories(res.data);
      } catch (error) {
        console.log("Category error:", error);
        setMessage("Service categories loading failed ❌");
        setMessageType("error");
      }
    };

    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setMessage("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    setFieldErrors({ ...fieldErrors, images: "" });
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        });

        setMessage("Location selected successfully ✅");
        setMessageType("success");
        setLocationLoading(false);
      },
      () => {
        setMessage("Please allow location permission ❌");
        setMessageType("error");
        setLocationLoading(false);
      }
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.category) errors.category = "Please select service category";
    if (!formData.name.trim()) errors.name = "Worker name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (formData.phone.length < 10) errors.phone = "Enter valid phone number";
    if (!formData.work_title.trim()) errors.work_title = "Work title is required";
    if (!formData.experience) errors.experience = "Experience is required";
    if (!formData.service_charge) errors.service_charge = "Service charge is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.area.trim()) errors.area = "Area is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.work_description.trim()) errors.work_description = "Work description is required";
    if (!formData.latitude || !formData.longitude) errors.location = "Please select current location";
    if (images.length === 0) errors.images = "Please upload at least one work photo";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      category: "",
      name: "",
      phone: "",
      email: "",
      work_title: "",
      experience: "",
      service_charge: "",
      city: "",
      area: "",
      address: "",
      work_description: "",
      latitude: "",
      longitude: "",
    });

    setImages([]);
    setPreviewImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix the highlighted errors ❌");
      setMessageType("error");
      return;
    }

    try {
      const workerData = new FormData();

      Object.keys(formData).forEach((key) => {
        workerData.append(key, formData[key]);
      });

      images.forEach((image) => {
        workerData.append("images", image);
      });

      await axios.post(`${API_BASE_URL}/workers/register/`, workerData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Worker profile submitted successfully. Waiting for admin verification ✅");
      setMessageType("success");
      setFieldErrors({});
      resetForm();
    } catch (error) {
      console.log("Backend error:", error.response?.data || error.message);
      setMessage("Worker submit failed. Please check backend image upload support ❌");
      setMessageType("error");
    }
  };

  return (
    <div className="worker-register-page">
      <Navbar />

      <section className="worker-register-hero">
        <h1>Register Your Service Profile</h1>
        <p>Add your work details, photos and start getting local customers after verification.</p>
      </section>

      <section className="worker-form-section">
        <form className="worker-form" onSubmit={handleSubmit}>
          <h2>Worker Details</h2>

          <div className="image-upload-box">
            <label htmlFor="workerImages">📸 Upload Work Photos</label>

            <input
              id="workerImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            {fieldErrors.images && <span>{fieldErrors.images}</span>}

            {previewImages.length > 0 && (
              <div className="image-preview-grid">
                {previewImages.map((img, index) => (
                  <img src={img} alt="Work preview" key={index} />
                ))}
              </div>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Service Category</option>
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>{cat.name}</option>
                ))}
              </select>
              {fieldErrors.category && <span>{fieldErrors.category}</span>}
            </div>

            <div className="form-group">
              <input name="name" placeholder="Worker Name" value={formData.name} onChange={handleChange} />
              {fieldErrors.name && <span>{fieldErrors.name}</span>}
            </div>

            <div className="form-group">
              <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
              {fieldErrors.phone && <span>{fieldErrors.phone}</span>}
            </div>

            <div className="form-group">
              <input name="email" placeholder="Email Optional" value={formData.email} onChange={handleChange} />
              {fieldErrors.email && <span>{fieldErrors.email}</span>}
            </div>

            <div className="form-group">
              <input name="work_title" placeholder="Work Title" value={formData.work_title} onChange={handleChange} />
              {fieldErrors.work_title && <span>{fieldErrors.work_title}</span>}
            </div>

            <div className="form-group">
              <input name="experience" placeholder="Experience in years" value={formData.experience} onChange={handleChange} />
              {fieldErrors.experience && <span>{fieldErrors.experience}</span>}
            </div>

            <div className="form-group">
              <input name="service_charge" placeholder="Service Charge ₹" value={formData.service_charge} onChange={handleChange} />
              {fieldErrors.service_charge && <span>{fieldErrors.service_charge}</span>}
            </div>

            <div className="form-group">
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
              {fieldErrors.city && <span>{fieldErrors.city}</span>}
            </div>

            <div className="form-group">
              <input name="area" placeholder="Area" value={formData.area} onChange={handleChange} />
              {fieldErrors.area && <span>{fieldErrors.area}</span>}
            </div>

            <div className="form-group">
              <input name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} />
              {fieldErrors.address && <span>{fieldErrors.address}</span>}
            </div>
          </div>

          <div className="form-group">
            <textarea
              name="work_description"
              placeholder="Describe your work experience..."
              value={formData.work_description}
              onChange={handleChange}
            />
            {fieldErrors.work_description && <span>{fieldErrors.work_description}</span>}
          </div>

          <div className="location-box">
            <button type="button" onClick={getCurrentLocation}>
              {locationLoading ? "Getting Location..." : "📍 Use Current Location"}
            </button>
            {formData.latitude && <p>Location selected ✅</p>}
            {fieldErrors.location && <span>{fieldErrors.location}</span>}
          </div>

          {message && <div className={`message-box ${messageType}`}>{message}</div>}

          <button type="submit" className="submit-btn">
            Submit for Verification
          </button>
        </form>
      </section>
    </div>
  );
}

export default WorkerRegister;