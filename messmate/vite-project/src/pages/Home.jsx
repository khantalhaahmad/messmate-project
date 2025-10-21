// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import BetterFood from "../components/BetterFood";
import MessCard from "../components/MessCard";
import Footer from "../components/Footer";
import MessSearch from "../components/MessSearch";
import Recommendations from "../components/Recommendations";
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
        console.log("✅ Messes fetched:", res.data);
        setMessData(res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error("❌ Error fetching messes:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMesses();
  }, []);

  const imageMap = {
    Restro65: "restromess.png",
    "Green Garden": "greengarden.png",
    "Rajiv Hotel": "rajivhotel.png",
    "Cloud Kitchen": "cloudkitchen.png",
    "Prachi Restaurent": "prachi.png",
    "Jalsa Biryani": "jalsa.png",
    default: "default.png",
  };

  const getImagePath = (name) => `/assets/${imageMap[name] || imageMap.default}`;
  const handleViewMess = (mess) => navigate(`/messes/id/${mess.mess_id}`);

  return (
    <div className="home-container">
      <Hero />
      <BetterFood />

      <section className="mess-section">
        <div className="mess-header">
          <h2 className="section-title">Available Messes</h2>
          <MessSearch messes={messData} onSearchResults={setFilteredData} />
        </div>

        {loading ? (
          <div className="loading-container"><p>Loading messes...</p></div>
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

      <Recommendations />
      <Footer />
    </div>
  );
};

export default Home;
