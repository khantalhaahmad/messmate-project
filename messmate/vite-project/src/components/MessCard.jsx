// src/components/MessCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../components/MessCard.css";

const MessCard = ({ mess, index }) => {
  // ✅ Ignore first three messes (dummy/test data)
  if (index < 3) return null;

  const deliveryTime = mess.delivery_time || "30–40 mins";
  const distance = mess.distance || "2.4 km";
  const rating = mess.rating || 4.3;
  const offer = mess.offer || "Flat ₹50 OFF above ₹199";

  // ✅ Generate image path from mess name (e.g. "Highway Mutton" → highwaymutton.png)
  const imagePath = `/assets/${mess.name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()]/g, "")}.png`;

  return (
    <Link to={`/messes/id/${mess.mess_id}`} className="messcard-link">
      <div className="messcard">
        {/* ===== Image Section ===== */}
        <div className="messcard-image">
          <img
            src={imagePath}
            alt={mess.name}
            onError={(e) => (e.target.src = "/assets/default.png")}
          />
          <div className="messcard-rating">
            <span>{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        {/* ===== Info Section ===== */}
        <div className="messcard-info">
          <h3 className="messcard-title">{mess.name}</h3>
          <div className="messcard-meta">
            <span>⏱ {deliveryTime}</span>
            <span>•</span>
            <span>{distance}</span>
          </div>

          {offer && <p className="messcard-offer">{offer}</p>}
        </div>
      </div>
    </Link>
  );
};

export default MessCard;
