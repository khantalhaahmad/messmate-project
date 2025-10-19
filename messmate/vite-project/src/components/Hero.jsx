import React from "react";
import "../styles/Hero.css";

import heroBg from "/assets/campuseat.mp4"; // use your own hero video file

const HeroSection = () => {
  const scrollToNextSection = () => {
    const nextSection = document.querySelector(".better-food-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section">
      {/* Background Video */}
      <video className="hero-bg" autoPlay loop muted playsInline>
        <source src={heroBg} type="video/mp4" />
      </video>

      {/* Overlay - lighter for more clarity */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">MessMate</h1>
        <h2 className="hero-subtitle">#1 Mess Delivery Website</h2>
        <p className="hero-text">
          Fresh, fast, and hygienic meals made with love — delivered straight from your favorite local kitchens.
        </p>
      </div>

 <div className="scroll-down" onClick={scrollToNextSection}>
  <div className="scroll-icon-wrapper">
    <div className="scroll-circle"></div>
    <i className="scroll-arrow">↓</i> {/* actual downward arrow symbol */}
  </div>
  <span className="scroll-text">Scroll Down</span>
</div>


    </section>
  );
};

export default HeroSection;
