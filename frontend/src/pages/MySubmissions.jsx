import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./MySubmissions.css";

function MySubmissions() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";

  const [workers, setWorkers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const workerRes = await axios.get(`${API_BASE_URL}/workers/my-submissions/`);
        const productRes = await axios.get(`${API_BASE_URL}/products/my-submissions/`);

        setWorkers(workerRes.data || []);
        setProducts(productRes.data || []);
      } catch (error) {
        console.log("My submissions error:", error);
      }

      setLoading(false);
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="my-submissions-page">
      <Navbar />

      <section className="submissions-hero">
        <h1>My Submissions</h1>
        <p>Track your worker profiles and product listings verification status.</p>
      </section>

      <section className="submissions-content">
        {loading ? (
          <div className="submission-status">Loading submissions...</div>
        ) : (
          <>
            <h2>🧑‍🔧 Worker Profiles</h2>

            <div className="submission-grid">
              {workers.length === 0 ? (
                <div className="submission-status">No worker submissions yet.</div>
              ) : (
                workers.map((worker) => (
                  <div className="submission-card" key={worker.id}>
                    <h3>{worker.name}</h3>
                    <p>{worker.work_title}</p>
                    <span className={worker.is_verified ? "verified" : "pending"}>
                      {worker.is_verified ? "Verified ✅" : "Pending Verification ⏳"}
                    </span>
                  </div>
                ))
              )}
            </div>

            <h2>🛍 Product Listings</h2>

            <div className="submission-grid">
              {products.length === 0 ? (
                <div className="submission-status">No product submissions yet.</div>
              ) : (
                products.map((product) => (
                  <div className="submission-card" key={product.id}>
                    <h3>{product.title}</h3>
                    <p>₹{product.price}</p>
                    <span className={product.is_verified ? "verified" : "pending"}>
                      {product.is_verified ? "Verified ✅" : "Pending Verification ⏳"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default MySubmissions;