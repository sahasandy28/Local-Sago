import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./NearbyWorkers.css";

function NearbyWorkers() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Click detect location to find nearby workers.");

  const fetchNearbyWorkers = (lat, lon) => {
    setLoading(true);
    setMessage("Finding nearby workers...");

    axios
      .get(`${API_BASE_URL}/workers/?lat=${lat}&lon=${lon}`)
      .then((res) => {
        setWorkers((res.data || []).slice(0, 6));
        setMessage("Nearby workers found ✅");
      })
      .catch((error) => {
        console.log("Nearby workers error:", error);
        setMessage("Unable to load nearby workers ❌");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Location not supported in this browser ❌");
      return;
    }

    setLoading(true);
    setMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);

        fetchNearbyWorkers(lat, lon);
      },
      () => {
        setLoading(false);
        setMessage("Please allow location permission ❌");
      }
    );
  };

  return (
    <section className="nearby-workers-section">
      <div className="nearby-header">
        <div>
          <span>📍 Location Based</span>
          <h2>Workers Near You</h2>
          <p>Find verified workers sorted by nearest distance.</p>
        </div>

        <button type="button" onClick={detectLocation}>
          {loading ? "Finding..." : "Detect Location"}
        </button>
      </div>

      <p className="nearby-message">{message}</p>

      {workers.length > 0 && (
        <div className="nearby-worker-grid">
          {workers.map((worker) => (
            <div className="nearby-worker-card" key={worker.id}>
              <div className="nearby-worker-avatar">
                {worker.images && worker.images.length > 0 ? (
                  <img src={worker.images[0].image_url} alt={worker.name} />
                ) : (
                  <span>{worker.name?.charAt(0)}</span>
                )}
              </div>

              <div className="nearby-worker-info">
                <h3>{worker.name}</h3>
                <p>{worker.work_title}</p>

                <div className="nearby-worker-meta">
                  <span>⭐ {Number(worker.average_rating || 0).toFixed(1)}</span>
                  <span>
                    📏{" "}
                    {worker.distance_km !== null &&
                    worker.distance_km !== undefined
                      ? `${worker.distance_km} km`
                      : "Nearby"}
                  </span>
                </div>

                <strong>{worker.area || worker.city}</strong>

                <Link to={`/worker/${worker.id}`}>View Profile</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default NearbyWorkers;