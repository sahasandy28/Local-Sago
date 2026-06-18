import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Company.css";

function Company() {
  const companyItems = [
    {
      icon: "🏢",
      title: "About Us",
      text: "Learn about Local Sago, our mission, and how we support local workers and sellers.",
      path: "/company/about",
    },
    {
      icon: "💼",
      title: "Careers",
      text: "Join our team and help build a better local service marketplace.",
      path: "/company/careers",
    },
    {
      icon: "📞",
      title: "Contact Us",
      text: "Reach our team for business, service, product, or platform support.",
      path: "/company/contact",
    },
    {
      icon: "⭐",
      title: "Reviews",
      text: "See how users trust Local Sago for services and local products.",
      path: "/company/reviews",
    },
    {
      icon: "📄",
      title: "Terms & Conditions",
      text: "Read the rules and responsibilities for using Local Sago.",
      path: "/company/terms",
    },
    {
      icon: "🔒",
      title: "Privacy Policy",
      text: "Understand how Local Sago protects your personal information.",
      path: "/company/privacy",
    },
    {
      icon: "🍪",
      title: "Cookie Policy",
      text: "Learn how cookies improve your browsing experience.",
      path: "/company/cookies",
    },
    {
      icon: "💬",
      title: "Support",
      text: "Get help with account, worker verification, products, and technical issues.",
      path: "/company/support",
    },
  ];

  return (
    <div className="company-page">
      <Navbar />

      <section className="company-hero">
        <span>Local Sago Company</span>
        <h1>Built for Local People, Workers & Sellers</h1>
        <p>
          Local Sago connects customers with trusted nearby workers and local
          product sellers, making daily local needs simple, fast, and reliable.
        </p>
      </section>

      <section className="company-content">
        <div className="company-title">
          <h2>Company Information</h2>
          <p>Explore important pages about Local Sago and our platform.</p>
        </div>

        <div className="company-grid">
          {companyItems.map((item) => (
            <Link to={item.path} className="company-card" key={item.title}>
              <div className="company-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span>Open →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Company;