import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./WorkerDetail.css";

function WorkerDetail() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [reportModal, setReportModal] = useState(false);
  const [reportData, setReportData] = useState({
    reason: "",
    description: "",
  });
  const [reportMessage, setReportMessage] = useState("");

  const renderStars = (rating) => {
    const value = Math.round(Number(rating || 0));
    return "★".repeat(value) + "☆".repeat(5 - value);
  };

  const submitWorkerReport = async (e) => {
    e.preventDefault();

    const phone = localStorage.getItem("userPhone");

    if (!phone) {
      setReportMessage("Please login again ");
      return;
    }

    if (!reportData.reason) {
      setReportMessage("Please select a reason ");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/report-worker/`, {
        worker: worker.id,
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
      console.log("Worker report error:", error.response?.data || error.message);
      setReportMessage("Report submit failed ❌");
    }
  };

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/workers/${id}/`);

        setWorker(res.data);

        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(res.data.images[0].image_url);
        }
      } catch (error) {
        console.log("Worker detail error:", error);
      }

      setLoading(false);
    };

    fetchWorker();
  }, [id]);

  if (loading) {
    return (
      <div className="worker-detail-page">
        <Navbar />
        <div className="detail-status">Loading worker profile...</div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="worker-detail-page">
        <Navbar />
        <div className="detail-status">Worker not found</div>
      </div>
    );
  }

  return (
    <div className="worker-detail-page">
      <Navbar />

      <section className="detail-hero">
        <button className="back-btn" onClick={() => navigate("/service")}>
          ← Back to Services
        </button>

        <div className="detail-hero-content">
          <div className="detail-avatar">
            {worker.images && worker.images.length > 0 ? (
              <img src={worker.images[0].image_url} alt={worker.name} />
            ) : (
              <span>{worker.name?.charAt(0)}</span>
            )}
          </div>

          <div>
            {worker.is_verified && (
              <span className="detail-badge">
                ✓ Verified Worker
              </span>
            )}
            <h1>{worker.name}</h1>
            <p>{worker.work_title}</p>

            <div className="detail-rating-summary">
              <strong>{Number(worker.average_rating || 0).toFixed(1)}</strong>
              <span>{renderStars(worker.average_rating)}</span>
              <small>{worker.total_reviews || 0} public reviews</small>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-grid">
          <div className="gallery-card">
            <h2>Work Gallery</h2>

            <div className="main-image">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Worker work"
                  onClick={() => setShowImagePopup(true)}
                  style={{ cursor: "zoom-in" }}
                />
              ) : (
                <div className="image-placeholder">
                  {worker.name?.charAt(0)}
                </div>
              )}
            </div>

            {worker.images && worker.images.length > 0 && (
              <div className="thumb-list">
                {worker.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt="work"
                    className={
                      selectedImage === img.image_url ? "thumb active" : "thumb"
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

          <div className="profile-card">
            <div className="profile-header">
              <h2>Worker Details</h2>

              <span className="profile-rating-pill">
                 {Number(worker.average_rating || 0).toFixed(1)}
              </span>
            </div>

            <p className="profile-desc">{worker.work_description}</p>

            <div className="detail-info-grid">
              <div>
                <small> Location</small>
                <strong>{worker.area || worker.city}</strong>
              </div>

              <div>
                <small> Service Charge</small>
                <strong>₹{worker.service_charge}</strong>
              </div>

              <div>
                <small> Experience</small>
                <strong>{worker.experience} years</strong>
              </div>

              <div>
                <small> Reviews</small>
                <strong>{worker.total_reviews || 0}</strong>
              </div>

              <div>
                <small>🟢 Availability</small>
                <strong>{worker.is_available ? "Available" : "Not Available"}</strong>
              </div>

              <div>
                <small> Distance</small>
                <strong>Nearby</strong>
              </div>
            </div>

            <div className="detail-actions">
              <a href={`tel:${worker.phone}`} className="detail-call">
                 Call Worker
              </a>

              <a
                href={`https://wa.me/91${worker.phone}`}
                target="_blank"
                rel="noreferrer"
                className="detail-whatsapp"
              >
                 WhatsApp
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="report-btn"
          onClick={() => setReportModal(true)}
        >
           Report Worker
        </button>

        <div className="reviews-card">
          <div className="reviews-title-row">
            <div>
              <h2>Public Reviews</h2>
              <p>Real customer feedback for this worker</p>
            </div>

            <div className="reviews-summary-pill">
              <strong>{Number(worker.average_rating || 0).toFixed(1)}</strong>
              <span>{renderStars(worker.average_rating)}</span>
            </div>
          </div>

          {worker.reviews && worker.reviews.length > 0 ? (
            <div className="reviews-grid">
              {worker.reviews.map((review) => (
                <div className="review-item" key={review.id}>
                  <div className="review-top">
                    <div>
                      <strong>{review.reviewer_name}</strong>
                      <span>{renderStars(review.rating)}</span>
                    </div>

                    <small>{Number(review.rating || 0).toFixed(1)}</small>
                  </div>

                  <p>{review.comment || "No comment added"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-review">
              <h3>No reviews yet</h3>
              <p>Be the first customer to share your experience with this worker.</p>
            </div>
          )}
        </div>

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
              <button className="report-close" onClick={() => setReportModal(false)}>
               ×
            </button>

            <h2>Report Worker</h2>
            <p>Tell us what is wrong with this worker profile.</p>

            <form onSubmit={submitWorkerReport}>
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
              <option value="fake">Fake Profile</option>
              <option value="wrong_contact">Wrong Contact</option>
              <option value="bad_behavior">Bad Behavior</option>
              <option value="spam">Spam</option>
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

          {reportMessage && <div className="report-message">{reportMessage}</div>}

          <button type="submit" className="report-submit">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  )}
        
      </section>
    </div>
  );
}

export default WorkerDetail;