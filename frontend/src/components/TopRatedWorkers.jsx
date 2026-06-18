import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./TopRatedWorkers.css";

function TopRatedWorkers() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const renderStars = (rating) => {
    const value = Math.round(Number(rating || 0));
    return "★".repeat(value) + "☆".repeat(5 - value);
  };

  useEffect(() => {
    const fetchTopWorkers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/workers/`);

        const sortedWorkers = [...(res.data || [])]
          .sort(
            (a, b) =>
              Number(b.average_rating || 0) - Number(a.average_rating || 0)
          )
          .slice(0, 6);

        setWorkers(sortedWorkers);
      } catch (error) {
        console.log("Top rated workers error:", error);
      }

      setLoading(false);
    };

    fetchTopWorkers();
  }, []);

  return (
    <section className="top-workers-section">
      <div className="top-workers-header">
        <span>🏆 Most Trusted</span>
        <h2>Top Rated Workers</h2>
        <p>Highly rated verified workers from Local Sago.</p>
      </div>

      {loading ? (
        <div className="top-workers-status">Loading top workers...</div>
      ) : workers.length === 0 ? (
        <div className="top-workers-status">No top rated workers yet.</div>
      ) : (
        <div className="top-workers-grid">
          {workers.map((worker) => {
            const workerImage =
              worker.images && worker.images.length > 0
                ? worker.images[0].image_url
                : null;

            return (
              <div className="top-worker-card" key={worker.id}>
                <div className="top-worker-img">
                  {workerImage ? (
                    <img src={workerImage} alt={worker.name} />
                  ) : (
                    <span>{worker.name?.charAt(0)}</span>
                  )}

                  <small>Verified</small>
                </div>

                <div className="top-worker-body">
                  <h3>{worker.name}</h3>
                  <p>{worker.work_title}</p>

                  <div className="top-rating">
                    <strong>{Number(worker.average_rating || 0).toFixed(1)}</strong>
                    <span>{renderStars(worker.average_rating)}</span>
                  </div>

                  <div className="top-worker-info">
                    <span> {worker.area || worker.city}</span>
                    <span> ₹{worker.service_charge}</span>
                  </div>

                  <Link to={`/worker/${worker.id}`}>View Profile</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TopRatedWorkers;