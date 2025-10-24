import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      {/* 🔶 Logo & Brand */}
      <div className="footer-header">
        <img
          src="/assets/messmate.png"
          alt="MessMate Logo"
          className="footer-logo"
        />
        <h1 className="footer-title">MessMate</h1>
      </div>

      {/* 📚 Footer Grid */}
      <div className="footer-grid">
        {/* 🍱 For Messes */}
        <div className="footer-column">
          <h2>For Messes</h2>
          <ul>
            <li>
              <Link to="/partner-with-us" className="footer-link">
                Partner With Us
              </Link>
            </li>
            <li>
              <Link to="#" className="footer-link">
                Apps For You
              </Link>
            </li>
          </ul>
        </div>

        {/* 🚴 For Delivery Partners */}
        <div className="footer-column">
          <h2>For Delivery Partners</h2>
          <ul>
            <li>
              <Link to="/delivery-partners" className="footer-link">
                Partner With Us
              </Link>
            </li>
            <li>
              <Link to="/delivery-join" className="footer-link">
                Apps For You
              </Link>
            </li>
          </ul>
        </div>

        {/* 🍽️ For Restaurants */}
        <div className="footer-column">
          <h2>For Restaurants</h2>
          <ul>
            <li>
              <Link to="/partner-with-us" className="footer-link">
                Partner With Us
              </Link>
            </li>
            <li>
              <Link to="#" className="footer-link">
                Apps For You
              </Link>
            </li>
          </ul>
        </div>

        {/* 📘 Learn More */}
        <div className="footer-column">
          <h2>Learn More</h2>
          <ul>
            <li><Link to="#" className="footer-link">Privacy</Link></li>
            <li><Link to="#" className="footer-link">Security</Link></li>
            <li><Link to="#" className="footer-link">Terms of Service</Link></li>
            <li><Link to="#" className="footer-link">Help & Support</Link></li>
            <li><Link to="#" className="footer-link">Report a Fraud</Link></li>
            <li><Link to="#" className="footer-link">Blog</Link></li>
          </ul>
        </div>

        {/* 🌐 Social Links */}
        <div className="footer-column">
          <h2>Social Links</h2>
          <div className="footer-social">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
          </div>
        </div>
      </div>

      {/* ⚙️ Copyright */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} MessMate™ Ltd. All rights reserved.
      </div>
    </footer>
  );
}
