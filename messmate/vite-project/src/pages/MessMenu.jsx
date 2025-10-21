import React, { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/MessMenu.css";
import { CartContext } from "../Context/CartContext";
import FoodPopup from "../components/FoodPopup";
import ViewCartButton from "../components/ViewCartButton";
import { RotateCcw, CheckCircle } from "lucide-react"; // simplified icons

const MessMenu = () => {
  const { mess_id } = useParams();
  const [mess, setMess] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const { addToCart } = useContext(CartContext);

  // ✅ Fetch mess data
  const fetchMessMenu = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/messes/id/${mess_id}`
      );
      const fetchedMess = response.data;
      setMess(fetchedMess);
      setMenuItems(fetchedMess.menu?.items || []);
      setFilteredItems(fetchedMess.menu?.items || []);
    } catch (error) {
      console.error("❌ Error fetching mess menu:", error);
    }
  }, [mess_id]);

  useEffect(() => {
    fetchMessMenu();
  }, [fetchMessMenu]);

  // ✅ Filter Logic
  const handleFilter = (type) => {
    setFilterType(type);
    if (type === "Veg") {
      setFilteredItems(menuItems.filter((item) => item.type?.toLowerCase() === "veg"));
    } else if (type === "Non-veg") {
      setFilteredItems(menuItems.filter((item) => item.type?.toLowerCase() === "non-veg"));
    } else if (type === "Highly reordered") {
      setFilteredItems(menuItems.filter((item) => item.isHighlyReordered));
    } else {
      setFilteredItems(menuItems);
    }
  };

  const getImagePath = (imagePath) => {
    if (!imagePath) return "/assets/default-food.png";
    if (imagePath.startsWith("/assets/")) return imagePath;
    if (imagePath.startsWith("assets/")) return `/${imagePath}`;
    if (imagePath.startsWith("./assets/")) return imagePath.replace("./", "/");
    return `/assets/${imagePath}`;
  };

  const handleAddClick = (item) => {
    setSelectedItem({
      ...item,
      mess_id: mess.mess_id,
      image: getImagePath(item.image),
    });
  };

  const handleConfirmAdd = (foodItem, quantity) => {
    addToCart({
      ...foodItem,
      mess_id: mess.mess_id,
      quantity,
    });
    setSelectedItem(null);
  };

  // ✅ Swiggy-style filters
  const filters = [
    { name: "Veg", icon: <span className="veg-icon" /> },
    { name: "Non-veg", icon: <span className="nonveg-icon" /> },
    { name: "Highly reordered", icon: <RotateCcw className="reorder-icon" /> },
    { name: "Spicy", icon: <span className="spicy-icon">🌶️</span> },
  ];

  return (
    <div className="mess-menu-container">
      {mess && (
        <>
          {/* ✅ Mess Header */}
          <div className="mess-header">
            <div className="mess-header-left">
              <h2>{mess.name}</h2>
              <p className="mess-subinfo">
                📍 {mess.location || "On Main NH"} • ⏱️ {mess.delivery_time || "25–30 mins"} • ⭐{" "}
                {mess.rating || "4.3"}
              </p>
            </div>
            {mess.offer && <p className="offer-text">{mess.offer}</p>}
          </div>

          {/* ✅ Swiggy-style Filter Buttons */}
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                key={filter.name}
                className={`filter-button ${
                  filterType === filter.name ? "active" : ""
                }`}
                onClick={() => handleFilter(filter.name)}
              >
                {filter.icon}
                <span>{filter.name}</span>
              </button>
            ))}
          </div>

          {/* ✅ Section Title */}
          <h3 className="section-title">Recommended for you</h3>

          {/* ✅ Menu List */}
          <div className="menu-list">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item._id} className="menu-row">
                  <div className="menu-info">
                    <span
                      className={item.type?.toLowerCase() === "veg" ? "dot veg" : "dot nonveg"}
                    ></span>
                    <div className="menu-text">
                      <h4>{item.name}</h4>
                      <p className="price">₹{item.price}</p>
                      {item.description && <p className="desc">{item.description}</p>}
                    </div>
                  </div>

                  <div className="menu-img-container">
                    <img
                      src={getImagePath(item.image)}
                      alt={item.name}
                      onError={(e) => (e.target.src = "/assets/default-food.png")}
                      className="menu-img"
                    />
                    <button className="add-btn" onClick={() => handleAddClick(item)}>
                      ADD +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-items">No items available</p>
            )}
          </div>
        </>
      )}

      {selectedItem && (
        <FoodPopup
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdd={handleConfirmAdd}
        />
      )}

      <ViewCartButton />
    </div>
  );
};

export default MessMenu;
