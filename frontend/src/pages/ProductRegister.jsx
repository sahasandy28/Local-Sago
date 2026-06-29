import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ProductRegister.css";

function ProductRegister() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [errors, setErrors] = useState({});
  const [locationLoading, setLocationLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    seller_name: "",
    seller_phone: "",
    title: "",
    description: "",
    price: "",
    condition: "new",
    city: "",
    area: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/product-categories/`);
        setCategories(res.data);
      } catch (error) {
        console.log("Category error:", error);
        setMessage("Product categories loading failed ❌");
        setMessageType("error");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    setErrors({ ...errors, images: "" });
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
    const newErrors = {};

    if (!formData.category) newErrors.category = "Select product category";
    if (!formData.seller_name.trim()) newErrors.seller_name = "Seller name is required";
    if (!formData.seller_phone.trim()) newErrors.seller_phone = "Seller phone is required";
    if (formData.seller_phone.length < 10) newErrors.seller_phone = "Enter valid phone number";
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.latitude || !formData.longitude) newErrors.location = "Please select location";
    if (images.length === 0) newErrors.images = "Please upload at least one product image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      category: "",
      seller_name: "",
      seller_phone: "",
      title: "",
      description: "",
      price: "",
      condition: "new",
      city: "",
      area: "",
      address: "",
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
      const productData = new FormData();

      Object.keys(formData).forEach((key) => {
        productData.append(key, formData[key]);
      });

      images.forEach((image) => {
        productData.append("images", image);
      });

      await axios.post(`${API_BASE_URL}/products/register/`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Product submitted successfully. Waiting for admin verification ✅");
      setMessageType("success");
      setErrors({});
      resetForm();
    } catch (error) {
      console.log("Product submit error:", error.response?.data || error.message);
      setMessage("Product submit failed. Please check details ❌");
      setMessageType("error");
    }
  };

  return (
    <div className="product-register-page">
      <Navbar />

      <section className="product-register-hero">
        <h1>Add Your Local Product</h1>
        <p>Sell your product to nearby customers after admin verification.</p>
      </section>

      <section className="product-form-section">
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>Product Details</h2>

          <div className="image-upload-box">
            <label htmlFor="productImages">📸 Upload Product Images</label>

            <input
              id="productImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />

            {errors.images && <span>{errors.images}</span>}

            {previewImages.length > 0 && (
              <div className="image-preview-grid">
                {previewImages.map((img, index) => (
                  <img src={img} alt="Product preview" key={index} />
                ))}
              </div>
            )}
          </div>

          <div className="product-form-grid">
            <div className="form-group">
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Product Category</option>
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span>{errors.category}</span>}
            </div>

            <div className="form-group">
              <input
                name="seller_name"
                placeholder="Seller Name"
                value={formData.seller_name}
                onChange={handleChange}
              />
              {errors.seller_name && <span>{errors.seller_name}</span>}
            </div>

            <div className="form-group">
              <input
                name="seller_phone"
                placeholder="Seller Phone Number"
                value={formData.seller_phone}
                onChange={handleChange}
              />
              {errors.seller_phone && <span>{errors.seller_phone}</span>}
            </div>

            <div className="form-group">
              <input
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span>{errors.title}</span>}
            </div>

            <div className="form-group">
              <input
                name="price"
                placeholder="Price ₹"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && <span>{errors.price}</span>}
            </div>

            <div className="form-group">
              <select name="condition" value={formData.condition} onChange={handleChange}>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
            </div>

            <div className="form-group">
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && <span>{errors.city}</span>}
            </div>

            <div className="form-group">
              <input
                name="area"
                placeholder="Area"
                value={formData.area}
                onChange={handleChange}
              />
              {errors.area && <span>{errors.area}</span>}
            </div>

            <div className="form-group full">
              <input
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && <span>{errors.address}</span>}
            </div>
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Describe your product condition, details and usage..."
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span>{errors.description}</span>}
          </div>

          <div className="location-box">
            <button type="button" onClick={getCurrentLocation}>
              {locationLoading ? "Getting Location..." : "📍 Use Current Location"}
            </button>

            {formData.latitude && <p>Location selected ✅</p>}
            {errors.location && <span>{errors.location}</span>}
          </div>

          {message && <div className={`message-box ${messageType}`}>{message}</div>}

          <button type="submit" className="submit-btn">
            Submit Product for Verification
          </button>
        </form>
      </section>
    </div>
  );
}

export default ProductRegister;