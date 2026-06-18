import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./MyFavorites.css";

function MyFavorites() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [workers, setWorkers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const phone = localStorage.getItem("userPhone");

  const fetchFavorites = async () => {
    if (!phone) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/my-favorites/?phone=${phone}`);
      setWorkers(res.data.workers || []);
      setProducts(res.data.products || []);
    } catch (error) {
      console.log("Favorite fetch error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
  const loadFavorites = async () => {
    await fetchFavorites();
  };

  loadFavorites();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const removeWorker = async (workerId) => {
    await axios.delete(`${API_BASE_URL}/favorite-worker/${workerId}/remove/?phone=${phone}`);
    fetchFavorites();
  };

  const removeProduct = async (productId) => {
    await axios.delete(`${API_BASE_URL}/favorite-product/${productId}/remove/?phone=${phone}`);
    fetchFavorites();
  };

  return (
    <div className="favorites-page">
      <Navbar />

      <section className="favorites-hero">
        <h1>My Favorites</h1>
        <p>Your saved workers and products in one place.</p>
      </section>

      <section className="favorites-content">
        {loading ? (
          <div className="favorite-status">Loading favorites...</div>
        ) : (
          <>
            <h2>❤️ Favorite Workers</h2>

            <div className="favorite-grid">
              {workers.length === 0 ? (
                <div className="favorite-status">No saved workers yet.</div>
              ) : (
                workers.map((item) => (
                  <div className="favorite-card" key={item.id}>
                    <h3>{item.worker.name}</h3>
                    <p>{item.worker.work_title}</p>
                    <strong>₹{item.worker.service_charge}</strong>

                    <button onClick={() => removeWorker(item.worker.id)}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            <h2>🛍 Favorite Products</h2>

            <div className="favorite-grid">
              {products.length === 0 ? (
                <div className="favorite-status">No saved products yet.</div>
              ) : (
                products.map((item) => (
                  <div className="favorite-card" key={item.id}>
                    <h3>{item.product.title}</h3>
                    <p>{item.product.description}</p>
                    <strong>₹{item.product.price}</strong>

                    <button onClick={() => removeProduct(item.product.id)}>
                      Remove
                    </button>
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

export default MyFavorites;