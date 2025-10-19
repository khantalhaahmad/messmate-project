import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "../styles/FloatingButtons.css";

const FloatingButtons = () => {
  const { user } = useContext(AuthContext);
  const [visible, setVisible] = useState(true);
  const [isOnWhiteSection, setIsOnWhiteSection] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setVisible(false);
      return;
    }

    const messSection = document.querySelector("#mess-section");
    const footerSection = document.querySelector("#footer-section");
    const betterFoodSection = document.querySelector("#betterfood-section");

    if (!messSection || !footerSection || !betterFoodSection) return;

    // Visibility control for buttons
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            (entry.target.id === "mess-section" && entry.intersectionRatio === 1) ||
            (entry.target.id === "footer-section" && entry.isIntersecting)
          ) {
            setVisible(false);
          } else {
            setVisible(true);
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(messSection);
    observer.observe(footerSection);

    // Detect background color section (BetterFood)
    const colorObserver = new IntersectionObserver(
      ([entry]) => setIsOnWhiteSection(entry.isIntersecting),
      { threshold: 0.3 }
    );

    colorObserver.observe(betterFoodSection);

    return () => {
      observer.disconnect();
      colorObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div
      className={`floating-buttons ${visible ? "show" : "hide"} ${
        isOnWhiteSection ? "dark-mode" : "light-mode"
      }`}
    >
      {!user ? (
        <>
          <Link to="/login" className="floating-btn glass-btn glow-btn">
            Login
          </Link>
          <Link to="/signup" className="floating-btn glass-btn glow-btn">
            Signup
          </Link>
        </>
      ) : (
        <Link to="/dashboard" className="floating-btn dashboard-btn glow-btn">
          Dashboard
        </Link>
      )}
    </div>
  );
};

export default FloatingButtons;
