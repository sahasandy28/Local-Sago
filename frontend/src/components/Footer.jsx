import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-logo-section">
          <img src={logo} alt="Local Sago" className="footer-logo" />
          <h2>Local Sago</h2>
          <p>
            Connecting local customers with trusted workers and local
            product sellers across communities.
          </p>
        </div>

        <div className="footer-links">

          <div className="footer-column">
            <h3>Company</h3>

            <Link to="/company/about">About Us</Link>
            <Link to="/company/careers">Careers</Link>
            <Link to="/company/contact">Contact Us</Link>
            <Link to="/company/reviews">Reviews</Link>
            <Link to="/company/terms">Terms & Conditions</Link>
            <Link to="/company/privacy">Privacy Policy</Link>
            <Link to="/company/cookies">Cookie Policy</Link>
          </div>

          <div className="footer-column">
            <h3>For Customers</h3>

            <Link to="/service">Find Workers</Link>
            <Link to="/product">Browse Products</Link>
            <Link to="/my-favorites">Favorites</Link>
            <Link to="/company/support">Support</Link>
          </div>

          <div className="footer-column">
            <h3>For Workers</h3>

            <Link to="/worker-register">
              Register as Worker
            </Link>

            <Link to="/product-register">
              Add Product
            </Link>

            <Link to="/my-submissions">
              My Submissions
            </Link>
          </div>

          <div className="footer-column">
            <h3>Social Links</h3>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
          </div>

        </div>

        <div className="footer-bottom">

          <p>
            © 2026 Local Sago. All Rights Reserved.
          </p>

          <p>
            Designed & Developed by <strong>Shanmugamoorthy</strong>
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;