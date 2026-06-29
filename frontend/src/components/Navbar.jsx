import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const API_BASE_URL = "https://local-sago-backend.onrender.com/api";
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const lastScrollY = useRef(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [products, setProducts] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [showNavbar, setShowNavbar] = useState(true);

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  const closeAll = () => {
    setMenuOpen(false);
    setSellOpen(false);
    setSettingsOpen(false);
    setCompanyOpen(false);
    setSearchOpen(false);
    setNotificationOpen(false);
  };

  const fetchNotifications = async () => {
    try {
      const userPhone = localStorage.getItem("userPhone");
      let url = `${API_BASE_URL}/notifications/`;

      if (userPhone) {
        url += `?phone=${userPhone}`;
      }

      const res = await axios.get(url);
      setNotifications(res.data || []);
    } catch (error) {
      console.log("Notification error:", error);
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      await fetchNotifications();
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        closeAll();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      if (currentScrollY <= 80) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
        closeAll();
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchText.trim()) {
        setWorkers([]);
        setProducts([]);
        setSearchOpen(false);
        return;
      }

      try {
        const res = await axios.get(
          `${API_BASE_URL}/search/?search=${searchText.trim()}`
        );

        setWorkers(res.data.workers || []);
        setProducts(res.data.products || []);
        setSearchOpen(true);
      } catch (error) {
        console.log("Search error:", error);
      }
    };

    const timer = setTimeout(fetchSearch, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const goSearchPage = () => {
    if (!searchText.trim()) return;

    navigate(`/search?query=${searchText.trim()}`);
    closeAll();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    goSearchPage();
  };

  const handleNotificationClick = async (item) => {
    try {
      await axios.post(`${API_BASE_URL}/notifications/${item.id}/read/`);
      fetchNotifications();
    } catch (error) {
      console.log("Read notification error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("localSagoUser");
    localStorage.removeItem("userPhone");

    closeAll();
    navigate("/login");
  };

  return (
    <nav
      className={showNavbar ? "navbar navbar-show" : "navbar navbar-hide"}
      ref={navbarRef}
    >
      <Link to="/home" className="nav-logo" onClick={closeAll}>
        <img src={logo} alt="Local Sago" />
      </Link>

      <form className="nav-search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search workers, services, products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => {
            if (searchText.trim()) setSearchOpen(true);
          }}
        />

        {searchOpen && searchText.trim() && (
          <div className="search-suggestions">
            {workers.length === 0 && products.length === 0 ? (
              <div className="suggestion-empty">No results found</div>
            ) : (
              <>
                {workers.length > 0 && (
                  <div className="suggestion-section">
                    <h5>🧑‍🔧 Workers</h5>

                    {workers.slice(0, 4).map((worker) => (
                      <button
                        type="button"
                        className="suggestion-item"
                        key={`worker-${worker.id}`}
                        onClick={() => {
                          navigate(`/worker/${worker.id}`);
                          closeAll();
                        }}
                      >
                        <span>{worker.name?.charAt(0)}</span>
                        <div>
                          <h4>{worker.name}</h4>
                          <p>
                            {worker.work_title} • {worker.area || worker.city}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {products.length > 0 && (
                  <div className="suggestion-section">
                    <h5>🛍 Products</h5>

                    {products.slice(0, 4).map((product) => (
                      <button
                        type="button"
                        className="suggestion-item"
                        key={`product-${product.id}`}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          closeAll();
                        }}
                      >
                        <span>{product.title?.charAt(0)}</span>
                        <div>
                          <h4>{product.title}</h4>
                          <p>
                            ₹{product.price} • {product.area || product.city}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            <button type="button" className="view-all-btn" onClick={goSearchPage}>
              View all results for “{searchText}”
            </button>
          </div>
        )}
      </form>

      <div className="nav-right-tools">
        <div className="notification-wrapper">
          <button
            type="button"
            className="notification-btn"
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setSellOpen(false);
              setSettingsOpen(false);
              setCompanyOpen(false);
              setSearchOpen(false);
              setMenuOpen(false);
            }}
          >
            🔔
            {unreadCount > 0 && <span>{unreadCount}</span>}
          </button>

          {notificationOpen && (
            <div className="notification-menu">
              <div className="notification-title">
                <h4>Notifications</h4>
                <small>{unreadCount} unread</small>
              </div>

              {notifications.length === 0 ? (
                <div className="notification-empty">No notifications yet.</div>
              ) : (
                notifications.slice(0, 8).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      item.is_read
                        ? "notification-item read"
                        : "notification-item unread"
                    }
                    onClick={() => handleNotificationClick(item)}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.message}</p>
                    <small>{new Date(item.created_at).toLocaleString()}</small>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <button
          className="hamburger"
          type="button"
          onClick={() => {
            setMenuOpen(!menuOpen);
            setSellOpen(false);
            setSettingsOpen(false);
            setCompanyOpen(false);
            setNotificationOpen(false);
            setSearchOpen(false);
          }}
        >
          ☰
        </button>
      </div>

      <div className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/home" onClick={closeAll}>
          Home
        </Link>

        <Link to="/service" onClick={closeAll}>
          Service
        </Link>

        <Link to="/product" onClick={closeAll}>
          Product
        </Link>

        <div className="settings-wrapper">
          <button
            type="button"
            className="settings-btn"
            onClick={() => {
              setSettingsOpen(!settingsOpen);
              setSellOpen(false);
              setCompanyOpen(false);
              setNotificationOpen(false);
              setSearchOpen(false);
            }}
          >
            Settings ▾
          </button>

          {settingsOpen && (
            <div className="settings-menu">
              <Link to="/profile" onClick={closeAll}>
                 Profile
              </Link>

              <Link to="/settings" onClick={closeAll}>
                 Theme Settings
              </Link>

              <Link to="/my-favorites" onClick={closeAll}>
                 Favorites
              </Link>

              <div className="company-wrapper">
                <button
                  type="button"
                  className="company-btn"
                  onClick={() => setCompanyOpen(!companyOpen)}
                >
                   Company ▸
                </button>

                {companyOpen && (
                  <div className="company-submenu">
                    <Link to="/company/about" onClick={closeAll}>
                      About Us
                    </Link>
                    <Link to="/company/careers" onClick={closeAll}>
                      Careers
                    </Link>
                    <Link to="/company/contact" onClick={closeAll}>
                      Contact Us
                    </Link>
                    <Link to="/company/reviews" onClick={closeAll}>
                      Reviews
                    </Link>
                    <Link to="/company/terms" onClick={closeAll}>
                      Terms & Conditions
                    </Link>
                    <Link to="/company/privacy" onClick={closeAll}>
                      Privacy Policy
                    </Link>
                    <Link to="/company/cookies" onClick={closeAll}>
                      Cookie Policy
                    </Link>
                    <Link to="/company/support" onClick={closeAll}>
                      Support
                    </Link>
                  </div>
                )}
              </div>

              <button type="button" onClick={logout}>
                 Logout
              </button>
            </div>
          )}
        </div>

        <div className="sell-wrapper">
          <button
            type="button"
            className="sell-btn"
            onClick={() => {
              setSellOpen(!sellOpen);
              setSettingsOpen(false);
              setCompanyOpen(false);
              setNotificationOpen(false);
              setSearchOpen(false);
            }}
          >
            Sell / Work ▾
          </button>

          {sellOpen && (
            <div className="sell-menu">
              <Link to="/worker-register" onClick={closeAll}>
                Become a Worker
              </Link>

              <Link to="/product-register" onClick={closeAll}>
                Add Product
              </Link>

              <Link to="/my-submissions" onClick={closeAll}>
                My Submissions
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;