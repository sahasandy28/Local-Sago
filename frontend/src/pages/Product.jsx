import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Product.css";

function Product() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const productsSectionRef = useRef(null);

  const [userLocation, setUserLocation] = useState({
    lat: "",
    lon: "",
  });

  const [locationMessage, setLocationMessage] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const fetchProducts = async (categorySlug = "", lat = "", lon = "") => {
    try {
      let url = `${API_BASE_URL}/products/?`;

      if (categorySlug) {
        url += `category=${categorySlug}&`;
      }

      if (lat && lon) {
        url += `lat=${lat}&lon=${lon}`;
      }

      const res = await axios.get(url);
      setProducts(res.data || []);
    } catch (error) {
      console.log("Product fetch error:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${API_BASE_URL}/product-categories/`);
        setCategories(res.data || []);

        if (res.data.length > 0) {
          const firstSlug = res.data[0].slug;
          setSelectedCategory(firstSlug);

          await fetchProducts(firstSlug);
        }
      } catch (error) {
        console.log("Category fetch error:", error);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (slug) => {
    setSelectedCategory(slug);
    setLoading(true);

    await fetchProducts(slug, userLocation.lat, userLocation.lon);

    setTimeout(() => {
      setLoading(false);

      productsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 1000);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location not supported in this browser ❌");
      return;
    }

    setLocationLoading(true);
    setLocationMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);

        setUserLocation({ lat, lon });
        setLocationMessage("Nearby products sorted successfully ✅");

        setLoading(true);
        await fetchProducts(selectedCategory, lat, lon);

        setTimeout(() => {
          setLoading(false);
          setLocationLoading(false);

          productsSectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 1000);
      },
      () => {
        setLocationMessage("Please allow location permission ❌");
        setLocationLoading(false);
      }
    );
  };

  const saveProduct = async (productId) => {
    const phone = localStorage.getItem("userPhone");

    if (!phone) {
      alert("Please login again");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/favorite-product/`, {
        phone,
        product: productId,
      });

      alert("Product saved ❤️");
    } catch (error) {
      console.log("Save product error:", error);
      alert("Already saved or backend error");
    }
  };

  return (
    <div className="product-page">
      <Navbar />

      <section className="product-hero">
        <div className="product-hero-content">
          <span>Local Sago Products</span>

          <h1>
            Buy & Sell Local Products <br />
            Near You
          </h1>

          <p>
            Discover products from nearby shops and local sellers with trusted
            contact options.
          </p>
        </div>
      </section>

      <section className="product-content">
        <div className="section-title">
          <h2>Product Categories</h2>
          <p>Choose a category and explore local products</p>
        </div>

        <div className="product-category-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={
                selectedCategory === cat.slug
                  ? "product-category-card active"
                  : "product-category-card"
              }
              onClick={() => handleCategoryClick(cat.slug)}
            >
              <div className="product-category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{cat.description || "Local products near your area"}</p>
            </div>
          ))}
        </div>

        <div className="products-header" ref={productsSectionRef}>
          <div>
            <h2>Available Products</h2>
            <p>Verified local products from nearby sellers</p>
          </div>

          <div className="product-location-actions">
            <button type="button" onClick={getUserLocation}>
              {locationLoading ? "Finding..." : " Detect My Location"}
            </button>

            {locationMessage && <p>{locationMessage}</p>}
          </div>
        </div>

        {loading ? (
          <div className="product-status">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="product-status">
            No verified products available in this category yet.
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const productImage =
                product.images && product.images.length > 0
                  ? product.images[0].image_url
                  : null;

              return (
                <div
                  className="product-card clickable-product-card"
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="product-image-box">
                    {productImage ? (
                      <img src={productImage} alt={product.title} />
                    ) : (
                      <div className="product-placeholder">
                        {product.title?.charAt(0)}
                      </div>
                    )}

                    {product.is_verified && (
                      <span className="product-verified">Verified</span>
                    )}

                    <span className="product-condition">
                      {product.condition}
                    </span>
                  </div>

                  <div className="product-body">
                    <h3>{product.title}</h3>

                    <p className="product-desc">{product.description}</p>

                    <div className="product-info-grid">
                      <div>
                        <span> Price</span>
                        <strong>₹{product.price}</strong>
                      </div>

                      <div>
                        <span> Location</span>
                        <strong>{product.area || product.city}</strong>
                      </div>

                      <div>
                        <span> Seller</span>
                        <strong>{product.seller_name}</strong>
                      </div>

                      <div>
                        <span> Distance</span>
                        <strong>
                          {product.distance_km !== null &&
                          product.distance_km !== undefined
                            ? `${product.distance_km} km away`
                            : userLocation.lat
                            ? "Calculating..."
                            : "Detect location"}
                        </strong>
                      </div>
                    </div>

                    <div className="product-actions">
                      <button
                        type="button"
                        className="product-call"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${product.seller_phone}`;
                        }}
                      >
                         Contact
                      </button>

                      <button
                        type="button"
                        className="product-whatsapp"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(
                            `https://wa.me/91${product.seller_phone}`,
                            "_blank"
                          );
                        }}
                      >
                         WhatsApp
                      </button>
                    </div>

                    <button
                      type="button"
                      className="favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveProduct(product.id);
                      }}
                    >
                       Save Product
                    </button>

                    <button
                      type="button"
                      className="product-view"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Product;