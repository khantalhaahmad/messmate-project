import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import BetterFood from "../components/BetterFood";
import MessCard from "../components/MessCard";
import Footer from "../components/Footer";
import MessSearch from "../components/MessSearch";
import "../styles/Home.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [messData, setMessData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch all messes
  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await api.get("/messes");
        setMessData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error("❌ Error fetching messes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMesses();
  }, []);

  // ✅ Map mess names → image filenames
  const imageMap = {
    "Restro 65": "restromess.png",
    "Green Garden": "greengarden.png",
    "Rajiv Hotel": "rajivhotel.png",
    "Cloud Kitchen": "cloudkitchen.png",
    "Prachi Restaurent": "prachi.png",
    "Jalsa Biryani": "jalsa.png",
    default: "default.png",
  };

  const getImagePath = (name) => `/assets/${imageMap[name] || imageMap.default}`;

  const handleViewMess = (mess) => {
    navigate(`/messes/id/${mess.mess_id}`);
  };

  return (
    <div className="home-container">
      {/* ===== HERO SECTION ===== */}
      <section id="hero-section" className="hero-section">
        <Hero />
      </section>

      {/* ===== BETTER FOOD SECTION ===== */}
      <section id="betterfood-section" className="betterfood-section">
        <BetterFood />
      </section>

      {/* ===== AVAILABLE MESS SECTION ===== */}
      <section id="mess-section" className="mess-section">
        <div className="mess-header">
          <h2 className="section-title">Available Messes</h2>
          <MessSearch messes={messData} onSearchResults={setFilteredData} />
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading messes...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="mess-grid">
            {filteredData.map((mess) => (
              <MessCard
                key={mess.mess_id}
                mess={mess}
                image={getImagePath(mess.name)}
                onClick={() => handleViewMess(mess)}
              />
            ))}
          </div>
        ) : (
          <p className="no-results">No messes found.</p>
        )}
      </section>

      {/* ===== FOOTER SECTION ===== */}
      <footer id="footer-section" className="footer-section">
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
