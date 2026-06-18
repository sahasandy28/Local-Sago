import "./PageLoader.css";
import logo from "../assets/logo.png";

function PageLoader({ text = "Finding trusted local experts..." }) {
  return (
    <div className="page-loader">
      <div className="loader-card">
        <div className="loader-orbit">
          <div className="orbit-ring ring-one"></div>
          <div className="orbit-ring ring-two"></div>

          <div className="loader-core">
            <img src={logo} alt="Local Sago" />
          </div>

          <span className="orbit-chip chip-1">🔧</span>
          <span className="orbit-chip chip-2">⚡</span>
          <span className="orbit-chip chip-3">🧰</span>
          <span className="orbit-chip chip-4">📍</span>
        </div>

        <h2>Local Sago</h2>
        <p>{text}</p>

        <div className="loader-progress">
          <span></span>
        </div>

        <div className="loader-skeleton-grid">
          <div className="loader-skeleton-card"></div>
          <div className="loader-skeleton-card"></div>
          <div className="loader-skeleton-card"></div>
        </div>
      </div>
    </div>
  );
}

export default PageLoader;