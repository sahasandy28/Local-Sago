import Navbar from "../components/Navbar";
import "./Help.css";

function Help() {
  return (
    <div className="help-page">
      <Navbar />

      <section className="help-hero">
        <span>Local Sago Help Center</span>
        <h1>How can we help you?</h1>
        <p>
          Learn how to find workers, register as a worker, sell products and use
          Local Sago safely.
        </p>
      </section>

      <section className="help-content">
        <div className="help-grid">
          <div className="help-card">
            <div className="help-icon">👥</div>
            <h3>For Customers</h3>
            <p>
              Search nearby services, compare workers, check reviews and contact
              verified workers directly.
            </p>
          </div>

          <div className="help-card">
            <div className="help-icon">🧑‍🔧</div>
            <h3>For Workers</h3>
            <p>
              Register your service profile, add work details and wait for admin
              verification to go live.
            </p>
          </div>

          <div className="help-card">
            <div className="help-icon">🛍️</div>
            <h3>For Sellers</h3>
            <p>
              Add local products with photos, price, location and seller contact
              details.
            </p>
          </div>
        </div>

        <div className="help-section-title">
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers for common Local Sago questions</p>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h4>How do I find nearby workers?</h4>
            <p>
              Go to the Service page, select your service category and use
              “Detect My Location” to view nearby workers.
            </p>
          </div>

          <div className="faq-item">
            <h4>How can I become a worker?</h4>
            <p>
              Click Sell / Work in the navbar, choose Become Worker and submit
              your profile for admin verification.
            </p>
          </div>

          <div className="faq-item">
            <h4>How do I sell a product?</h4>
            <p>
              Click Sell / Work, choose Add Product, upload product images and
              submit details for verification.
            </p>
          </div>

          <div className="faq-item">
            <h4>Why is my worker or product not visible?</h4>
            <p>
              New worker profiles and products appear only after admin approval.
            </p>
          </div>

          <div className="faq-item">
            <h4>Can I contact workers directly?</h4>
            <p>
              Yes. You can use Call or WhatsApp buttons on each worker profile.
            </p>
          </div>
        </div>

        <div className="support-box">
          <div>
            <h2>Need more support?</h2>
            <p>
              If you face any issue, contact Local Sago support. We will help you
              use the platform smoothly and safely.
            </p>
          </div>

          <a href="mailto:support@localsaha.com">Contact Support</a>
        </div>
      </section>
    </div>
  );
}

export default Help;