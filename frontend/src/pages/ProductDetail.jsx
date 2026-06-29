import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ProductDetail.css";

function ProductDetail() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false);

  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    reason: "",
    description: "",
  });
  const [reportMessage, setReportMessage] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}/`);

        setProduct(res.data);

        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(res.data.images[0].image_url);
        }
      } catch (error) {
        console.log("Product detail error:", error);
      }

      setDataLoaded(true);
    };

    fetchProduct();
  }, [id]);

  const submitProductReport = async (e) => {
    e.preventDefault();

    const phone = localStorage.getItem("userPhone");

    if (!phone) {
      setReportMessage("Please login again ❌");
      return;
    }

    if (!reportData.reason) {
      setReportMessage("Please select a reason ❌");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/report-product/`, {
        product: product.id,
        reporter_phone: phone,
        reason: reportData.reason,
        description: reportData.description,
      });

      setReportMessage("Report submitted successfully ✅");

      setTimeout(() => {
        setReportModal(false);
        setReportData({
          reason: "",
          description: "",
        });
        setReportMessage("");
      }, 1000);
    } catch (error) {
      console.log("Product report error:", error.response?.data || error.message);
      setReportMessage("Report submit failed ❌");
    }
  };

  if (!dataLoaded) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-status">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="product-detail-status">Product not found</div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navbar />

      <section className="product-detail-hero">
        <button
          className="product-back-btn"
          onClick={() => navigate("/product")}
        >
          ← Back to Products
        </button>

        <div className="product-detail-hero-content">
          <div className="product-detail-avatar">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0].image_url} alt={product.title} />
            ) : (
              <span>{product.title?.charAt(0)}</span>
            )}
          </div>

          <div>
            {product.is_verified && (
              <span className="product-detail-badge">✓ Verified Product</span>
            )}

            <h1>{product.title}</h1>
            <p>{product.category_name}</p>
          </div>
        </div>
      </section>

      <section className="product-detail-section">
        <div className="product-detail-grid">
          <div className="product-gallery-card">
            <h2>Product Gallery</h2>

            <div className="product-main-image">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Product"
                  onClick={() => setShowImagePopup(true)}
                  style={{ cursor: "zoom-in" }}
                />
              ) : (
                <div className="product-image-placeholder">
                  {product.title?.charAt(0)}
                </div>
              )}
            </div>

            {product.images && product.images.length > 0 && (
              <div className="product-thumb-list">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt="thumb"
                    className={
                      selectedImage === img.image_url
                        ? "product-thumb active"
                        : "product-thumb"
                    }
                    onClick={() => {
                      setSelectedImage(img.image_url);
                      setShowImagePopup(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-profile-card">
            <div className="product-profile-top">
              <h2>₹{product.price}</h2>
              <span>{product.condition}</span>
            </div>

            <p className="product-full-desc">{product.description}</p>

            <div className="product-detail-info-grid">
              <div>
                <small> Location</small>
                <strong>{product.area || product.city}</strong>
              </div>

              <div>
                <small> Category</small>
                <strong>{product.category_name}</strong>
              </div>

              <div>
                <small> Seller</small>
                <strong>{product.seller_name}</strong>
              </div>

              <div>
                <small> Distance</small>
                <strong>
                  {product.distance_km !== null &&
                  product.distance_km !== undefined
                    ? `${product.distance_km} km away`
                    : "Nearby"}
                </strong>
              </div>

              <div>
                <small>🟢 Availability</small>
                <strong>
                  {product.is_available ? "Available" : "Unavailable"}
                </strong>
              </div>

              <div>
                <small> Status</small>
                <strong>{product.is_sold ? "Sold" : "Ready to Sell"}</strong>
              </div>
            </div>

            <div className="product-detail-actions">
              <a
                href={`tel:${product.seller_phone}`}
                className="product-detail-call"
              >
                 Call Seller
              </a>

              <a
                href={`https://wa.me/91${product.seller_phone}`}
                target="_blank"
                rel="noreferrer"
                className="product-detail-whatsapp"
              >
                 WhatsApp
              </a>
            </div>

            <button
              type="button"
              className="report-btn"
              onClick={() => setReportModal(true)}
            >
               Report Product
            </button>
          </div>
        </div>
      </section>

      {showImagePopup && (
        <div
          className="image-popup-overlay"
          onClick={() => setShowImagePopup(false)}
        >
          <div
            className="image-popup-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-popup-close"
              onClick={() => setShowImagePopup(false)}
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt="Full View"
              className="image-popup-img"
            />
          </div>
        </div>
      )}

      {reportModal && (
        <div className="report-overlay" onClick={() => setReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="report-close"
              onClick={() => setReportModal(false)}
            >
              ×
            </button>

            <h2>Report Product</h2>
            <p>Tell us what is wrong with this product.</p>

            <form onSubmit={submitProductReport}>
              <select
                value={reportData.reason}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    reason: e.target.value,
                  })
                }
              >
                <option value="">Select Reason</option>
                <option value="fake">Fake Product</option>
                <option value="wrong_info">Wrong Information</option>
                <option value="spam">Spam</option>
                <option value="scam">Scam</option>
                <option value="other">Other</option>
              </select>

              <textarea
                placeholder="Write more details..."
                value={reportData.description}
                onChange={(e) =>
                  setReportData({
                    ...reportData,
                    description: e.target.value,
                  })
                }
              />

              {reportMessage && (
                <div className="report-message">{reportMessage}</div>
              )}

              <button type="submit" className="report-submit">
                Submit Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;