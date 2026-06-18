import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./CompanyDetail.css";

function CompanyDetail() {
  const { page } = useParams();

  const pages = {
    about: {
      icon: "🏢",
      title: "About Us",
      subtitle: "Welcome to Local Sago",
      content:
        "Local Sago is a trusted local marketplace that connects customers with nearby service professionals and local product sellers. Our mission is to make finding reliable services and products simple, fast, and affordable while supporting local communities and small businesses.",
      points: [
        "Verified local workers",
        "Nearby service discovery",
        "Local product marketplace",
        "Simple and direct contact",
      ],
    },

    careers: {
      icon: "💼",
      title: "Careers",
      subtitle: "Build the future of local services",
      content:
        "Join Local Sago and help us build a strong local service platform. We welcome passionate developers, designers, support specialists, and community managers who want to create real impact for local communities.",
      points: [
        "Frontend and backend developers",
        "UI/UX designers",
        "Customer support roles",
        "Community growth managers",
      ],
    },

    contact: {
      icon: "📞",
      title: "Contact Us",
      subtitle: "Reach Local Sago support",
      content:
        "Our team is here to help with service registration, product listings, account support, and technical issues.",
      points: [
        "Email: support@localsaha.com",
        "Phone: +91 63690 14520",
        "Working Hours: Monday - Saturday",
        "Time: 9:00 AM - 6:00 PM",
      ],
    },

    reviews: {
      icon: "⭐",
      title: "Reviews",
      subtitle: "Trusted by local users",
      content:
        "Local Sago is built with feedback from customers, workers, and sellers. We continuously improve the platform based on real user suggestions and community needs.",
      points: [
        "Verified worker reviews",
        "Customer feedback support",
        "Transparent ratings",
        "Community-first improvements",
      ],
    },

    terms: {
      icon: "📄",
      title: "Terms & Conditions",
      subtitle: "Platform usage rules",
      content:
        "By using Local Sago, users agree to provide accurate information, respect community guidelines, and use the platform responsibly. Local Sago may remove fake listings, fake reviews, or content that violates platform policies.",
      points: [
        "Provide accurate details",
        "Do not post fake information",
        "Respect customers and workers",
        "Fraudulent activity may be removed",
      ],
    },

    privacy: {
      icon: "🔒",
      title: "Privacy Policy",
      subtitle: "Your privacy matters",
      content:
        "Local Sago respects your privacy. We collect only the information required to provide local service discovery, product listings, user support, and platform improvements.",
      points: [
        "We protect user information",
        "We do not sell personal data",
        "Location is used for nearby discovery",
        "Users can contact support for privacy help",
      ],
    },

    cookies: {
      icon: "🍪",
      title: "Cookie Policy",
      subtitle: "Better browsing experience",
      content:
        "Local Sago may use cookies to remember preferences, improve website performance, and provide a smoother browsing experience.",
      points: [
        "Remember theme preferences",
        "Improve app performance",
        "Support login sessions",
        "Improve user experience",
      ],
    },

    support: {
      icon: "💬",
      title: "Support",
      subtitle: "Need help?",
      content:
        "Our support team can help with account issues, worker verification, product listings, search, location access, and technical problems.",
      points: [
        "Account support",
        "Worker verification help",
        "Product listing support",
        "Technical support",
      ],
    },
  };

  const currentPage = pages[page] || pages.about;

  return (
    <div className="company-detail-page">
      <Navbar />

      <section className="company-detail-hero">
        <span>{currentPage.icon}</span>
        <h1>{currentPage.title}</h1>
        <p>{currentPage.subtitle}</p>
      </section>

      <section className="company-detail-content">
        <div className="company-detail-card">
          <Link to="/company" className="back-company">
            ← Back to Company
          </Link>

          <h2>{currentPage.subtitle}</h2>
          <p className="main-content">{currentPage.content}</p>

          <div className="detail-point-grid">
            {currentPage.points.map((point) => (
              <div className="detail-point" key={point}>
                ✅ {point}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompanyDetail;