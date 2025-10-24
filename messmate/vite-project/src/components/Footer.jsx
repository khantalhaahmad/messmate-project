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
      <div className="footer-container">
        {/* 🔶 Brand Section */}
        <div className="footer-brand">
          <img
            src="/assets/messmate.png"
            alt="MessMate Logo"
            className="footer-logo"
          />
          <h1>MessMate</h1>
        </div>

        {/* 🍱 For Messes */}
        <div className="footer-column">
          <h2>For Messe&apos;s</h2>
          <ul>
            <li><a href="#">Partner With Us</a></li>
            <li><a href="#">Apps For You</a></li>
          </ul>
        </div>

        {/* 🚴 For Delivery Partners */}
        <div className="footer-column">
          <h2>For Delivery Partners</h2>
          <ul>
            <li>
  <a
    href="/delivery-partners"
    className="footer-link"
  >
    Partner With Us
  </a>
</li>

            <li><a href="#" className="footer-link">Apps For You</a></li>
          </ul>
        </div>

        {/* 📚 Learn More */}
        <div className="footer-column">
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

      {/* 🌐 Social Links */}
      <div className="footer-social">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaXTwitter /></a>
      </div>

      {/* ⚙️ Bottom Note */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} MessMate™ Ltd. All rights reserved.
      </div>
    </footer>
  );
}
