import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Service.css";
import PageLoader from "../components/PageLoader";

function Service() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  
  const [loading, setLoading] = useState(true);

  const workersSectionRef = useRef(null);
  

  const [userLocation, setUserLocation] = useState({
    lat: "",
    lon: "",
  });

  const [locationMessage, setLocationMessage] = useState("");

  const [reviewModal, setReviewModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const [reviewData, setReviewData] = useState({
    reviewer_name: "",
    rating: "",
    comment: "",
  });

  const [reviewMessage, setReviewMessage] = useState("");

  const renderStars = (rating) => {
    const value = Math.round(Number(rating || 0));
    return "★".repeat(value) + "☆".repeat(5 - value);
  };

  const fetchWorkers = async (serviceSlug = "", lat = "", lon = "") => {
    setLoading(true);

    try {
      let url = `${API_BASE_URL}/workers/?`;

      if (serviceSlug) {
        url += `service=${serviceSlug}&`;
      }

      if (searchQuery) {
        url += `search=${searchQuery}&`;
      }

      if (lat && lon) {
        url += `lat=${lat}&lon=${lon}`;
      }

      const res = await axios.get(url);

      const sortedWorkers = [...res.data].sort(
        (a, b) => Number(b.average_rating || 0) - Number(a.average_rating || 0)
      );

      setWorkers(sortedWorkers);
    } catch (error) {
      console.log("Worker fetch error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE_URL}/services/`);
        setServices(res.data);

        if (res.data.length > 0) {
          const firstSlug = res.data[0].slug;
          setSelectedService(firstSlug);

          const workerRes = await axios.get(
            `${API_BASE_URL}/workers/?service=${firstSlug}`
          );

          const sortedWorkers = [...workerRes.data].sort(
            (a, b) =>
              Number(b.average_rating || 0) - Number(a.average_rating || 0)
          );

          setWorkers(sortedWorkers);
        }
      } catch (error) {
        console.log("Initial service load error:", error);
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    

    loadData();
  }, [searchQuery]);

  const handleServiceClick = async (slug) => {
    setSelectedService(slug);

    await fetchWorkers(slug, userLocation.lat, userLocation.lon);

    setLoading(true);

    await fetchWorkers(
      slug,
      userLocation.lat,
      userLocation.lon
    );

    setTimeout(() => {
      setLoading(false);

      workersSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },);
  };  

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location not supported in this browser ❌");
      return;
    }

    setLocationMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);

        setUserLocation({ lat, lon });
        setLocationMessage("Location detected successfully ");

        if (selectedService) {
          fetchWorkers(selectedService, lat, lon);
        }
      },
      () => {
        setLocationMessage("Please allow location permission ");
      }
    );
  };

  const openReviewModal = (worker) => {
    setSelectedWorker(worker);
    setReviewModal(true);

    setReviewData({
      reviewer_name: "",
      rating: "",
      comment: "",
    });

    setReviewMessage("");
  };

  const closeReviewModal = () => {
    setReviewModal(false);
    setSelectedWorker(null);
  };

  const handleReviewChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const saveWorker = async (workerId) => {
  const phone = localStorage.getItem("userPhone");

  if (!phone) {
    alert("Please login again");
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/favorite-worker/`, {
      phone,
      worker: workerId,
    });

    alert("Worker saved ");
  } catch (error) {
    console.log("Save worker error:", error);
    alert("Already saved or backend error");
  }
};

  const submitReview = async (e) => {
    e.preventDefault();

    if (!reviewData.reviewer_name || !reviewData.rating) {
      setReviewMessage("Name and rating required ");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/reviews/add/`, {
        worker: selectedWorker.id,
        reviewer_name: reviewData.reviewer_name,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      setReviewMessage("Review added successfully ");

      setTimeout(() => {
        closeReviewModal();
        fetchWorkers(selectedService, userLocation.lat, userLocation.lon);
      }, 900);
    } catch (error) {
      console.log(error.response?.data);
      setReviewMessage("Review submit failed ");
    }
  };

if (loading) {
  return <PageLoader text="Loading Services..." />;
}

  return (
    <div className="service-page">
      <Navbar />

      <section className="service-hero">
        <div className="service-hero-content">
          <span>Local Sago Services</span>

          <h1>
            Find Verified Local Workers
            <br />
            Near You
          </h1>

          <p>Compare trusted workers by price, reviews, distance and ratings.</p>

          <button className="location-detect-btn" onClick={getUserLocation}>
             Detect My Location
          </button>

          {locationMessage && (
            <p className="location-status">{locationMessage}</p>
          )}
        </div>
      </section>

      <section className="service-content">
        <div className="section-title">
          <h2>Choose Service</h2>
          <p>Select a category and find verified nearby workers</p>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={
                selectedService === service.slug
                  ? "service-card active"
                  : "service-card"
              }
              onClick={() => handleServiceClick(service.slug)}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        <div
          className="workers-header"
          ref={workersSectionRef}
        >
          <div>
            <h2>Available Workers</h2>
            <p>Top-rated verified local workers are shown first</p>
          </div>

          <div className="filter-pill">⭐ Top Rated</div>
        </div>

        {loading ? (
          <div className="status-box">Loading workers...</div>
        ) : workers.length === 0 ? (
          <div className="status-box">
            No verified workers available for this service yet.
          </div>
        ) : (
          <div className="worker-grid">
            {workers.map((worker) => {
              const workerImage =
                worker.images && worker.images.length > 0
                  ? worker.images[0].image_url
                  : null;

              return (
                <div
                  className="worker-card clickable-worker-card"
                  key={worker.id}
                  onClick={() => navigate(`/worker/${worker.id}`)}
                >
                  <div className="worker-image-box">
                    {workerImage ? (
                      <img src={workerImage} alt={worker.name} />
                    ) : (
                      <div className="worker-placeholder">
                        {worker.name?.charAt(0)}
                      </div>
                    )}

                    <span className="verified-badge">Verified</span>
                  </div>

                  <div className="worker-body">
                    <div className="worker-title-row">
                      <div>
                        <h3>{worker.name}</h3>
                        <p>{worker.work_title}</p>
                      </div>

                      <div className="rating-box">
                        <strong>
                          {Number(worker.average_rating || 0).toFixed(1)}
                        </strong>
                        <span>{renderStars(worker.average_rating)}</span>
                        <small>
                          {worker.total_reviews || 0} Review
                          {(worker.total_reviews || 0) !== 1 ? "s" : ""}
                        </small>
                      </div>
                    </div>

                    <p className="worker-desc">{worker.work_description}</p>

                    <div className="worker-info-grid">
                      <div>
                        <span> Location</span>
                        <strong>{worker.area || worker.city}</strong>
                      </div>

                      <div>
                        <span> Charge</span>
                        <strong>₹{worker.service_charge}</strong>
                      </div>

                      <div>
                        <span> Experience</span>
                        <strong>{worker.experience} years</strong>
                      </div>

                      <div>
                        <span> Distance</span>
                        <strong>
                          {worker.distance_km ? (
                            <p>{worker.distance_km} KM Away</p>
                          ) : (
                            <p>Detect Location</p>
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="worker-actions">
                      <a
                        href={`tel:${worker.phone}`}
                        className="call-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                         call 
                      </a>

                      <a
                        href={`https://wa.me/91${worker.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="whatsapp-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                         WhatsApp
                      </a>
                    </div>

                    <button
                      type="button"
                      className="favorite-btn"
                      onClick={(e) =>{ 
                        e.stopPropagation(); 
                        saveWorker(worker.id)
                      }}
                    >
                       Save Worker
                    </button>

                    <button
                      className="review-btn"
                      onClick={(e) =>{ e.stopPropagation(); openReviewModal(worker)}}
                    >
                       Add Review
                    </button>

                    <button
                      type="button"
                      className="profile-btn"
                      onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/worker/${worker.id}`);
                     }}
                    >              
                      View Full Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {reviewModal && (
        <div className="review-overlay" onClick={closeReviewModal}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeReviewModal}>
              ×
            </button>

            <h2>Review {selectedWorker?.name}</h2>
            <p>Share your experience with this worker</p>

            <form onSubmit={submitReview}>
              <input
                type="text"
                name="reviewer_name"
                placeholder="Your Name"
                value={reviewData.reviewer_name}
                onChange={handleReviewChange}
              />

              <div className="star-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={
                      Number(reviewData.rating) >= star ? "star active" : "star"
                    }
                    onClick={() =>
                      setReviewData({
                        ...reviewData,
                        rating: star,
                      })
                    }
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                name="comment"
                placeholder="Write your review..."
                value={reviewData.comment}
                onChange={handleReviewChange}
              />

              {reviewMessage && (
                <div className="review-message">{reviewMessage}</div>
              )}

              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Service;