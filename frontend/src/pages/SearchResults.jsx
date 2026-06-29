import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./SearchResults.css";

function SearchResults() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("query") || "";

  const [workers, setWorkers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) return;

      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE_URL}/search/?search=${query}`);
        setWorkers(res.data.workers || []);
        setProducts(res.data.products || []);
      } catch (error) {
        console.log("Search results error:", error);
      }

      setLoading(false);
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-page">
      <Navbar />

      <section className="search-hero">
        <span>Search Results</span>
        <h1>Results for “{query}”</h1>
        <p>Find matching workers and local products in one place.</p>
      </section>

      <section className="search-content">
        {loading ? (
          <div className="search-status">Searching...</div>
        ) : workers.length === 0 && products.length === 0 ? (
          <div className="search-status">No results found.</div>
        ) : (
          <>
            <div className="search-section-title">
              <h2>🧑‍🔧 Workers</h2>
            </div>

            <div className="search-grid">
              {workers.map((worker) => (
                <div
                  className="search-card"
                  key={`worker-${worker.id}`}
                  onClick={() => navigate(`/worker/${worker.id}`)}
                >
                  <div className="search-avatar worker-avatar">
                    {worker.name?.charAt(0)}
                  </div>

                  <h3>{worker.name}</h3>
                  <p>{worker.work_title}</p>
                  <strong>{worker.area || worker.city}</strong>
                </div>
              ))}
            </div>

            <div className="search-section-title">
              <h2>🛍 Products</h2>
            </div>

            <div className="search-grid">
              {products.map((product) => (
                <div
                  className="search-card"
                  key={`product-${product.id}`}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="search-avatar product-avatar">
                    {product.title?.charAt(0)}
                  </div>

                  <h3>{product.title}</h3>
                  <p>₹{product.price}</p>
                  <strong>{product.area || product.city}</strong>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default SearchResults;