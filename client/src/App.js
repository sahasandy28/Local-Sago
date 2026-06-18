import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/services/")
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="app">
      <h1 className="title">Local Sago Services 🔧</h1>

      <div className="card-container">
        {services.map((service) => (
          <div className="card" key={service.id}>
            
            <img
              src={`http://127.0.0.1:8000${service.image}`}
              alt={service.name}
            />

            <div className="card-content">
              <h2>{service.name}</h2>

              <p>{service.description}</p>

              <p className="price">₹ {service.price}</p>

              <p className="location">
                📍 {service.location}
              </p>

              <a href={`tel:${service.phone}`}>
                <button className="call-btn">
                  📞 Call Now
                </button>
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;