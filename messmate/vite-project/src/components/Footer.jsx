import { FaLinkedin, FaInstagram, FaYoutube, FaFacebook, FaXTwitter } from "react-icons/fa6";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand with favicon */}
        <div className="footer-brand">
          <img
            src="/assets/messmate.png"
            alt="MessMate Logo"
            className="footer-logo"
          />
          <h1>MessMate</h1>
        </div>

        {/* For Messe's */}
        <div>
          <h2>For Messe's</h2>
          <ul>
            <li><a href="#">Partner With Us</a></li>
            <li><a href="#">Apps For You</a></li>
          </ul>
        </div>

        {/* For Delivery Partners */}
        <div>
          <h2>For Delivery Partners</h2>
          <ul>
            <li><a href="#">Partner With Us</a></li>
            <li><a href="#">Apps For You</a></li>
          </ul>
        </div>

        {/* Learn More */}
        <div>
          <h2>Learn More</h2>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Help & Support</a></li>
            <li><a href="#">Report a Fraud</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Social Links */}
      <div className="footer-social">
        <a href="#"><FaLinkedin /></a>
        <a href="#"><FaInstagram /></a>
        <a href="#"><FaYoutube /></a>
        <a href="#"><FaFacebook /></a>
        <a href="#"><FaXTwitter /></a>
      </div>

      {/* Bottom Note */}
      <div className="footer-bottom">
        © 2025 MessMate™ Ltd. All rights reserved.
      </div>
    </footer>
  );
}
