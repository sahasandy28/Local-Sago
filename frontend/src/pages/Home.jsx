import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import NearbyWorkers from "../components/NearbyWorkers";
import TopRatedWorkers from "../components/TopRatedWorkers";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [stats, setStats] = useState({
    verified_workers: 0,
    nearby_services: 0,
    local_products: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/home-stats/`);
        setStats(res.data);
      } catch (error) {
        console.log("Home stats error:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      <section className="home-hero">
        <div className="home-left">
          <span className="home-badge">Verified Local Service Platform</span>

          <h1>
            Find Trusted Local Workers
            <br />
            Near Your Area
          </h1>

          <p>
            Local Sago helps people connect with verified nearby workers for
            home services, repairs and daily local needs. You can also explore
            useful products from local sellers.
          </p>

          <div className="home-actions">
            <button
              className="primary-home-btn"
              onClick={() => navigate("/service")}
            >
              Explore Services
            </button>

            <button
              className="secondary-home-btn"
              onClick={() => navigate("/product")}
            >
              View Products
            </button>
          </div>

          <div className="home-points">
            <div>
              <strong>{stats.verified_workers}+</strong>
              <span>Verified Workers</span>
            </div>

            <div>
              <strong>{stats.nearby_services}+</strong>
              <span>Nearby Services</span>
            </div>

            <div>
              <strong>{stats.local_products}+</strong>
              <span>Local Products</span>
            </div>
          </div>
        </div>

        <div className="home-right">
          <div className="service-visual-card">
            <div className="visual-top">
              <div className="worker-avatar-3d">
                <span>LS</span>
              </div>

              <div>
                <h3>Local Sago Service</h3>
                <p>Verified worker nearby</p>
              </div>
            </div>

            <div className="visual-image-area">
              <div className="tool-shape tool-one"></div>
              <div className="tool-shape tool-two"></div>
              <div className="tool-shape tool-three"></div>

              <div className="worker-figure">
                <div className="worker-head"></div>
                <div className="worker-body"></div>
                <div className="worker-tool"></div>
              </div>
            </div>

            <div className="visual-info-grid">
              <div>
                <small>Service</small>
                <strong>Electrician</strong>
              </div>

              <div>
                <small>Workers</small>
                <strong>{stats.verified_workers}+ verified</strong>
              </div>

              <div>
                <small>Products</small>
                <strong>{stats.local_products}+ listed</strong>
              </div>

              <div>
                <small>Status</small>
                <strong>Available</strong>
              </div>
            </div>
          </div>

          <div className="floating-card service-float">
            <span>🧑‍🔧</span>
            <div>
              <h4>Service First</h4>
              <p>Workers near you</p>
            </div>
          </div>

          <div className="floating-card product-float-home">
            <span>🛍</span>
            <div>
              <h4>Products</h4>
              <p>Local seller items</p>
            </div>
          </div>

          <div className="glow-circle circle-one"></div>
          <div className="glow-circle circle-two"></div>
        </div>
      </section>

      <NearbyWorkers />
      <TopRatedWorkers />

      <section className="home-quality-section">
        <div className="quality-left">
          <h2>Made for real local service needs</h2>
          <p>
            Users can discover nearby workers, compare ratings, check price,
            contact instantly and choose verified profiles. Product selling is
            added as a secondary marketplace for local shops and sellers.
          </p>
        </div>

        <div className="quality-grid">
          <div>✅ Admin verified workers</div>
          <div>📍 Distance based discovery</div>
          <div>⭐ Rating and reviews</div>
          <div>📞 Call and WhatsApp contact</div>
        </div>
      </section>
    </div>
  );
}

export default Home;