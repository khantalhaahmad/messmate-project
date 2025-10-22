// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import Hero from "../components/Hero";
import BetterFood from "../components/BetterFood";
import MessCard from "../components/MessCard";
import Footer from "../components/Footer";
import MessSearch from "../components/MessSearch";
import Recommendations from "../components/Recommendations";
import "../styles/Home.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import AddMessButton from "../components/AddMessButton";
import FloatingButtons from "../components/FloatingButtons";

const Home = () => {
  const [messData, setMessData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);

  const navigate = useNavigate();
  const availableSectionRef = useRef(null);

  // ✅ Fetch all messes
  useEffect(() => {
    const fetchMesses = async () => {
      try {
        const res = await api.get("/messes");
        const messes = Array.isArray(res.data) ? res.data : [];
        setMessData(messes);
        setFilteredData(messes);
      } catch (err) {
        console.error("❌ Error fetching messes:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMesses();
  }, []);

  // ✅ Scroll listener (perfectly reliable)
  useEffect(() => {
    const handleScroll = () => {
      if (!availableSectionRef.current) return;

      const sectionTop = availableSectionRef.current.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Hide buttons when reaching Available Mess section
      if (scrollPosition >= sectionTop) {
        setShowFloatingButtons(false);
      } else {
        setShowFloatingButtons(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // call initially

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Image mapping
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

  const handleViewMess = (mess) => {
    if (!mess?.mess_id) {
      console.warn("⚠️ Missing mess_id for:", mess);
      return;
    }
    navigate(`/messes/id/${mess.mess_id}`);
  };

  return (
    <div className="home-container">
      <Hero />
      <BetterFood />

      {/* 🟠 Floating Buttons appear only above Available Mess section */}
      {showFloatingButtons && (
        <>
          <AddMessButton />
          <FloatingButtons />
        </>
      )}

      {/* 🏠 Available Mess Section */}
      <section className="mess-section" ref={availableSectionRef}>
        <div className="mess-header">
          <h2 className="section-title">Available Messes</h2>
          <MessSearch messes={messData} onSearchResults={setFilteredData} />
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading messes...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="mess-grid">
            {filteredData.map((mess) => (
              <MessCard
                key={mess._id || mess.mess_id}
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
